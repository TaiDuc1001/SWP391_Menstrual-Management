package swp391.com.backend.feature.blog.data;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import swp391.com.backend.feature.admin.data.Admin;

import java.time.LocalDateTime;

@Entity
@Table(name = "blogs")
@Data
@NoArgsConstructor
public class Blog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "admin_id")
    private Admin admin;

    @Column(unique = true)
    private String slug;

    private String title;

    @Lob
    private String content;

    private LocalDateTime publishDate;

    private BlogCategory category;
}
