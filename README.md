# Nest Comment System

## Overview

The Nest Comment System is a Node.js application designed for a social media platform to handle multi-level comments on posts. This system allows users to create comments, reply to existing comments, and retrieve comments with pagination. It includes user authentication, rate limiting, and is dockerized for deployment.

## Features

- User authentication with JWT
- Create, reply to, and retrieve comments
- Pagination for expanding comments
- Rate limiting to prevent abuse
- Dockerized deployment

## API Endpoints

### User Authentication

- **Register User**

  - `POST /api/user/register`
  - **Request Body:**
    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```
  - **Response:**
    ```json
    {
      "message": "string",
      "user": {
        "username": "string",
        "password": "string",
        "_id": "string",
        "createdAt": "string",
        "updatedAt": "string"
      },
      "token": "string"
    }
    ```

- **Login User**
  - `POST /api/user/login`
  - **Request Body:**
    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```
  - **Response:**
    ```json
    {
      "message": "string",
      "user": {
        "username": "string",
        "password": "string",
        "_id": "string",
        "createdAt": "string",
        "updatedAt": "string"
      },
      "token": "string"
    }
    ```

### Post API

- **Create Post**

  - `POST /api/posts`
  - **Request Headers:**
    ```text
    Authorization: Bearer <token>
    ```
  - **Request Body:**
    ```json
    {
      "title": "string",
      "content": "string"
    }
    ```
  - **Response:**
    ```json
    {
      "message": "string",
      "post": {
        "title": "string",
        "content": "string",
        "userId": "string",
        "_id": "string",
        "createdAt": "string",
        "updatedAt": "string"
      }
    }
    ```

- **Get Post by ID**
  - `GET /api/posts/{postId}`
  - **Response:**
    ```json
    {
      "message": "string",
      "post": {
        "_id": "string",
        "title": "string",
        "content": "string",
        "userId": "string",
        "createdAt": "string",
        "updatedAt": "string"
      }
    }
    ```

### Comment API

- **Create Comment**

  - `POST /api/posts/{postId}/comments`
  - **Request Headers:**
    ```text
    Authorization: Bearer <token>
    ```
  - **Request Body:**
    ```json
    {
      "text": "string"
    }
    ```
  - **Response:**
    ```json
    {
    "message": "string",
    "comment": {
        "postId": "string",
        "userId": "string",
        "text": "string",
        "parentCommentId": "string" | null,
        "_id": "string",
        "createdAt": "string",
        "updatedAt": "string",
        "__v": 0,
        "id": "string"
    }
    }
    ```

- **Reply to Comment**

  - `POST /api/posts/{postId}/comments/{commentId}/reply`
  - **Request Headers:**
    ```text
    Authorization: Bearer <token>
    ```
  - **Request Body:**
    ```json
    {
      "text": "string"
    }
    ```
  - **Response:**
    ```json
    {
      "message": "string",
      "comment": {
        "postId": "string",
        "userId": "string",
        "text": "string",
        "parentCommentId": "string",
        "_id": "string",
        "createdAt": "string",
        "updatedAt": "string",
        "__v": 0,
        "id": "string"
      }
    }
    ```

- **Get Comments for Post**

  - `GET /api/posts/{postId}/comments`
  - **Request Parameters:**
    ```text
    sortBy: "createdAt" | "repliesCount"
    sortOrder: "asc" | "desc"
    ```
  - **Response:**
    ```json
    {
      "message": "string",
      "comments": [
        {
          "id": "string",
          "text": "string",
          "createdAt": "string",
          "postId": "string",
          "parentCommentId": "string",
          "replies": [
            {
              "_id": "string",
              "postId": "string",
              "userId": "string",
              "text": "string",
              "parentCommentId": "string",
              "createdAt": "string",
              "updatedAt": "string",
              "id": "string"
            }
          ],
          "totalReplies": "number"
        }
      ]
    }
    ```

- **Expand Comment with Pagination**
  - `GET /api/posts/{postId}/comments/{commentId}/expand`
  - **Request Parameters:**
    ```text
    page: "number"
    pageSize: "number"
    ```
  - **Response:**
    ```json
    {
      "message": "string",
      "comments": [
        {
          "id": "string",
          "text": "string",
          "createdAt": "string",
          "postId": "string",
          "parentCommentId": "string",
          "replies": [
            {
              "_id": "string",
              "postId": "string",
              "userId": "string",
              "text": "string",
              "parentCommentId": "string",
              "createdAt": "string",
              "updatedAt": "string",
              "id": "string"
            }
          ],
          "totalReplies": "number"
        }
      ]
    }
    ```

## Setup and Installation

1. Clone the repository

   ```bash
   git clone https://github.com/saswatsam786/alter-nested-comments
   cd alter-nested-comments
   ```

2. Install dependencies.

   ```bash
   npm install
   ```

3. Setup environment variables

   Create a .env file in the root directory and add the following:

   ```bash
    PORT=6005
    MONGO_URL=mongodb-uri
    JWT=jwt-secret
   ```

4. Run the application

   ```bash
   npm run watch
   npm run dev
   ```

5. For test

   ```bash
   npm test
   ```

## Docker

1. Build Docker image

   ```bash
    docker build -t nest-comment-system .
   ```

2. Run Docker container

   ```bash
    docker-compose up
   ```
