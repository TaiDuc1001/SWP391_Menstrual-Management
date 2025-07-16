package swp391.com.backend.feature.blog.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import swp391.com.backend.feature.blog.data.BlogCategory;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BlogFilterRequest {
    
    BlogCategory category;
    Long adminId;
    String keyword;
    String sortBy = "publishDate"; // Default sort by publish date
    String sortDirection = "desc"; // Default descending order
    Integer page = 0; // Default page 0
    Integer size = 20; // Default 20 items per page
}

