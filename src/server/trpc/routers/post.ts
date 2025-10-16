import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { posts, postsToCategories, categories } from "../../db/schema";
import { eq, desc, and, sql, or, ilike } from "drizzle-orm";
import { generateUniqueSlug } from "../../utils/slugify";
import { TRPCError } from "@trpc/server";

// Validation schemas
const createPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  featuredImage: z.string().optional(),
  published: z.boolean().default(false),
  categoryIds: z.array(z.number()).optional().default([]),
  ownerId: z.string().uuid("Invalid owner ID format"),
});

const updatePostSchema = z.object({
  id: z.number(),
  ownerId: z.string().uuid("Invalid owner ID format"),
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).optional(),
  excerpt: z.string().optional(),
  featuredImage: z.string().optional(),
  published: z.boolean().optional(),
  categoryIds: z.array(z.number()).optional(),
});

export const postRouter = createTRPCRouter({
  // Get all posts with optional category filter, search, and pagination
  getAll: publicProcedure
    .input(
      z.object({
        categoryId: z.number().optional(),
        published: z.boolean().optional(),
        search: z.string().optional(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(12),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 12;
      const offset = (page - 1) * limit;
      
      // Build the query based on filters
      let query = db
        .select({
          id: posts.id,
          title: posts.title,
          slug: posts.slug,
          content: posts.content,
          excerpt: posts.excerpt,
          featuredImage: posts.featuredImage,
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

      // Add search filter
      if (input?.search) {
        const searchTerm = `%${input.search}%`;
        conditions.push(
          or(
            ilike(posts.title, searchTerm),
            ilike(posts.content, searchTerm),
            ilike(posts.excerpt ?? "", searchTerm)
          )!
        );
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }

      // Get total count for pagination
      const [{ count }] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(posts)
        .where(conditions.length > 0 ? and(...conditions) : undefined);

      // Execute query and get posts with pagination
      let allPosts = await query
        .orderBy(desc(posts.createdAt))
        .limit(limit)
        .offset(offset);

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

      return {
        posts: postsWithCategories,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit),
        },
      };
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

      // Create the post with ownerId
      const [newPost] = await db
        .insert(posts)
        .values({
          title: input.title,
          slug,
          content: input.content,
          excerpt: input.excerpt,
          featuredImage: input.featuredImage,
          published: input.published,
          ownerId: input.ownerId,
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
      const { id, ownerId, categoryIds, ...updateData } = input;

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

      // Verify ownership
      if (existingPost.ownerId !== ownerId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to edit this post. Only the post owner can make changes.",
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
    .input(z.object({ 
      id: z.number(),
      ownerId: z.string().uuid("Invalid owner ID format"),
    }))
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

      // Verify ownership
      if (existingPost.ownerId !== input.ownerId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to delete this post. Only the post owner can delete it.",
        });
      }

      // Delete the post (cascade will handle postsToCategories)
      await db.delete(posts).where(eq(posts.id, input.id));

      return { success: true, message: "Post deleted successfully" };
    }),

  // Get posts by owner (for "My Posts" view)
  getByOwner: publicProcedure
    .input(z.object({ 
      ownerId: z.string().uuid("Invalid owner ID format"),
    }))
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      
      // Get all posts by this owner
      const ownerPosts = await db
        .select({
          id: posts.id,
          title: posts.title,
          slug: posts.slug,
          content: posts.content,
          excerpt: posts.excerpt,
          featuredImage: posts.featuredImage,
          published: posts.published,
          ownerId: posts.ownerId,
          createdAt: posts.createdAt,
          updatedAt: posts.updatedAt,
        })
        .from(posts)
        .where(eq(posts.ownerId, input.ownerId))
        .orderBy(desc(posts.createdAt));

      // Fetch categories for each post
      const postsWithCategories = await Promise.all(
        ownerPosts.map(async (post) => {
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
});
