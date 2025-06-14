package swp391.com.backend.jpa.repository.appointments;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import swp391.com.backend.jpa.pojo.appointments.Appointment;

@Repository
public interface AppointmentsRepository extends JpaRepository<Appointment, Long> {
}
