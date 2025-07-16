package swp391.com.backend.feature.blog.data;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {
    
    Optional<Blog> findBySlug(String slug);
    
    List<Blog> findByCategory(BlogCategory category);
    
    Page<Blog> findByCategory(BlogCategory category, Pageable pageable);
    
    List<Blog> findByAdminId(Long adminId);
    
    Page<Blog> findByAdminId(Long adminId, Pageable pageable);
    
    @Query("SELECT b FROM Blog b WHERE b.title LIKE %:keyword% OR b.content LIKE %:keyword%")
    List<Blog> findByKeyword(@Param("keyword") String keyword);
    
    @Query("SELECT b FROM Blog b WHERE b.title LIKE %:keyword% OR b.content LIKE %:keyword%")
    Page<Blog> findByKeyword(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT b FROM Blog b ORDER BY b.publishDate DESC")
    List<Blog> findAllOrderByPublishDateDesc();
    
    @Query("SELECT b FROM Blog b WHERE b.category = :category ORDER BY b.publishDate DESC")
    List<Blog> findByCategoryOrderByPublishDateDesc(@Param("category") BlogCategory category);
    
    @Query("SELECT b FROM Blog b WHERE " +
           "(:category IS NULL OR b.category = :category) AND " +
           "(:adminId IS NULL OR b.admin.id = :adminId) AND " +
           "(:keyword IS NULL OR b.title LIKE %:keyword% OR b.content LIKE %:keyword%)")
    Page<Blog> findBlogsWithFilters(@Param("category") BlogCategory category,
                                   @Param("adminId") Long adminId,
                                   @Param("keyword") String keyword,
                                   Pageable pageable);
    
    boolean existsBySlug(String slug);
    
    @Modifying
    @Transactional
    @Query("UPDATE Blog b SET b.admin = null WHERE b.admin.id = :adminId")
    void updateAdminToNullByAdminId(@Param("adminId") Long adminId);
}

