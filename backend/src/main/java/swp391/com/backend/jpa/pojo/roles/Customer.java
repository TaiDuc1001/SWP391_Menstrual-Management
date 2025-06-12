package swp391.com.backend.jpa.pojo.roles;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import swp391.com.backend.jpa.pojo.appointments.Appointment;
import swp391.com.backend.jpa.pojo.examination.Examination;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "customers")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Customer implements Role{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(cascade = CascadeType.ALL)
    @MapsId
    @JoinColumn(name = "id")
    private Account account;

    private String name;

    private LocalDate dateOfBirth;

    @Column(columnDefinition = "TINYINT(1)")
    private Boolean gender;

    @Column(unique = true)
    private String phoneNumber;

    @Column(unique = true)
    private String cccd;

    private String address;

    @OneToMany(mappedBy = "customer")
    private List<Appointment> appointments;

    @OneToMany(mappedBy = "customer")
    private List<Examination> examinations;
}
