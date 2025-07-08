package swp391.com.backend.feature.blog.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import swp391.com.backend.feature.blog.data.Blog;
import swp391.com.backend.feature.blog.dto.BlogDTO;
import swp391.com.backend.feature.blog.dto.SimpleBlogDTO;
import swp391.com.backend.feature.blog.dto.BlogCreateRequest;
import swp391.com.backend.feature.blog.dto.BlogUpdateRequest;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface BlogMapper {
    
    @Mapping(source = "admin.id", target = "adminId")
    @Mapping(source = "admin.name", target = "authorName")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(expression = "java(entity.getContent())", target = "content")
    BlogDTO toDTO(Blog entity);
    
    @Mapping(source = "admin.name", target = "authorName")
    @Mapping(target = "excerpt", expression = "java(extractExcerpt(entity.getContent()))")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    SimpleBlogDTO toSimpleDTO(Blog entity);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "admin", ignore = true)
    @Mapping(target = "slug", ignore = true)
    Blog toEntity(BlogCreateRequest request);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "admin", ignore = true)
    @Mapping(target = "slug", ignore = true)
    void updateBlogFromRequest(BlogUpdateRequest request, @MappingTarget Blog blog);
    
    default String extractExcerpt(String content) {
        if (content == null) return null;
        if (content.length() <= 150) return content;
        return content.substring(0, 150) + "...";
    }
}
