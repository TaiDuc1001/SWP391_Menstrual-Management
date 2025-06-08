package swp391.com.backend.repository.order;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import swp391.com.backend.pojo.order.Result;

@Repository
public interface ResultRepository extends JpaRepository<Result, Integer> {
}
