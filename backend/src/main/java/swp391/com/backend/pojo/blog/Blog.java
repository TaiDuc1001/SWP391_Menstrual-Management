package swp391.com.backend.pojo.blog;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import swp391.com.backend.pojo.roles.Account;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
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
