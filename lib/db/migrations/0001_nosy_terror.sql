CREATE TABLE "chat" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"session_id" varchar(191) NOT NULL,
	"response" text NOT NULL,
	"model_id" text NOT NULL,
	"question" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "component_outputs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chat_id" text NOT NULL,
	"html" text NOT NULL,
	"css" text NOT NULL,
	"styling_notes" text,
	"color_details" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "embeddings" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"resource_id" varchar(191),
	"content" text NOT NULL,
	"embedding" vector(1536) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"chunk_size" integer NOT NULL,
	"overlap" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lyric_analysis" (
	"id" serial PRIMARY KEY NOT NULL,
	"lyric_id" integer NOT NULL,
	"analysis_type" varchar(50) NOT NULL,
	"score" real NOT NULL,
	"confidence" real NOT NULL,
	"details" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lyric_enhancements" (
	"id" serial PRIMARY KEY NOT NULL,
	"original_lyric_id" integer NOT NULL,
	"enhanced_content" text NOT NULL,
	"style" varchar(100) NOT NULL,
	"prompt" text NOT NULL,
	"assistant_id" varchar(255),
	"thread_id" varchar(255),
	"is_bookmarked" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lyrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"artist" varchar(255),
	"content" text NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"session_data" jsonb,
	"last_activity" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"resource_id" varchar(191),
	"url" text NOT NULL,
	"mime_type" text NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "title" text NOT NULL;--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "description" text NOT NULL;--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "url" text;--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "source" text DEFAULT 'tailwind_css_v3' NOT NULL;--> statement-breakpoint
ALTER TABLE "component_outputs" ADD CONSTRAINT "component_outputs_chat_id_chat_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chat"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "embeddings" ADD CONSTRAINT "embeddings_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lyric_analysis" ADD CONSTRAINT "lyric_analysis_lyric_id_lyrics_id_fk" FOREIGN KEY ("lyric_id") REFERENCES "public"."lyrics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lyric_enhancements" ADD CONSTRAINT "lyric_enhancements_original_lyric_id_lyrics_id_fk" FOREIGN KEY ("original_lyric_id") REFERENCES "public"."lyrics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "embeddingIndex" ON "embeddings" USING hnsw ("embedding" vector_cosine_ops);