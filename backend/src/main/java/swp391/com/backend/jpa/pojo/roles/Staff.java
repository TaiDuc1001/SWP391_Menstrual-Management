package swp391.com.backend.jpa.pojo.roles;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import swp391.com.backend.jpa.pojo.examination.Examination;

import java.util.List;

@Entity
@Table(name = "staffs")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Staff implements Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(cascade = CascadeType.ALL)
    @MapsId
    @JoinColumn(name = "id")
    private Account account;

    private String name;

    @OneToMany(mappedBy = "staff")
    private List<Examination> examinations;
}
