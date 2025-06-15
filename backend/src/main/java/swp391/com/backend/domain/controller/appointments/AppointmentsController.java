package swp391.com.backend.domain.controller.appointments;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
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

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/appointments")
public class AppointmentsController {
    private final AppointmentsService appointmentsService;
    private final AppointmentMapper appointmentMapper;
    private final DoctorService doctorService;
    private final CustomerService customerService;

    @GetMapping
    public ResponseEntity<List<SimpleAppointmentDTO>> getAllAppointments() {
        List<SimpleAppointmentDTO> results = appointmentsService.getAllAppointments()
                .stream()
                .map(appointmentMapper::toSimpleDTO)
                .toList();
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
                .appointmentStatus(AppointmentStatus.IN_PROGRESS)
                .customerNote(request.getCustomerNote())
                .build();
        Appointment result = appointmentsService.createAppointment(appointment);
        return ResponseEntity.ok(appointmentMapper.toDTO(result));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AppointmentDTO> updateAppointment(@PathVariable Long id,@RequestBody AppointmentDTO appointmentDTO) {
        Appointment appointment = appointmentMapper.toEntity(appointmentDTO);
        Appointment updatedAppointment = appointmentsService.updateAppointment(id ,appointment);
        return ResponseEntity.ok(appointmentMapper.toDTO(updatedAppointment));
    }

    @PutMapping("/confirm/{id}")
    public ResponseEntity<AppointmentDTO> startAppointment(@PathVariable Long id) {
        Appointment appointment = appointmentsService.findAppointmentById(id);
        if (appointment.getAppointmentStatus() != AppointmentStatus.BOOKED) {
            return ResponseEntity.badRequest().build();
        }
        appointment.setAppointmentStatus(AppointmentStatus.IN_PROGRESS);

        Appointment updatedAppointment = appointmentsService.updateAppointment(id, appointment);
        return ResponseEntity.ok(appointmentMapper.toDTO(updatedAppointment));
    }

    @PutMapping("/finish/{id}")
    public ResponseEntity<AppointmentDTO> finishAppointment(@PathVariable Long id) {
        Appointment appointment = appointmentsService.findAppointmentById(id);
        if (appointment.getAppointmentStatus() != AppointmentStatus.IN_PROGRESS) {
            return ResponseEntity.badRequest().build();
        }
        appointment.setAppointmentStatus(AppointmentStatus.FINISHED);

        Appointment updatedAppointment = appointmentsService.updateAppointment(id, appointment);
        return ResponseEntity.ok(appointmentMapper.toDTO(updatedAppointment));
    }

    @PutMapping("/cancel/{id}")
    public ResponseEntity<AppointmentDTO> cancelAppointment(@PathVariable Long id) {
        Appointment appointment = appointmentsService.findAppointmentById(id);
        if (appointment.getAppointmentStatus() == AppointmentStatus.CANCELLED ||
            appointment.getAppointmentStatus() == AppointmentStatus.FINISHED) {
            return ResponseEntity.badRequest().build();
        }
        appointment.setAppointmentStatus(AppointmentStatus.CANCELLED);

        Appointment updatedAppointment = appointmentsService.updateAppointment(id, appointment);
        return ResponseEntity.ok(appointmentMapper.toDTO(updatedAppointment));
    }


}
