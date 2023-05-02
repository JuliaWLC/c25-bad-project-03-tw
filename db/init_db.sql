DROP DATABASE IF EXISTS project2;
CREATE DATABASE project2;

\c project2

DROP TABLE IF EXISTS users;
CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	last_name VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    contact_num INTEGER NOT NULL,
    default_district VARCHAR(255) NOT NULL,
    default_room VARCHAR(255) NOT NULL,
    default_floor VARCHAR(255) NOT NULL,
    default_building VARCHAR(255) NOT NULL,
    default_street VARCHAR(255) NOT NULL,
    default_coordinates POINT
);

DROP TABLE IF EXISTS drivers;
CREATE TABLE drivers (
	id SERIAL PRIMARY KEY,
	last_name VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    contact_num INTEGER NOT NULL,
    car_license_num VARCHAR(255) NOT NULL,
    car_type VARCHAR(255) DEFAULT 'Van'
);

DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
	id SERIAL PRIMARY KEY,
	pick_up_date DATE,
	pick_up_time TIME(0) WITHOUT TIME ZONE ,
    pick_up_district VARCHAR(255) NOT NULL,
    pick_up_room VARCHAR(255) NOT NULL,
    pick_up_floor VARCHAR(255) NOT NULL,
    pick_up_building VARCHAR(255) NOT NULL,
    pick_up_street VARCHAR(255) NOT NULL,
    deliver_district VARCHAR(255) NOT NULL, 
    deliver_room VARCHAR(255) NOT NULL,
    deliver_floor VARCHAR(255) NOT NULL,
    deliver_building VARCHAR(255) NOT NULL,
    deliver_street VARCHAR(255) NOT NULL,
    users_id INTEGER,
	FOREIGN KEY (users_id) REFERENCES users(id),
    drivers_id INTEGER,
	FOREIGN KEY (drivers_id) REFERENCES drivers(id),
    receiver_name VARCHAR(255),
    receiver_contact VARCHAR(255),
	distance_km INTEGER ,
    distance_price INTEGER DEFAULT 10,
    reference_code UUID DEFAULT gen_random_uuid(),
    orders_status VARCHAR(255) DEFAULT 'not pay yet',
    token VARCHAR(50),
    remarks VARCHAR(255) NULL,
    created_at TIMESTAMP(0) WITHOUT TIME ZONE,
	updated_at TIMESTAMP DEFAULT NOW()
);


DROP TABLE IF EXISTS payment_method;
CREATE TABLE payment_method (
	id SERIAL PRIMARY KEY,
	method VARCHAR(255) DEFAULT 'VISA'
);

DROP TABLE IF EXISTS animals;
CREATE TABLE animals (
	id SERIAL PRIMARY KEY,
	animals_name VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL
);


DROP TABLE IF EXISTS order_animals;
CREATE TABLE order_animals(
	id SERIAL PRIMARY KEY,
    orders_id INTEGER,
	FOREIGN KEY (orders_id) REFERENCES orders(id),
    animals_id INTEGER,
	FOREIGN KEY (animals_id) REFERENCES animals(id),
    animals_amount INTEGER NOT NULL,
    animals_history_price INTEGER NOT NULL
);




-- INSERT INTO orders (created_at) VALUES ('2023-03-29 00:30:00', '2023-03-29 09:31:00', '2023-03-29 09:32:00', '2023-03-30 09:30:00', '2023-03-30 09:31:00', '2023-03-30 09:32:00', '2023-03-31 09:30:00', '2023-03-31 09:31:00', '2023-03-31 09:32:00');
-- INSERT INTO users (username, password) VALUES ('jason', 'jason'), ('peter', 'peter');

