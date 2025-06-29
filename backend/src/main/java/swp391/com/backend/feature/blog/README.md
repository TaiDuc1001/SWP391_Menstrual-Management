# Blog Management API Documentation

This document provides comprehensive information about the Blog Management API endpoints for both admin and public access.

## Overview

The Blog Management API provides full CRUD (Create, Read, Update, Delete) operations for managing blog posts in the Menstrual Management System. The API is split into two main controllers:

- **AdminBlogController** (`/api/admin/blogs`): For administrative operations (CRUD)
- **PublicBlogController** (`/api/blogs`): For public read-only access

## Data Models

### Blog Entity
```java
{
    "id": "Long",
    "slug": "String (unique)",
    "title": "String",
    "content": "String (large text)",
    "category": "BlogCategory (enum)",
    "admin": "Admin (reference)",
    "publishDate": "LocalDateTime",
    "createdAt": "LocalDateTime",
    "updatedAt": "LocalDateTime"
}
```

### Blog Categories
```java
public enum BlogCategory {
    STI_OVERVIEW,
    TESTING_AND_DIAGNOSIS,
    PREVENTION,
    TREATMENT,
    SYMPTOMS_AND_SIGNS,
    LIVING_WITH_STI,
    PARTNER_NOTIFICATION,
    MYTHS_AND_FACTS,
    RESOURCES_AND_SUPPORT,
    VACCINATION,
    RISK_FACTORS,
    YOUTH_EDUCATION,
    PREGNANCY_AND_STI,
    LGBTQ_HEALTH,
    POLICY_AND_ADVOCACY
}
```

## Admin Blog API Endpoints

### Base URL: `/api/admin/blogs`

#### 1. Get All Blogs
- **Method**: `GET`
- **Endpoint**: `/api/admin/blogs`
- **Description**: Retrieve all blogs ordered by publish date (descending)
- **Response**: `List<SimpleBlogDTO>`

#### 2. Get Blogs with Filters (Pagination)
- **Method**: `POST`
- **Endpoint**: `/api/admin/blogs/filter`
- **Description**: Get paginated and filtered blogs
- **Request Body**: `BlogFilterRequest`
```json
{
    "category": "STI_OVERVIEW",
    "adminId": 1,
    "keyword": "search term",
    "sortBy": "publishDate",
    "sortDirection": "desc",
    "page": 0,
    "size": 20
}
```
- **Response**: Paginated response with metadata
```json
{
    "blogs": "List<SimpleBlogDTO>",
    "currentPage": 0,
    "totalPages": 5,
    "totalElements": 100,
    "size": 20,
    "hasNext": true,
    "hasPrevious": false
}
```

#### 3. Get Blog by ID
- **Method**: `GET`
- **Endpoint**: `/api/admin/blogs/{id}`
- **Description**: Retrieve a specific blog by its ID
- **Response**: `BlogDTO`

#### 4. Get Blog by Slug
- **Method**: `GET`
- **Endpoint**: `/api/admin/blogs/slug/{slug}`
- **Description**: Retrieve a specific blog by its slug
- **Response**: `BlogDTO`

#### 5. Get Blogs by Category
- **Method**: `GET`
- **Endpoint**: `/api/admin/blogs/category/{category}`
- **Description**: Retrieve all blogs in a specific category
- **Response**: `List<SimpleBlogDTO>`

#### 6. Get Blogs by Admin
- **Method**: `GET`
- **Endpoint**: `/api/admin/blogs/admin/{adminId}`
- **Description**: Retrieve all blogs created by a specific admin
- **Response**: `List<SimpleBlogDTO>`

#### 7. Search Blogs
- **Method**: `GET`
- **Endpoint**: `/api/admin/blogs/search?keyword={keyword}`
- **Description**: Search blogs by title or content
- **Response**: `List<SimpleBlogDTO>`

#### 8. Create Blog
- **Method**: `POST`
- **Endpoint**: `/api/admin/blogs`
- **Description**: Create a new blog post
- **Request Body**: `BlogCreateRequest`
```json
{
    "title": "Blog Title",
    "content": "Blog content...",
    "category": "STI_OVERVIEW",
    "adminId": 1,
    "publishDate": "2024-01-01T12:00:00"
}
```
- **Response**: `BlogDTO`

#### 9. Update Blog
- **Method**: `PUT`
- **Endpoint**: `/api/admin/blogs/{id}`
- **Description**: Update an existing blog post
- **Request Body**: `BlogUpdateRequest`
```json
{
    "title": "Updated Title",
    "content": "Updated content...",
    "category": "PREVENTION",
    "publishDate": "2024-01-02T12:00:00"
}
```
- **Response**: `BlogDTO`

#### 10. Delete Blog
- **Method**: `DELETE`
- **Endpoint**: `/api/admin/blogs/{id}`
- **Description**: Delete a specific blog post
- **Response**: Success message

#### 11. Bulk Delete Blogs
- **Method**: `DELETE`
- **Endpoint**: `/api/admin/blogs/bulk`
- **Description**: Delete multiple blog posts
- **Request Body**: `List<Long>` (array of blog IDs)
- **Response**: Success message

