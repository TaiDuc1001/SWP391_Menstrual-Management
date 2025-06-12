package swp391.com.backend.jpa.repository.cycle;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import swp391.com.backend.jpa.pojo.cycle.Cycle;

@Repository
public interface CycleRepository extends JpaRepository<Cycle, Long> {
}
