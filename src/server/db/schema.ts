import { relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  primaryKey,
} from "drizzle-orm/pg-core";

// Posts table
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  published: boolean("published").notNull().default(false),
  ownerId: text("owner_id").notNull(), // UUID stored in localStorage
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Post-Category junction table (many-to-many relationship)
export const postsToCategories = pgTable(
  "posts_to_categories",
  {
    postId: serial("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    categoryId: serial("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.postId, t.categoryId] }),
  })
);

// Define relations for Drizzle's query builder
export const postsRelations = relations(posts, ({ many }) => ({
  postsToCategories: many(postsToCategories),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  postsToCategories: many(postsToCategories),
}));

export const postsToCategoriesRelations = relations(
  postsToCategories,
  ({ one }) => ({
    post: one(posts, {
      fields: [postsToCategories.postId],
      references: [posts.id],
    }),
    category: one(categories, {
      fields: [postsToCategories.categoryId],
      references: [categories.id],
    }),
  })
);

// Export types for use in the application
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type PostToCategory = typeof postsToCategories.$inferSelect;
export type NewPostToCategory = typeof postsToCategories.$inferInsert;
