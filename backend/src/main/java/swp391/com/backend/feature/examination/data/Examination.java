package swp391.com.backend.feature.examination.data;

import jakarta.persistence.*;
import lombok.*;
import swp391.com.backend.feature.customer.data.Customer;
import swp391.com.backend.feature.result.data.Result;
import swp391.com.backend.feature.staff.data.Staff;
import swp391.com.backend.feature.schedule.data.Slot;
import swp391.com.backend.feature.panel.data.Panel;

import java.time.LocalDate;

@Entity
@Table(name = "examinations")
@Data
@Builder(toBuilder = true)
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