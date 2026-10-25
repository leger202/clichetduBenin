import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const photos = pgTable(
  "photos",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 140 }).notNull(),
    author: varchar("author", { length: 80 }),
    description: text("description"),
    department: varchar("department", { length: 40 }).notNull(),
    city: varchar("city", { length: 80 }),
    mimeType: varchar("mime_type", { length: 40 }).notNull(),
    imageData: text("image_data").notNull(),
    width: integer("width"),
    height: integer("height"),
    likes: integer("likes").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("photos_department_idx").on(t.department),
    index("photos_created_at_idx").on(t.createdAt),
    index("photos_likes_idx").on(t.likes),
  ]
);

/** Un vote = un utilisateur (identifié par un jeton navigateur) par cliché. */
export const photoLikes = pgTable(
  "photo_likes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    photoId: uuid("photo_id")
      .notNull()
      .references(() => photos.id, { onDelete: "cascade" }),
    voter: varchar("voter", { length: 64 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("photo_likes_unique").on(t.photoId, t.voter),
    index("photo_likes_photo_idx").on(t.photoId),
  ]
);

export const comments = pgTable(
  "comments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    photoId: uuid("photo_id")
      .notNull()
      .references(() => photos.id, { onDelete: "cascade" }),
    author: varchar("author", { length: 80 }),
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("comments_photo_idx").on(t.photoId)]
);

export type Photo = typeof photos.$inferSelect;
export type Comment = typeof comments.$inferSelect;

/** Metadata without the heavy base64 payload — safe to ship to the client. */
export type PhotoMeta = Omit<Photo, "imageData"> & { commentCount: number };
