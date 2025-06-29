package swp391.com.backend.feature.blog.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import swp391.com.backend.feature.blog.data.BlogCategory;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BlogCreateRequest {
    
    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    String title;
    
    @NotBlank(message = "Content is required")
    String content;
    
    @NotNull(message = "Category is required")
    BlogCategory category;
    
    @NotNull(message = "Admin ID is required")
    Long adminId;
    
    LocalDateTime publishDate; // Optional, will use current time if not provided
}
