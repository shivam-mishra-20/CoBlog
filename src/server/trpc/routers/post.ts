import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { posts, postsToCategories, categories } from "../../db/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { generateUniqueSlug } from "../../utils/slugify";
import { TRPCError } from "@trpc/server";

// Validation schemas
const createPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  published: z.boolean().default(false),
  categoryIds: z.array(z.number()).optional().default([]),
});

const updatePostSchema = z.object({
  id: z.number(),
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).optional(),
  excerpt: z.string().optional(),
  published: z.boolean().optional(),
  categoryIds: z.array(z.number()).optional(),
});

export const postRouter = createTRPCRouter({
  // Get all posts with optional category filter
  getAll: publicProcedure
    .input(
      z.object({
        categoryId: z.number().optional(),
        published: z.boolean().optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      
      // Build the query based on filters
      let query = db
        .select({
          id: posts.id,
          title: posts.title,
          slug: posts.slug,
          content: posts.content,
          excerpt: posts.excerpt,
          published: posts.published,
          createdAt: posts.createdAt,
          updatedAt: posts.updatedAt,
        })
        .from(posts)
        .$dynamic();

      // Apply filters
      const conditions = [];
      if (input?.published !== undefined) {
        conditions.push(eq(posts.published, input.published));
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }

      // Execute query and get posts
      let allPosts = await query.orderBy(desc(posts.createdAt));

      // If category filter is provided, filter posts
      if (input?.categoryId) {
        const postIdsInCategory = await db
          .select({ postId: postsToCategories.postId })
          .from(postsToCategories)
          .where(eq(postsToCategories.categoryId, input.categoryId));

        const postIds = postIdsInCategory.map((p) => p.postId);
        allPosts = allPosts.filter((post) => postIds.includes(post.id));
      }

      // Fetch categories for each post
      const postsWithCategories = await Promise.all(
        allPosts.map(async (post) => {
          const postCategories = await db
            .select({
              id: categories.id,
              name: categories.name,
              slug: categories.slug,
            })
            .from(categories)
            .innerJoin(
              postsToCategories,
              eq(categories.id, postsToCategories.categoryId)
            )
            .where(eq(postsToCategories.postId, post.id));

          return {
            ...post,
            categories: postCategories,
          };
        })
      );

      return postsWithCategories;
    }),

  // Get a single post by ID or slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      
      const [post] = await db
        .select()
        .from(posts)
        .where(eq(posts.slug, input.slug))
        .limit(1);

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      // Fetch categories for the post
      const postCategories = await db
        .select({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          description: categories.description,
        })
        .from(categories)
        .innerJoin(
          postsToCategories,
          eq(categories.id, postsToCategories.categoryId)
        )
        .where(eq(postsToCategories.postId, post.id));

      return {
        ...post,
        categories: postCategories,
      };
    }),

  // Get post by ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      
      const [post] = await db
        .select()
        .from(posts)
        .where(eq(posts.id, input.id))
        .limit(1);

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      // Fetch categories for the post
      const postCategories = await db
        .select({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          description: categories.description,
        })
        .from(categories)
        .innerJoin(
          postsToCategories,
          eq(categories.id, postsToCategories.categoryId)
        )
        .where(eq(postsToCategories.postId, post.id));

      return {
        ...post,
        categories: postCategories,
      };
    }),

  // Create a new post
  create: publicProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      
      // Generate unique slug
      const existingPosts = await db.select({ slug: posts.slug }).from(posts);
      const existingSlugs = existingPosts.map((p) => p.slug);
      const slug = generateUniqueSlug(input.title, existingSlugs);

      // Create the post
      const [newPost] = await db
        .insert(posts)
        .values({
          title: input.title,
          slug,
          content: input.content,
          excerpt: input.excerpt,
          published: input.published,
          updatedAt: new Date(),
        })
        .returning();

      // Associate categories if provided
      if (input.categoryIds.length > 0) {
        await db.insert(postsToCategories).values(
          input.categoryIds.map((categoryId) => ({
            postId: newPost!.id,
            categoryId,
          }))
        );
      }

      return newPost;
    }),

  // Update a post
  update: publicProcedure
    .input(updatePostSchema)
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { id, categoryIds, ...updateData } = input;

      // Check if post exists
      const [existingPost] = await db
        .select()
        .from(posts)
        .where(eq(posts.id, id))
        .limit(1);

      if (!existingPost) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      // Update slug if title changed
      let slug = existingPost.slug;
      if (updateData.title && updateData.title !== existingPost.title) {
        const existingPosts = await db
          .select({ slug: posts.slug })
          .from(posts)
          .where(sql`${posts.id} != ${id}`);
        const existingSlugs = existingPosts.map((p) => p.slug);
        slug = generateUniqueSlug(updateData.title, existingSlugs);
      }

      // Update the post
      const [updatedPost] = await db
        .update(posts)
        .set({
          ...updateData,
          slug,
          updatedAt: new Date(),
        })
        .where(eq(posts.id, id))
        .returning();

      // Update categories if provided
      if (categoryIds !== undefined) {
        // Remove existing associations
        await db
          .delete(postsToCategories)
          .where(eq(postsToCategories.postId, id));

        // Add new associations
        if (categoryIds.length > 0) {
          await db.insert(postsToCategories).values(
            categoryIds.map((categoryId) => ({
              postId: id,
              categoryId,
            }))
          );
        }
      }

      return updatedPost;
    }),

  // Delete a post
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      // Check if post exists
      const [existingPost] = await db
        .select()
        .from(posts)
        .where(eq(posts.id, input.id))
        .limit(1);

      if (!existingPost) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      // Delete the post (cascade will handle postsToCategories)
      await db.delete(posts).where(eq(posts.id, input.id));

      return { success: true, message: "Post deleted successfully" };
    }),
});
