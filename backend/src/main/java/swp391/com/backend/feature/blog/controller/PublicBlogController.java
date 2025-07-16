package swp391.com.backend.feature.blog.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp391.com.backend.feature.blog.data.Blog;
import swp391.com.backend.feature.blog.data.BlogCategory;
import swp391.com.backend.feature.blog.dto.BlogDTO;
import swp391.com.backend.feature.blog.dto.SimpleBlogDTO;
import swp391.com.backend.feature.blog.mapper.BlogMapper;
import swp391.com.backend.feature.blog.service.BlogService;

import java.util.List;

@RestController
@RequestMapping("/api/blogs")
@RequiredArgsConstructor
public class PublicBlogController {
    
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

    @GetMapping("/search")
    public ResponseEntity<List<SimpleBlogDTO>> searchBlogs(@RequestParam String keyword) {
        List<SimpleBlogDTO> blogs = blogService.searchBlogs(keyword)
                .stream()
                .map(blogMapper::toSimpleDTO)
                .toList();
        return ResponseEntity.ok(blogs);
    }

    @GetMapping("/categories")
    public ResponseEntity<BlogCategory[]> getAllCategories() {
        return ResponseEntity.ok(BlogCategory.values());
    }
}

