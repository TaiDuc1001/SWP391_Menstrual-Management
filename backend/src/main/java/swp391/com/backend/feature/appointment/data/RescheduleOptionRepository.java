package swp391.com.backend.feature.appointment.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RescheduleOptionRepository extends JpaRepository<RescheduleOption, Long> {
    
    List<RescheduleOption> findByRescheduleRequestId(Long rescheduleRequestId);
    
    List<RescheduleOption> findByRescheduleRequestIdAndIsSelected(Long rescheduleRequestId, Boolean isSelected);
}
