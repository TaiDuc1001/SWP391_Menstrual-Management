package swp391.com.backend.feature.blog.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import swp391.com.backend.feature.admin.data.Admin;
import swp391.com.backend.feature.admin.service.AdminService;
import swp391.com.backend.feature.blog.data.Blog;
import swp391.com.backend.feature.blog.data.BlogCategory;
import swp391.com.backend.feature.blog.data.BlogRepository;
import swp391.com.backend.feature.blog.dto.BlogCreateRequest;
import swp391.com.backend.feature.blog.dto.BlogFilterRequest;
import swp391.com.backend.feature.blog.dto.BlogUpdateRequest;
import swp391.com.backend.feature.blog.mapper.BlogMapper;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BlogService {
    
    private final BlogRepository blogRepository;
    private final AdminService adminService;
    private final BlogMapper blogMapper;

    public List<Blog> getAllBlogs() {
        return blogRepository.findAllOrderByPublishDateDesc();
    }

    public Page<Blog> getBlogsWithFilters(BlogFilterRequest request) {
        Sort sort = Sort.by(
            "desc".equalsIgnoreCase(request.getSortDirection()) 
                ? Sort.Direction.DESC 
                : Sort.Direction.ASC,
            request.getSortBy()
        );
        
        Pageable pageable = PageRequest.of(request.getPage(), request.getSize(), sort);
        
        return blogRepository.findBlogsWithFilters(
            request.getCategory(),
            request.getAdminId(),
            request.getKeyword(),
            pageable
        );
    }

    public Blog findBlogById(Long id) {
        return blogRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Blog not found with id: " + id));
    }

    public Blog findBlogBySlug(String slug) {
        return blogRepository.findBySlug(slug)
                .orElseThrow(() -> new EntityNotFoundException("Blog not found with slug: " + slug));
    }

    public List<Blog> findBlogsByCategory(BlogCategory category) {
        return blogRepository.findByCategoryOrderByPublishDateDesc(category);
    }

    public Page<Blog> findBlogsByCategory(BlogCategory category, Pageable pageable) {
        return blogRepository.findByCategory(category, pageable);
    }

    public List<Blog> findBlogsByAdmin(Long adminId) {
        return blogRepository.findByAdminId(adminId);
    }

    public Page<Blog> findBlogsByAdmin(Long adminId, Pageable pageable) {
        return blogRepository.findByAdminId(adminId, pageable);
    }

    public List<Blog> searchBlogs(String keyword) {
        return blogRepository.findByKeyword(keyword);
    }

    public Page<Blog> searchBlogs(String keyword, Pageable pageable) {
        return blogRepository.findByKeyword(keyword, pageable);
    }

    public Blog createBlog(BlogCreateRequest request) {

        Admin admin = adminService.findAdminById(request.getAdminId());

        Blog blog = blogMapper.toEntity(request);
        blog.setAdmin(admin);

        blog.setSlug(generateSlug(request.getTitle()));

        if (blog.getPublishDate() == null) {
            blog.setPublishDate(LocalDateTime.now());
        }
        
        return blogRepository.save(blog);
    }

    public Blog updateBlog(Long id, BlogUpdateRequest request) {
        Blog existingBlog = findBlogById(id);

        String originalTitle = existingBlog.getTitle();

        blogMapper.updateBlogFromRequest(request, existingBlog);

        if (request.getTitle() != null && !request.getTitle().equals(originalTitle)) {
            existingBlog.setSlug(generateSlug(request.getTitle()));
        }
        
        return blogRepository.save(existingBlog);
    }

    public void deleteBlog(Long id) {
        Blog blog = findBlogById(id);
        blogRepository.delete(blog);
    }

    public void deleteMultipleBlogs(List<Long> ids) {
        List<Blog> blogs = blogRepository.findAllById(ids);
        blogRepository.deleteAll(blogs);
    }

    public boolean existsBySlug(String slug) {
        return blogRepository.existsBySlug(slug);
    }

    private String generateSlug(String title) {
        if (title == null || title.trim().isEmpty()) {
            return "blog-" + System.currentTimeMillis();
        }
        
        String slug = title.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "") // Remove special characters
                .replaceAll("\\s+", "-") // Replace spaces with hyphens
                .replaceAll("-+", "-") // Replace multiple hyphens with single
                .replaceAll("^-|-$", ""); // Remove leading/trailing hyphens

        String uniqueSlug = slug;
        int counter = 1;
        while (existsBySlug(uniqueSlug)) {
            uniqueSlug = slug + "-" + counter;
            counter++;
        }
        
        return uniqueSlug;
    }
}

