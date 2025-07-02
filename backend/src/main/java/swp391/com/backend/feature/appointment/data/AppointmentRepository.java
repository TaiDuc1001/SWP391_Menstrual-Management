package swp391.com.backend.feature.appointment.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import swp391.com.backend.feature.doctor.data.Doctor;
import swp391.com.backend.feature.schedule.data.Slot;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findAppointmentByDoctorAndDate(Doctor doctor, LocalDate date);

    List<Appointment> findAppointmentsByDoctorId(Long id);

    Appointment findAppointmentByDoctorIdAndSlotAndDate(Long doctorId, Slot slot, LocalDate date);

    List<Appointment> findAppointmentsByCustomerId(Long id);

    List<Appointment> findAppointmentByDoctorIdAndDate(Long doctorId, LocalDate date);
}
