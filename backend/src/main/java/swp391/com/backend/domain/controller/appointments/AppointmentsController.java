package swp391.com.backend.domain.controller.appointments;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import swp391.com.backend.domain.dto.dto.AppointmentDTO;
import swp391.com.backend.domain.dto.simpledto.SimpleAppointmentDTO;
import swp391.com.backend.domain.dto.request.AppointmentCreateRequest;
import swp391.com.backend.domain.mapper.AppointmentMapper;
import swp391.com.backend.jpa.pojo.appointments.Appointment;
import swp391.com.backend.service.appointments.AppointmentsService;

import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api/appointments")
public class AppointmentsController {
    private final AppointmentsService appointmentsService;
    private final AppointmentMapper appointmentMapper;

    @GetMapping
    public ResponseEntity<List<SimpleAppointmentDTO>> getAllAppointments() {
        // Logic to get all appointments
//        List<Appointment> results_ = appointmentsService.getAllAppointments();
//        results_.forEach(appointments -> System.out.println(appointments.getAppointmentStatus()));
        List<SimpleAppointmentDTO> results = appointmentsService.getAllAppointments()
                .stream()
                .map(appointmentMapper::toSimpleDTO)
                .toList();
//        results.forEach(appointments -> System.out.println(appointments.getStatus()));
        return ResponseEntity.ok(results);
    }

    @PostMapping
    public ResponseEntity<AppointmentDTO> createAppointment(@RequestBody AppointmentCreateRequest request) {

        Appointment appointment = Appointment.builder()
                .date(java.time.LocalDate.parse(request.getDate()))
                .slot(swp391.com.backend.jpa.pojo.schedule.Slot.values()[request.getSlot()])
                .customerNote(request.getNote())
                .description(request.getDescription())
                .build();

        Appointment result = appointmentsService.createAppointment(appointment);
        return ResponseEntity.ok(appointmentMapper.toDTO(result));
    }
}
