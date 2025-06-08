package swp391.com.backend.pojo.roles;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import swp391.com.backend.pojo.blog.Blog;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true)
    private String accountName;

    private String password;

    private String accountStatus;

    private String email;

    @OneToOne(mappedBy = "account")
    private Customer customer;

    @OneToOne(mappedBy = "account")
    private Doctor doctor;

    @OneToOne(mappedBy = "account")
    private Admin admin;

    @OneToOne(mappedBy = "account")
    private Staff staff;

    @OneToMany(mappedBy = "account")
    private List<Blog> blogs;
}

