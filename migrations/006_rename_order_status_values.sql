-- Migration: Rename order status enum values
-- pending -> unpaid, confirmed -> paid

-- ============ UP ============

ALTER TYPE order_status RENAME VALUE 'pending' TO 'unpaid';
ALTER TYPE order_status RENAME VALUE 'confirmed' TO 'paid';

-- ============ DOWN (run manually to rollback) ============
-- ALTER TYPE order_status RENAME VALUE 'unpaid' TO 'pending';
-- ALTER TYPE order_status RENAME VALUE 'paid' TO 'confirmed';
