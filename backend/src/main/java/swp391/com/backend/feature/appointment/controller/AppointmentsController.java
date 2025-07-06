package swp391.com.backend.feature.appointment.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp391.com.backend.feature.appointment.dto.AppointmentCreateRequest;
import swp391.com.backend.feature.appointment.dto.AppointmentDTO;
import swp391.com.backend.feature.appointment.mapper.AppointmentMapper;
import swp391.com.backend.feature.appointment.service.AppointmentsService;
import swp391.com.backend.feature.customer.service.CustomerService;
import swp391.com.backend.feature.doctor.service.DoctorService;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/appointments")
public class AppointmentsController {
    private final AppointmentsService appointmentsService;
    private final AppointmentMapper appointmentMapper;
    private final DoctorService doctorService;
    private final CustomerService customerService;

    @GetMapping
    public ResponseEntity<CollectionModel<EntityModel<AppointmentDTO>>> getAllAppointments() {
        return ResponseEntity.ok(appointmentsService.getAllAppointments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntityModel<AppointmentDTO>> getAppointmentById(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentsService.getAppointmentById(id));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<CollectionModel<EntityModel<AppointmentDTO>>> getAppointmentsByDoctorId(@PathVariable Long doctorId) {
        return ResponseEntity.ok(appointmentsService.getAppointmentsByDoctorId(doctorId));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<CollectionModel<EntityModel<AppointmentDTO>>> getAppointmentsByCustomerId(@PathVariable Long customerId) {
        return ResponseEntity.ok(appointmentsService.getAppointmentsByCustomerId(customerId));
    }

    @PostMapping
    public ResponseEntity<EntityModel<AppointmentDTO>> createAppointment(@RequestBody AppointmentCreateRequest request) {
        return ResponseEntity.ok(appointmentsService.createAppointment(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EntityModel<AppointmentDTO>> updateAppointment(@PathVariable Long id, @RequestBody AppointmentDTO appointmentDTO) {
        return ResponseEntity.ok(appointmentsService.updateAppointment(id, appointmentDTO));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<EntityModel<AppointmentDTO>> updateAppointmentStatus(@PathVariable Long id, @RequestBody AppointmentDTO appointmentDTO) {
        return ResponseEntity.ok(appointmentsService.updateAppointmentStatus(id, appointmentDTO));
    }

    @DeleteMapping("/{id}/status")
    public ResponseEntity<EntityModel<AppointmentDTO>> cancelAppointment(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentsService.cancelAppointment(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<EntityModel<AppointmentDTO>> deleteAppointment(@PathVariable Long id) {
        return cancelAppointment(id);
    }


    @PatchMapping("/{id}/ready/customer")
    public ResponseEntity<EntityModel<AppointmentDTO>> customerConfirm(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentsService.flagCustomerAsReady(id));
    }

    @PatchMapping("/{id}/ready/doctor")
    public ResponseEntity<EntityModel<AppointmentDTO>> doctorConfirm(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentsService.flagDoctorAsReady(id));
    }

    @GetMapping("/payment/callback/{id}")
    public ResponseEntity<AppointmentDTO> handlePaymentCallback(@PathVariable Long id, @RequestParam Map<String, String> queryParams) {
        return appointmentsService.handlePaymentCallback(id, queryParams);
    }

    @GetMapping("/{id}/payment")
    public ResponseEntity<EntityModel<AppointmentDTO>> getPaymentInfo(@PathVariable Long id) {
       return appointmentsService.getPaymentInfo(id);
    }
}
