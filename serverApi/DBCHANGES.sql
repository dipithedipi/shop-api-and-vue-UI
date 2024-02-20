-- Products image
ALTER TABLE products
ADD img VARCHAR(255) NOT NULL;

UPDATE products
SET img="https://industrialphysics.com/wp-content/uploads/2022/08/product-image-coming-soon-128.png"


-- Customers image
ALTER TABLE customers
ADD img VARCHAR(255) NOT NULL;

UPDATE customers
SET img="https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"
