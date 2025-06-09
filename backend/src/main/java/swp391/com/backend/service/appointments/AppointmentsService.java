package swp391.com.backend.service.appointments;

import org.springframework.stereotype.Service;
import swp391.com.backend.jpa.pojo.appointments.Appointment;
import swp391.com.backend.jpa.repository.appointments.AppointmentsRepository;

import java.util.List;

@Service
public class AppointmentsService {
    private final AppointmentsRepository appointmentsRepository;

    public AppointmentsService(AppointmentsRepository appointmentsRepository) {
        this.appointmentsRepository = appointmentsRepository;
    }

    public List<Appointment> getAllAppointments() {
        return appointmentsRepository.findAll();
    }

    public void deleteAppointment(Integer id) {
        Appointment appointment = appointmentsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointmentsRepository.delete(appointment);
    }

    public Appointment createAppointment(Appointment appointment) {
        return appointmentsRepository.save(appointment);
    }
}
