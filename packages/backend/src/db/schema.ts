import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const artworks = sqliteTable('artworks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  year: integer('year'),
  decade: text('decade'),
  medium: text('medium'),
  subject: text('subject'),
  location: text('location'),
  signature: text('signature'),
  dimensions: text('dimensions'),
  description: text('description'),
  imagePath: text('image_path'),
  dominantColor: text('dominant_color'),
  hasWatermark: integer('has_watermark', { mode: 'boolean' }).default(true),
  displayOrder: integer('display_order').default(0),
  published: integer('published', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').default(sql`(datetime('now'))`),
})

export const trustees = sqliteTable('trustees', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  role: text('role').notNull(),
  qualifications: text('qualifications'),
  bio: text('bio'),
  email: text('email'),
  photoPath: text('photo_path'),
  displayOrder: integer('display_order').default(0),
})

export const pageContent = sqliteTable('page_content', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  updatedAt: text('updated_at').default(sql`(datetime('now'))`),
})

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
})

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  expiresAt: text('expires_at').notNull(),
})
