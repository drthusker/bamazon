CREATE DATABASE bamazon_db;
USE bamazon_db;

CREATE TABLE products
(
	id int NOT NULL AUTO_INCREMENT,
	item_id INTEGER, 
	product_name varchar(255) NOT NULL,
	department varchar(255) NOT NULL,
	price INTEGER,
	stock_quantity INTEGER,
	PRIMARY KEY (id)
);