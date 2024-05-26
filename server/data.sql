CREATE DATABASE d3fiy;


CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name  VARCHAR(50) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    location VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    profile_pic BYTEA,
    password VARCHAR(255) NOT NULL,
    phoneNo VARCHAR(255) NOT NULL

);

CREATE TABLE Designer (
    designer_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    cnic_number VARCHAR(50) UNIQUE NOT NULL,
    cnic_pic BYTEA UNIQUE NOT NULL,
    bio VARCHAR(255) NOT NULL,
    ratings VARCHAR(255)
);

CREATE TABLE printer_owner(
    printer_owner_id SERIAL PRIMARY KEY,
    user_id SERIAL REFERENCES users(user_id),
    cnic_number VARCHAR(50) UNIQUE NOT NULL,
    cnic_pic BYTEA UNIQUE NOT NULL,
    bio VARCHAR(255) NOT NULL,
    ratings VARCHAR(255) NOT NULL,
    quality_certificate
);

CREATE TABLE category(
    category_id SERIAL PRIMARY KEY,
    parent_category_id SERIAL REFERENCES category(category_id), \\ self REFERENCES relation
    type VARCHAR(50) UNIQUE NOT NULL,
    image BYTEA UNIQUE NOT NULL,
);


CREATE TABLE model(
    model_id SERIAL PRIMARY KEY,
    category_id SERIAL REFERENCES category(category_id)
    designer_id SERIAL REFERENCES designers(designer_id),
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(50) UNIQUE NOT NULL,
    price VARCHAR(255) NOT NULL,
    is_free boolean NOT NULL,
    image BYTEA NOT NULL,
    likes_count INT,
    download_count INT
);

INSERT INTO Category
SELECT * FROM category;


ALTER TABLE "Users" ALTER COLUMN "profile_pic" TYPE VARCHAR;
ALTER TABLE "Designers" ALTER COLUMN "cnic_pic" TYPE VARCHAR;


username,
          email,
          password: pwd,
          location,
          Profile_pic,
          cnic_number,
          cnic_pic,
          phoneNo,