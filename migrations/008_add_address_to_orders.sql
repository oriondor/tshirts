-- Add address_id column to orders table
ALTER TABLE orders ADD COLUMN address_id UUID REFERENCES addresses(id);
