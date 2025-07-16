package swp391.com.backend.feature.blog.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp391.com.backend.feature.blog.data.Blog;
import swp391.com.backend.feature.blog.data.BlogCategory;
import swp391.com.backend.feature.blog.dto.*;
import swp391.com.backend.feature.blog.mapper.BlogMapper;
import swp391.com.backend.feature.blog.service.BlogService;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/blogs")
@RequiredArgsConstructor
public class BlogController {
    
    private final BlogService blogService;
    private final BlogMapper blogMapper;

    @GetMapping
    public ResponseEntity<List<SimpleBlogDTO>> getAllBlogs() {
        List<SimpleBlogDTO> blogs = blogService.getAllBlogs()
                .stream()
                .map(blogMapper::toSimpleDTO)
                .toList();
        return ResponseEntity.ok(blogs);
    }

    @PostMapping("/filter")
    public ResponseEntity<Map<String, Object>> getBlogsWithFilters(@RequestBody BlogFilterRequest request) {
        Page<Blog> blogPage = blogService.getBlogsWithFilters(request);
        
        List<SimpleBlogDTO> blogs = blogPage.getContent()
                .stream()
                .map(blogMapper::toSimpleDTO)
                .toList();
        
        Map<String, Object> response = new HashMap<>();
        response.put("blogs", blogs);
        response.put("currentPage", blogPage.getNumber());
        response.put("totalPages", blogPage.getTotalPages());
        response.put("totalElements", blogPage.getTotalElements());
        response.put("size", blogPage.getSize());
        response.put("hasNext", blogPage.hasNext());
        response.put("hasPrevious", blogPage.hasPrevious());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BlogDTO> getBlogById(@PathVariable Long id) {
        try {
            Blog blog = blogService.findBlogById(id);
            return ResponseEntity.ok(blogMapper.toDTO(blog));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<BlogDTO> getBlogBySlug(@PathVariable String slug) {
        try {
            Blog blog = blogService.findBlogBySlug(slug);
            return ResponseEntity.ok(blogMapper.toDTO(blog));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<SimpleBlogDTO>> getBlogsByCategory(@PathVariable BlogCategory category) {
        List<SimpleBlogDTO> blogs = blogService.findBlogsByCategory(category)
                .stream()
                .map(blogMapper::toSimpleDTO)
                .toList();
        return ResponseEntity.ok(blogs);
    }

    @GetMapping("/admin/{adminId}")
    public ResponseEntity<List<SimpleBlogDTO>> getBlogsByAdmin(@PathVariable Long adminId) {
        List<SimpleBlogDTO> blogs = blogService.findBlogsByAdmin(adminId)
                .stream()
                .map(blogMapper::toSimpleDTO)
                .toList();
        return ResponseEntity.ok(blogs);
    }

    @GetMapping("/search")
    public ResponseEntity<List<SimpleBlogDTO>> searchBlogs(@RequestParam String keyword) {
        List<SimpleBlogDTO> blogs = blogService.searchBlogs(keyword)
                .stream()
                .map(blogMapper::toSimpleDTO)
                .toList();
        return ResponseEntity.ok(blogs);
    }

    @PostMapping
    public ResponseEntity<?> createBlog(@Valid @RequestBody BlogCreateRequest request) {
        try {
            Blog createdBlog = blogService.createBlog(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(blogMapper.toDTO(createdBlog));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to create blog: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBlog(@PathVariable Long id, @Valid @RequestBody BlogUpdateRequest request) {
        try {
            Blog updatedBlog = blogService.updateBlog(id, request);
            return ResponseEntity.ok(blogMapper.toDTO(updatedBlog));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to update blog: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBlog(@PathVariable Long id) {
        try {
            blogService.deleteBlog(id);
            return ResponseEntity.ok(Map.of("message", "Blog deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to delete blog: " + e.getMessage()));
        }
    }

    @DeleteMapping("/bulk")
    public ResponseEntity<Map<String, String>> deleteMultipleBlogs(@RequestBody List<Long> ids) {
        try {
            blogService.deleteMultipleBlogs(ids);
            return ResponseEntity.ok(Map.of("message", "Blogs deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to delete blogs: " + e.getMessage()));
        }
    }

    @GetMapping("/categories")
    public ResponseEntity<BlogCategory[]> getAllCategories() {
        return ResponseEntity.ok(BlogCategory.values());
    }
}

