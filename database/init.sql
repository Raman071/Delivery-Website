-- Create database (run this first in psql)
CREATE DATABASE foodieexpress;

-- Connect to the database and run these:

-- Create restaurants table
CREATE TABLE restaurants (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  cuisine_type VARCHAR(50) NOT NULL,
  location VARCHAR(100) NOT NULL,
  rating DECIMAL(3, 2),
  delivery_time VARCHAR(20),
  image_url VARCHAR(255)
);

-- Create menu_items table
CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY,
  restaurant_id INTEGER REFERENCES restaurants(id),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(50)
);

-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  address TEXT
);

-- Create orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  restaurant_id INTEGER REFERENCES restaurants(id),
  total_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  menu_item_id INTEGER REFERENCES menu_items(id),
  quantity INTEGER NOT NULL,
  price_at_order DECIMAL(10, 2) NOT NULL
);

-- Insert sample data
INSERT INTO restaurants (name, cuisine_type, location, rating, delivery_time, image_url)
VALUES 
  ('Burger Palace', 'Fast Food', 'Kokkola', 4.5, '20-30 min', 'https://www.svgrepo.com/show/287733/burger.svg'),
  ('Pizza Heaven', 'Italian', 'Vaasa', 4.2, '25-35 min', 'https://k40lasercutter.com/wp-content/uploads/2024/09/Free-Cute-Mascot-Pizza-SVG-Black-and-White-SVG-Vector-File-for-Laser-Cutting.jpg'),
  ('Sushi World', 'Japanese', 'Oulu', 4.7, '30-40 min', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQc3h67KDifJh4bnap6SKJXavff4FDKgqYzGw&s');

INSERT INTO menu_items (restaurant_id, name, description, price, category)
VALUES
  (1, 'Classic Burger', 'Beef patty with lettuce, tomato, and special sauce', 8.99, 'Main'),
  (1, 'Cheese Fries', 'Crispy fries topped with melted cheese', 4.99, 'Side'),
  (2, 'Margherita Pizza', 'Classic pizza with tomato sauce and mozzarella', 12.99, 'Main'),
  (2, 'Garlic Bread', 'Toasted bread with garlic butter', 3.99, 'Side'),
  (3, 'California Roll', 'Crab, avocado, and cucumber roll', 9.99, 'Sushi'),
  (3, 'Miso Soup', 'Traditional Japanese soybean soup', 2.99, 'Starter');