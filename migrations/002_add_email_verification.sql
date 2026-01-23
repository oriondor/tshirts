-- Migration: Add email verification fields
-- Run with: psql -U tshirt -d tshirt -f migrations/002_add_email_verification.sql

-- ============ UP ============
-- Add email verification fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token VARCHAR(64);
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token_expiry TIMESTAMP;

-- Google users are automatically verified
UPDATE users SET email_verified = TRUE WHERE google_id IS NOT NULL;


-- ============ DOWN (run manually to rollback) ============
-- ALTER TABLE users DROP COLUMN IF EXISTS email_verified;
-- ALTER TABLE users DROP COLUMN IF EXISTS verification_token;
-- ALTER TABLE users DROP COLUMN IF EXISTS verification_token_expiry;
