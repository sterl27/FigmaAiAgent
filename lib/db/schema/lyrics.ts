import { pgTable, serial, varchar, text, timestamp, integer, real, jsonb, boolean } from 'drizzle-orm/pg-core';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const lyrics = pgTable('lyrics', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  artist: varchar('artist', { length: 255 }),
  content: text('content').notNull(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const lyricAnalysis = pgTable('lyric_analysis', {
  id: serial('id').primaryKey(),
  lyricId: integer('lyric_id').references(() => lyrics.id).notNull(),
  analysisType: varchar('analysis_type', { length: 50 }).notNull(), // 'complexity', 'rhyme', 'flow', 'energy', 'structure'
  score: real('score').notNull(), // 0-100
  confidence: real('confidence').notNull(), // 0-100
  details: jsonb('details'), // Additional analysis data
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const lyricEnhancements = pgTable('lyric_enhancements', {
  id: serial('id').primaryKey(),
  originalLyricId: integer('original_lyric_id').references(() => lyrics.id).notNull(),
  enhancedContent: text('enhanced_content').notNull(),
  style: varchar('style', { length: 100 }).notNull(), // 'tyler-creator', 'complex-metaphor', etc.
  prompt: text('prompt').notNull(),
  assistantId: varchar('assistant_id', { length: 255 }),
  threadId: varchar('thread_id', { length: 255 }),
  isBookmarked: boolean('is_bookmarked').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const userSessions = pgTable('user_sessions', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  sessionData: jsonb('session_data'),
  lastActivity: timestamp('last_activity').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Zod schemas for validation
export const selectLyricsSchema = createSelectSchema(lyrics);
export const insertLyricsSchema = createInsertSchema(lyrics);

export const selectAnalysisSchema = createSelectSchema(lyricAnalysis);
export const insertAnalysisSchema = createInsertSchema(lyricAnalysis);

export const selectEnhancementSchema = createSelectSchema(lyricEnhancements);
export const insertEnhancementSchema = createInsertSchema(lyricEnhancements);

export type Lyrics = z.infer<typeof selectLyricsSchema>;
export type LyricAnalysis = z.infer<typeof selectAnalysisSchema>;
export type LyricEnhancement = z.infer<typeof selectEnhancementSchema>;
export type UserSession = z.infer<typeof selectLyricsSchema>;
