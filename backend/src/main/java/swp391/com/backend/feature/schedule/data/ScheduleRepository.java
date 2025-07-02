package swp391.com.backend.feature.schedule.data;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findSchedulesByDoctorIdAndDate(Long doctorId, LocalDate date);
}
