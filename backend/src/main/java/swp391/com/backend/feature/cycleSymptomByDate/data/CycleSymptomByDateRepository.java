package swp391.com.backend.feature.cycleSymptomByDate.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CycleSymptomByDateRepository extends JpaRepository<CycleSymptomByDate, Long> {
    
    List<CycleSymptomByDate> findByCycleId(Long cycleId);
    
    List<CycleSymptomByDate> findByDate(LocalDateTime date);
    
    Optional<CycleSymptomByDate> findByCycleIdAndDateAndSymptom(Long cycleId, LocalDateTime date, Symptom symptom);
    
    @Query("SELECT c FROM CycleSymptomByDate c WHERE DATE(c.date) = DATE(:date)")
    List<CycleSymptomByDate> findByDateOnly(@Param("date") LocalDateTime date);
}
