package swp391.com.backend.feature.cycleSymptomByDate.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CycleSymptomByDateRepository extends JpaRepository<CycleSymptomByDate, Long> {
}
