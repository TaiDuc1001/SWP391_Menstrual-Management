package swp391.com.backend.jpa.pojo.blog;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import swp391.com.backend.jpa.pojo.roles.Account;
import swp391.com.backend.jpa.pojo.roles.Admin;

import java.time.LocalDateTime;
import java.util.List;

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
