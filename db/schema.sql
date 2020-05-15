DROP DATABASE IF EXISTS development;
CREATE DATABASE development;
DROP DATABASE IF EXISTS test;
CREATE DATABASE test;

USE development;

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT now(),
  updatedAt TIMESTAMP NOT NULL DEFAULT now(),
  username VARCHAR(30) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  passwordHash VARCHAR(255) NOT NULL
);

CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT now(),
  updatedAt TIMESTAMP NOT NULL DEFAULT now(),
  title VARCHAR(255) NOT NULL,
  body TEXT,
  description TEXT,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  authorId INTEGER NOT NULL,
    FOREIGN KEY (authorId) 
    REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE comments (
  id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
  body TEXT,
  createdAt TIMESTAMP NOT NULL DEFAULT now(),
  updatedAt TIMESTAMP NOT NULL DEFAULT now(),
  authorId INTEGER NOT NULL,
    FOREIGN KEY (authorId)
    REFERENCES users(id)
    ON DELETE CASCADE,
  postId INTEGER NOT NULL,
    FOREIGN KEY (postId)
    REFERENCES posts(id)
    ON DELETE CASCADE
);

CREATE TABLE comment_likes (
  id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
  authorId INTEGER NOT NULL,
    FOREIGN KEY (authorId)
    REFERENCES users(id)
    ON DELETE CASCADE,
  commentId INTEGER NOT NULL,
    FOREIGN KEY (commentId)
    REFERENCES comments(id)
    ON DELETE CASCADE
);

CREATE TABLE post_likes (
  id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
  authorId INTEGER NOT NULL,
    FOREIGN KEY (authorId)
    REFERENCES users(id)
    ON DELETE CASCADE,
  postId INTEGER NOT NULL,
    FOREIGN KEY (postId)
    REFERENCES posts(id)
    ON DELETE CASCADE
);

CREATE TABLE test.users LIKE development.users;
CREATE TABLE test.posts LIKE development.posts;
CREATE TABLE test.comments LIKE development.comments;
CREATE TABLE test.comment_likes LIKE development.comment_likes;
CREATE TABLE test.post_likes LIKE development.post_likes;

