package swp391.com.backend.jpa.repository.order;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import swp391.com.backend.jpa.pojo.order.ResultDetail;

@Repository
public interface ResultDetailRepository extends JpaRepository<ResultDetail, Integer> {
}
