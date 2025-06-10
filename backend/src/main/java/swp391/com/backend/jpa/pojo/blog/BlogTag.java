package swp391.com.backend.jpa.pojo.blog;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entity
@Table(name = "blog_tags")
@Data
@NoArgsConstructor
@IdClass(BlogTagId.class)
public class BlogTag {
    @Id
    private Integer blogId;

    @Id
    private Integer tagId;

    @ManyToOne
    @JoinColumn(name = "blog_id", insertable = false, updatable = false)
    private Blog blog;

    @ManyToOne
    @JoinColumn(name = "tag_id", insertable = false, updatable = false)
    private Tag tag;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class BlogTagId implements Serializable {
    private Integer blogId;
    private Integer tagId;
}

