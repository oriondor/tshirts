-- Migration: Create orders table
-- Run with: psql -U tshirt -d tshirt -f migrations/003_create_orders.sql

-- ============ UP ============

-- Create order status enum
DO $$ BEGIN
    CREATE TYPE order_status AS ENUM (
        'pending',
        'confirmed',
        'processing',
        'shipped',
        'delivered',
        'cancelled'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    status order_status NOT NULL DEFAULT 'pending',
    total_price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'EUR',
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Index for user order lookups
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- Index for status filtering
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Index for chronological order listing
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);


-- ============ DOWN (run manually to rollback) ============
-- DROP TABLE IF EXISTS orders;
-- DROP TYPE IF EXISTS order_status;
