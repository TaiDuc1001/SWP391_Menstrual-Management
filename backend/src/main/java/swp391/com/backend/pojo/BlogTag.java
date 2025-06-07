package swp391.com.backend.pojo;

import jakarta.persistence.Entity;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;

import java.io.Serializable;

@Entity
@Getter
@Setter
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
public class BlogTagId implements Serializable {
    private Integer blogId;
    private Integer tagId;
}

