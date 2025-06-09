package swp391.com.backend.domain.controller.appointments;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import swp391.com.backend.domain.dto.AppointmentDTO;
import swp391.com.backend.jpa.pojo.appointments.Appointment;
import swp391.com.backend.service.appointments.AppointmentsService;

import java.util.List;
@Controller
public class AppointmentsController {
    private final AppointmentsService appointmentsService;

    public AppointmentsController(AppointmentsService appointmentsService) {
        this.appointmentsService = appointmentsService;
    }

    @GetMapping("/api/appointments")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        // Logic to get all appointments
        return ResponseEntity.ok(appointmentsService.getAllAppointments());
    }

    @PostMapping("/api/appointments")
    public ResponseEntity<Appointment> createAppointment(@RequestBody AppointmentDTO appointmentDTO) {
        Appointment Appointment = new Appointment();
        Appointment.setAppointmentDate(appointmentDTO.getAppointmentDate());
        Appointment.setCustomer(appointmentDTO.getCustomer());
        Appointment.setSlot(appointmentDTO.getSlot());
        Appointment.setNotes(appointmentDTO.getNote());
        Appointment.setDescription(appointmentDTO.getDescription());
        return ResponseEntity.ok(appointmentsService.createAppointment(Appointment));
    }
}
