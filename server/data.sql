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

CREATE TABLE designers (
    designer_id SERIAL PRIMARY KEY,
    user_id SERIAL REFERENCES users(user_id),
    cnic_number VARCHAR(50) UNIQUE NOT NULL,
    cnic_pic BYTEA UNIQUE NOT NULL,
    bio VARCHAR(255) NOT NULL,
    ratings VARCHAR(255) NOT NULL,
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


username,
          email,
          password: pwd,
          location,
          Profile_pic,
          cnic_number,
          cnic_pic,
          phoneNo,