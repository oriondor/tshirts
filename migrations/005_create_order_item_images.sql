-- Migration: Create order_item_images table
-- Run with: psql -U tshirt -d tshirt -f migrations/005_create_order_item_images.sql

-- ============ UP ============

CREATE TABLE IF NOT EXISTS order_item_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size INTEGER NOT NULL,
    storage_path TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Index for order item image lookups
CREATE INDEX IF NOT EXISTS idx_order_item_images_order_item_id ON order_item_images(order_item_id);


-- ============ DOWN (run manually to rollback) ============
-- DROP TABLE IF EXISTS order_item_images;
