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
import swp391.com.backend.jpa.pojo.appointments.AppointmentStatus;
import swp391.com.backend.jpa.pojo.roles.Customer;
import swp391.com.backend.jpa.pojo.roles.Doctor;
import swp391.com.backend.service.appointments.AppointmentsService;
import swp391.com.backend.service.roles.CustomerService;
import swp391.com.backend.service.roles.DoctorService;

import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api/appointments")
public class AppointmentsController {
    private final AppointmentsService appointmentsService;
    private final AppointmentMapper appointmentMapper;
    private final DoctorService doctorService;
    private final CustomerService customerService;

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
        Doctor doctor = doctorService.findDoctorById(request.getDoctorId());
        Customer customer = customerService.findCustomerById(request.getCustomerId());
        Appointment appointment = Appointment.builder()
                .date(request.getDate())
                .slot(request.getSlot())
                .doctor(doctor)
                .customer(customer)
                .appointmentStatus(AppointmentStatus.PENDING)
                .customerNote(request.getCustomerNote())
                .build();
        Appointment result = appointmentsService.createAppointment(appointment);
        return ResponseEntity.ok(appointmentMapper.toDTO(result));
    }
}
