package swp391.com.backend.feature.staff.data;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import swp391.com.backend.feature.account.data.Account;
import swp391.com.backend.feature.account.data.Actor;
import swp391.com.backend.feature.examination.data.Examination;
import swp391.com.backend.feature.account.data.Role;

import java.util.List;

@Entity
@Table(name = "staffs")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Staff implements Actor {
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
