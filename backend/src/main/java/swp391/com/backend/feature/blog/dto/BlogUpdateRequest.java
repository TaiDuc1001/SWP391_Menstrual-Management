package swp391.com.backend.feature.blog.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import swp391.com.backend.feature.blog.data.BlogCategory;

import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BlogUpdateRequest {
    
    @Size(max = 255, message = "Title must not exceed 255 characters")
    String title;
    
    String content;
    
    BlogCategory category;
    
    LocalDateTime publishDate;
}
