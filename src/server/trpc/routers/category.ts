import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { categories, postsToCategories, posts } from "../../db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { generateUniqueSlug } from "../../utils/slugify";
import { TRPCError } from "@trpc/server";

// Validation schemas
const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().optional(),
});

const updateCategorySchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
});

export const categoryRouter = createTRPCRouter({
  // Get all categories
  getAll: publicProcedure.query(async ({ ctx }) => {
    const { db } = ctx;
    
    const allCategories = await db
      .select()
      .from(categories)
      .orderBy(categories.name);

    // Get post count for each category
    const categoriesWithCount = await Promise.all(
      allCategories.map(async (category) => {
        const postCount = await db
          .select({ count: sql<number>`count(*)` })
          .from(postsToCategories)
          .where(eq(postsToCategories.categoryId, category.id));

        return {
          ...category,
          postCount: Number(postCount[0]?.count || 0),
        };
      })
    );

    return categoriesWithCount;
  }),

  // Get a single category by ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      
      const [category] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, input.id))
        .limit(1);

      if (!category) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      // Get posts in this category
      const categoryPosts = await db
        .select({
          id: posts.id,
          title: posts.title,
          slug: posts.slug,
          excerpt: posts.excerpt,
          published: posts.published,
          createdAt: posts.createdAt,
        })
        .from(posts)
        .innerJoin(
          postsToCategories,
          eq(posts.id, postsToCategories.postId)
        )
        .where(eq(postsToCategories.categoryId, input.id))
        .orderBy(desc(posts.createdAt));

      return {
        ...category,
        posts: categoryPosts,
      };
    }),

  // Get category by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      
      const [category] = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, input.slug))
        .limit(1);

      if (!category) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      // Get posts in this category
      const categoryPosts = await db
        .select({
          id: posts.id,
          title: posts.title,
          slug: posts.slug,
          excerpt: posts.excerpt,
          published: posts.published,
          createdAt: posts.createdAt,
        })
        .from(posts)
        .innerJoin(
          postsToCategories,
          eq(posts.id, postsToCategories.postId)
        )
        .where(eq(postsToCategories.categoryId, category.id))
        .orderBy(desc(posts.createdAt));

      return {
        ...category,
        posts: categoryPosts,
      };
    }),

  // Create a new category
  create: publicProcedure
    .input(createCategorySchema)
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      
      // Generate unique slug
      const existingCategories = await db
        .select({ slug: categories.slug })
        .from(categories);
      const existingSlugs = existingCategories.map((c) => c.slug);
      const slug = generateUniqueSlug(input.name, existingSlugs);

      // Create the category
      const [newCategory] = await db
        .insert(categories)
        .values({
          name: input.name,
          slug,
          description: input.description,
          updatedAt: new Date(),
        })
        .returning();

      return newCategory;
    }),

  // Update a category
  update: publicProcedure
    .input(updateCategorySchema)
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { id, ...updateData } = input;

      // Check if category exists
      const [existingCategory] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, id))
        .limit(1);

      if (!existingCategory) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      // Update slug if name changed
      let slug = existingCategory.slug;
      if (updateData.name && updateData.name !== existingCategory.name) {
        const existingCategories = await db
          .select({ slug: categories.slug })
          .from(categories)
          .where(sql`${categories.id} != ${id}`);
        const existingSlugs = existingCategories.map((c) => c.slug);
        slug = generateUniqueSlug(updateData.name, existingSlugs);
      }

      // Update the category
      const [updatedCategory] = await db
        .update(categories)
        .set({
          ...updateData,
          slug,
          updatedAt: new Date(),
        })
        .where(eq(categories.id, id))
        .returning();

      return updatedCategory;
    }),

  // Delete a category
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      // Check if category exists
      const [existingCategory] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, input.id))
        .limit(1);

      if (!existingCategory) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      // Delete the category (cascade will handle postsToCategories)
      await db.delete(categories).where(eq(categories.id, input.id));

      return { success: true, message: "Category deleted successfully" };
    }),
});
