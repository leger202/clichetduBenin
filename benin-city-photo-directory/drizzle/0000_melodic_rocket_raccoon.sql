CREATE TABLE "comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"photo_id" uuid NOT NULL,
	"author" varchar(80),
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "photo_likes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"photo_id" uuid NOT NULL,
	"voter" varchar(64) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "photos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(140) NOT NULL,
	"author" varchar(80),
	"description" text,
	"department" varchar(40) NOT NULL,
	"city" varchar(80),
	"mime_type" varchar(40) NOT NULL,
	"image_data" text NOT NULL,
	"width" integer,
	"height" integer,
	"likes" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_photo_id_photos_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."photos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "photo_likes" ADD CONSTRAINT "photo_likes_photo_id_photos_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."photos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "comments_photo_idx" ON "comments" USING btree ("photo_id");--> statement-breakpoint
CREATE UNIQUE INDEX "photo_likes_unique" ON "photo_likes" USING btree ("photo_id","voter");--> statement-breakpoint
CREATE INDEX "photo_likes_photo_idx" ON "photo_likes" USING btree ("photo_id");--> statement-breakpoint
CREATE INDEX "photos_department_idx" ON "photos" USING btree ("department");--> statement-breakpoint
CREATE INDEX "photos_created_at_idx" ON "photos" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "photos_likes_idx" ON "photos" USING btree ("likes");