package swp391.com.backend.feature.admin.data;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import swp391.com.backend.feature.account.data.Account;
import swp391.com.backend.feature.account.data.Actor;
import swp391.com.backend.feature.blog.data.Blog;
import swp391.com.backend.feature.account.data.Role;

import java.util.List;

@Entity
@Table(name = "admins")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Admin implements Actor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(cascade = CascadeType.ALL)
    @MapsId
    @JoinColumn(name = "id")
    private Account account;

    @OneToMany(mappedBy = "admin")
    private List<Blog> blogs;

    private String name;
}
