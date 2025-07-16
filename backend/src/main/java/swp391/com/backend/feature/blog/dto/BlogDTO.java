package swp391.com.backend.feature.blog.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import swp391.com.backend.feature.blog.data.BlogCategory;

import java.time.LocalDateTime;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BlogDTO {
    Long id;
    String slug;
    String title;
    String content;
    BlogCategory category;
    Long adminId;
    String authorName;
    LocalDateTime publishDate;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}