#### 12. Get All Categories
- **Method**: `GET`
- **Endpoint**: `/api/admin/blogs/categories`
- **Description**: Retrieve all available blog categories
- **Response**: `BlogCategory[]`

## Public Blog API Endpoints

### Base URL: `/api/blogs`

#### 1. Get All Blogs
- **Method**: `GET`
- **Endpoint**: `/api/blogs`
- **Description**: Retrieve all published blogs (public access)
- **Response**: `List<SimpleBlogDTO>`

#### 2. Get Blog by ID
- **Method**: `GET`
- **Endpoint**: `/api/blogs/{id}`
- **Description**: Retrieve a specific blog by its ID (public access)
- **Response**: `BlogDTO`

#### 3. Get Blog by Slug
- **Method**: `GET`
- **Endpoint**: `/api/blogs/slug/{slug}`
- **Description**: Retrieve a specific blog by its slug (public access)
- **Response**: `BlogDTO`

#### 4. Get Blogs by Category
- **Method**: `GET`
- **Endpoint**: `/api/blogs/category/{category}`
- **Description**: Retrieve all blogs in a specific category (public access)
- **Response**: `List<SimpleBlogDTO>`

#### 5. Search Blogs
- **Method**: `GET`
- **Endpoint**: `/api/blogs/search?keyword={keyword}`
- **Description**: Search blogs by title or content (public access)
- **Response**: `List<SimpleBlogDTO>`

#### 6. Get All Categories
- **Method**: `GET`
- **Endpoint**: `/api/blogs/categories`
- **Description**: Retrieve all available blog categories (public access)
- **Response**: `BlogCategory[]`

## DTOs (Data Transfer Objects)

### SimpleBlogDTO
```json
{
    "id": 1,
    "slug": "understanding-hpv",
    "title": "Understanding HPV and Its Risks",
    "excerpt": "Human Papillomavirus (HPV) is one of the most common sexually transmitted infections worldwide...",
    "category": "STI_OVERVIEW",
    "authorName": "Dr. Smith",
    "publishDate": "2024-01-01T12:00:00",
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T11:00:00"
}
```

### BlogDTO
```json
{
    "id": 1,
    "slug": "understanding-hpv",
    "title": "Understanding HPV and Its Risks",
    "content": "Full blog content here...",
    "category": "STI_OVERVIEW",
    "adminId": 1,
    "authorName": "Dr. Smith",
    "publishDate": "2024-01-01T12:00:00",
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T11:00:00"
}
```

### BlogCreateRequest
```json
{
    "title": "Blog Title (required)",
    "content": "Blog content (required)",
    "category": "STI_OVERVIEW (required)",
    "adminId": 1,
    "publishDate": "2024-01-01T12:00:00 (optional)"
}
```

### BlogUpdateRequest
```json
{
    "title": "Updated Title (optional)",
    "content": "Updated content (optional)",
    "category": "PREVENTION (optional)",
    "publishDate": "2024-01-02T12:00:00 (optional)"
}
```

### BlogFilterRequest
```json
{
    "category": "STI_OVERVIEW (optional)",
    "adminId": 1,
    "keyword": "search term (optional)",
    "sortBy": "publishDate (default)",
    "sortDirection": "desc (default)",
    "page": 0,
    "size": 20
}
```

## Features

### 1. Automatic Slug Generation
- Slugs are automatically generated from blog titles
- Special characters are removed and spaces are replaced with hyphens
- Unique slugs are ensured by adding counters if duplicates exist

### 2. Search Functionality
- Search through blog titles and content
- Case-insensitive keyword matching

### 3. Categorization
- Blogs are categorized using predefined enum values
- Filter blogs by category

### 4. Pagination Support
- Server-side pagination for large datasets
- Configurable page size and sorting

### 5. Bulk Operations
- Bulk delete multiple blogs at once

### 6. Timestamp Tracking
- Automatic creation and update timestamps
- Manual publish date setting

## Error Handling

The API returns appropriate HTTP status codes:

- `200 OK`: Successful operation
- `201 Created`: Blog created successfully
- `400 Bad Request`: Invalid input data
- `404 Not Found`: Blog not found
- `500 Internal Server Error`: Server error

Error responses include descriptive messages:
```json
{
    "error": "Failed to create blog: Invalid admin ID"
}
```

## Usage Examples

### Create a Blog
```bash
curl -X POST http://localhost:8080/api/admin/blogs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Understanding STI Prevention",
    "content": "This blog discusses various methods of STI prevention...",
    "category": "PREVENTION",
    "adminId": 1
  }'
```

### Get Paginated Blogs
```bash
curl -X POST http://localhost:8080/api/admin/blogs/filter \
  -H "Content-Type: application/json" \
  -d '{
    "category": "STI_OVERVIEW",
    "page": 0,
    "size": 10,
    "sortBy": "publishDate",
    "sortDirection": "desc"
  }'
```

### Search Blogs
```bash
curl "http://localhost:8080/api/blogs/search?keyword=HPV"
```

This API provides comprehensive blog management functionality suitable for a health information system focusing on menstrual and sexual health topics.
