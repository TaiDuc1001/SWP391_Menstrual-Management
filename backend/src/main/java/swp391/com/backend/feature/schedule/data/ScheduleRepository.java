package swp391.com.backend.feature.schedule.data;

import org.springframework.data.jpa.repository.JpaRepository;
import swp391.com.backend.feature.doctor.data.Doctor;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByDoctorAndDate(Doctor doctor, LocalDate date);
}
