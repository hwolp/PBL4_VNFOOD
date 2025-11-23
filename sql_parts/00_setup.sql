
CREATE DATABASE IF NOT EXISTS vnfood;
USE vnfood;

DROP TABLE IF EXISTS history;
DROP TABLE IF EXISTS instruction_translations;
DROP TABLE IF EXISTS instructions;
DROP TABLE IF EXISTS dish_ingredients;
DROP TABLE IF EXISTS ingredient_translations;
DROP TABLE IF EXISTS dish_translations;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS ingredients;
DROP TABLE IF EXISTS dishes;


CREATE TABLE dishes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT NOT NULL UNIQUE,
    image_url VARCHAR(255)
);

CREATE TABLE dish_translations (
    dish_id INT NOT NULL,
    language_code VARCHAR(5) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,

    PRIMARY KEY (dish_id, language_code),
    FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE
);

CREATE TABLE ingredients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name_key VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE ingredient_translations (
    ingredient_id INT NOT NULL,
    language_code VARCHAR(5) NOT NULL,
    name VARCHAR(255) NOT NULL,

    PRIMARY KEY (ingredient_id, language_code),
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE
);

CREATE TABLE dish_ingredients (
    dish_id INT NOT NULL,
    ingredient_id INT NOT NULL,
    quantity VARCHAR(100) NOT NULL,

    PRIMARY KEY (dish_id, ingredient_id),
    FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE
);

CREATE TABLE instructions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dish_id INT NOT NULL,
    step_number INT NOT NULL,
    image_url VARCHAR(255),

    FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE
);

CREATE TABLE instruction_translations (
    instruction_id INT NOT NULL,
    language_code VARCHAR(5) NOT NULL,
    description TEXT NOT NULL,

    PRIMARY KEY (instruction_id, language_code),
    FOREIGN KEY (instruction_id) REFERENCES instructions(id) ON DELETE CASCADE
);


CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    dish_id INT NOT NULL,
    recognized_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (dish_id) REFERENCES dishes(id)
);

