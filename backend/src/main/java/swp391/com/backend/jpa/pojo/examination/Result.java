package swp391.com.backend.jpa.pojo.examination;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "results")
@Data
@NoArgsConstructor
public class Result {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code;

    @OneToOne
    @JoinColumn(name = "order_id", unique = true)
    private Examination examination;

    @OneToMany(mappedBy = "result")
    private List<ResultDetail> resultDetails;
}
