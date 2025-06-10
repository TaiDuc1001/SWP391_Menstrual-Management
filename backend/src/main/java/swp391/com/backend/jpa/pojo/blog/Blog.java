package swp391.com.backend.jpa.pojo.blog;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import swp391.com.backend.jpa.pojo.roles.Account;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "blogs")
@Data
@NoArgsConstructor
public class Blog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(unique = true)
    private String slug;

    private String title;

    @Lob
    private String content;

    @Lob
    private String excerpt;

    private LocalDateTime publishDate;
    private String status;
    private Boolean isActive;

    @OneToMany(mappedBy = "blog")
    private List<BlogTag> blogTags;
}
