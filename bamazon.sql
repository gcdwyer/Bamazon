DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  price INT(10) default 0,
  stock_quantity INT(10) default 0,
  product_sales INT(10) default 0,
  PRIMARY KEY (id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES("television", "electornics", 100, 10);
INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES("coffe table", "furniture", 125, 6);
INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES("light bulb", "electornics", 5, 50);
INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES("vitamins", "health", 20, 20);
INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES("jeans", "clothing", 27, 8);
INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES("soap", "health", 8, 30);
INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES("shoes", "clothing", 32, 13);
INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES("chair", "furniture", 26, 4);
INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES("bike", "sports", 200, 10);
INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES("basketball", "sports", 30, 12);


############################################################

CREATE TABLE departments(
  id INT NOT NULL AUTO_INCREMENT,
  department_id VARCHAR(50) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  over_head_costs VARCHAR(50) NOT NULL,
  PRIMARY KEY (id)
);


#########################   JOIN   ##################################################
SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(products.product_sales) 
AS product_sales 
FROM departments 
LEFT JOIN products 
ON departments.department_name = products.department_name 
ROUP BY departments.department_name 
ORDER BY departments.department_id