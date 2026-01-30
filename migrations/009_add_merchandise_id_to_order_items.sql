-- Add merchandise_id column to order_items for Shopify integration
ALTER TABLE order_items
ADD COLUMN merchandise_id VARCHAR(100);

-- Add index for potential lookups
CREATE INDEX idx_order_items_merchandise_id ON order_items(merchandise_id);
