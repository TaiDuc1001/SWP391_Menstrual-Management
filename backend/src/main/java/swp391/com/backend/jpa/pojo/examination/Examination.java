package swp391.com.backend.jpa.pojo.examination;

import jakarta.persistence.*;
import lombok.*;
import swp391.com.backend.jpa.pojo.roles.Customer;
import swp391.com.backend.jpa.pojo.roles.Staff;
import swp391.com.backend.jpa.pojo.schedule.Slot;
import swp391.com.backend.jpa.pojo.test.Panel;

import java.time.LocalDate;

@Entity
@Table(name = "examinations")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Examination {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private PaymentMethod paymentMethod;
    private Slot slot;
    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "staff_id")
    private Staff staff;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "panel_id")
    private Panel panel;

    @OneToOne(mappedBy = "examination")
    private Result result;

    private ExaminationStatus examinationStatus;
}