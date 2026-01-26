-- Migration: Create order_items table
-- Run with: psql -U tshirt -d tshirt -f migrations/004_create_order_items.sql

-- ============ UP ============

CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_type VARCHAR(50) NOT NULL,
    design_id VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    design_color VARCHAR(50),
    size VARCHAR(10),
    product_color VARCHAR(50),
    name VARCHAR(255),
    secondary_text VARCHAR(255),
    special_request TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Index for order item lookups
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);


-- ============ DOWN (run manually to rollback) ============
-- DROP TABLE IF EXISTS order_items;
