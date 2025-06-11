package swp391.com.backend.jpa.pojo.blog;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "tags")
@Data
@NoArgsConstructor
public class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "tag_name", unique = true)
    private String tagName;

    @Lob
    private String description;

    @Column(name = "is_active", columnDefinition = "TINYINT(1)")
    private Boolean isActive;

    @OneToMany(mappedBy = "tag")
    private List<BlogTag> blogTags;
}

