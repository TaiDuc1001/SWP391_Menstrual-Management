package swp391.com.backend.pojo.roles;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import swp391.com.backend.pojo.appointments.Appointment;
import swp391.com.backend.pojo.appointments.MedicalRecord;
import swp391.com.backend.pojo.order.Order;
import swp391.com.backend.pojo.appointments.RatingFeedback;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "account_id", unique = true)
    private Account account;

    private String firstName;
    private String middleName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String gender;
    private String email;

    @Column(unique = true)
    private String phoneNumber;

    @Column(unique = true)
    private String cccd;

    private String address;

    @OneToMany(mappedBy = "customer")
    private List<Appointment> appointments;

    @OneToMany(mappedBy = "customer")
    private List<Order> orders;

    @OneToMany(mappedBy = "customer")
    private List<MedicalRecord> medicalRecords;

    @OneToMany(mappedBy = "customer")
    private List<RatingFeedback> feedbacks;
}

