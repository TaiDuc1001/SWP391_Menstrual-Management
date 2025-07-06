package swp391.com.backend.feature.appointment.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import swp391.com.backend.feature.appointment.dto.RescheduleStatus;
import swp391.com.backend.feature.doctor.data.Doctor;

import java.util.List;
import java.util.Optional;

@Repository
public interface RescheduleRequestRepository extends JpaRepository<RescheduleRequest, Long> {
    
    List<RescheduleRequest> findByDoctorAndStatus(Doctor doctor, RescheduleStatus status);
    
    List<RescheduleRequest> findByAppointmentId(Long appointmentId);
    
    @Query("SELECT r FROM RescheduleRequest r WHERE r.appointment.id = :appointmentId AND r.status = :status")
    Optional<RescheduleRequest> findByAppointmentIdAndStatus(@Param("appointmentId") Long appointmentId, @Param("status") RescheduleStatus status);
    
    @Query("SELECT r FROM RescheduleRequest r WHERE r.doctor.id = :doctorId")
    List<RescheduleRequest> findByDoctorId(@Param("doctorId") Long doctorId);
    
    @Query("SELECT r FROM RescheduleRequest r WHERE r.customer.id = :customerId")
    List<RescheduleRequest> findByCustomerId(@Param("customerId") Long customerId);
}
