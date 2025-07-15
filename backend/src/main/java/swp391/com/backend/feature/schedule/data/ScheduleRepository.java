package swp391.com.backend.feature.schedule.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import swp391.com.backend.feature.doctor.data.Doctor;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByDoctorAndDate(Doctor doctor, LocalDate date);
    
    List<Schedule> findByDoctor(Doctor doctor);
    
    List<Schedule> findByDoctorId(Long doctorId);
    
    List<Schedule> findByDoctorIdAndDate(Long doctorId, LocalDate date);
    
    boolean existsByDoctorAndDateAndSlot(Doctor doctor, LocalDate date, Slot slot);
    
    @Modifying
    @Transactional
    void deleteByDoctorIdAndDate(Long doctorId, LocalDate date);
    
    @Modifying
    @Transactional
    @Query("UPDATE Schedule s SET s.doctor = null WHERE s.doctor.id = :doctorId")
    void updateDoctorToNullByDoctorId(@Param("doctorId") Long doctorId);
}
