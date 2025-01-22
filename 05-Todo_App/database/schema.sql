Create database todo_app;
USE todo_app;
CREATE TABLE todos(
    id INT AUTO_INCREMENT primary key,
    task VARCHAR(255) NOT NULL,
    completed boolean default false
);