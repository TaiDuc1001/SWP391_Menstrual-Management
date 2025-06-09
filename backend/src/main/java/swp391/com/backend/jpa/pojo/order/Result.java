package swp391.com.backend.jpa.pojo.order;

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
    private Integer id;

    @OneToOne
    @JoinColumn(name = "order_id", unique = true)
    private Order order;

    @OneToMany(mappedBy = "result")
    private List<ResultDetail> resultDetails;
}

