-- Migration: Add answers column to UserProgress table
-- Location: backend/migrations/016_add_answers_to_user_progress.sql

ALTER TABLE "UserProgress" ADD COLUMN IF NOT EXISTS "answers" TEXT;
