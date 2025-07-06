package swp391.com.backend.feature.appointment.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp391.com.backend.feature.appointment.data.Appointment;
import swp391.com.backend.feature.appointment.data.AppointmentStatus;
import swp391.com.backend.feature.appointment.dto.AppointmentCreateRequest;
import swp391.com.backend.feature.appointment.dto.AppointmentDTO;
import swp391.com.backend.feature.appointment.dto.PaymentInfoDTO;
import swp391.com.backend.feature.appointment.mapper.AppointmentMapper;
import swp391.com.backend.feature.appointment.service.AppointmentsService;
import swp391.com.backend.feature.customer.service.CustomerService;
import swp391.com.backend.feature.doctor.service.DoctorService;

import java.util.List;
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
        List<Appointment> results = appointmentsService.getAllAppointments();
        return ResponseEntity.ok(appointmentsService.toCollectionModel(results));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntityModel<AppointmentDTO>> getAppointmentById(@PathVariable Long id) {
        Appointment appointment = appointmentsService.findAppointmentById(id);
        return ResponseEntity.ok(appointmentsService.toModel(appointment));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<CollectionModel<EntityModel<AppointmentDTO>>> getAppointmentsByDoctorId(@PathVariable Long doctorId) {
        List<Appointment> results = appointmentsService.getAppointmentsByDoctorId(doctorId);
        return ResponseEntity.ok(appointmentsService.toCollectionModel(results));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<CollectionModel<EntityModel<AppointmentDTO>>> getAppointmentsByCustomerId(@PathVariable Long customerId) {
        List<Appointment> results = appointmentsService.getAppointmentsByCustomerId(customerId);
        return ResponseEntity.ok(appointmentsService.toCollectionModel(results));
    }

    @PostMapping
    public ResponseEntity<EntityModel<AppointmentDTO>> createAppointment(@RequestBody AppointmentCreateRequest request) {
        Appointment result = appointmentsService.createAppointment(request);
        return ResponseEntity.ok(appointmentsService.toModel(result));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EntityModel<AppointmentDTO>> updateAppointment(@PathVariable Long id, @RequestBody AppointmentDTO appointmentDTO) {
        Appointment updatedAppointment = appointmentsService.updateAppointment(id, appointmentDTO);
        return ResponseEntity.ok(appointmentsService.toModel(updatedAppointment));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<EntityModel<AppointmentDTO>> updateAppointmentStatus(@PathVariable Long id, @RequestBody AppointmentDTO appointmentDTO) {
        Appointment updatedAppointment = appointmentsService.updateAppointmentStatus(id, appointmentDTO);
        return ResponseEntity.ok(appointmentsService.toModel(updatedAppointment));
    }

    @DeleteMapping("/{id}/status")
    public ResponseEntity<EntityModel<AppointmentDTO>> cancelAppointment(@PathVariable Long id) {
        Appointment cancelledAppointment = appointmentsService.cancelAppointment(id);
        return ResponseEntity.ok(appointmentsService.toModel(cancelledAppointment));
    }


    @PatchMapping("/{id}/ready/customer")
    public ResponseEntity<EntityModel<AppointmentDTO>> customerConfirm(@PathVariable Long id) {
        Appointment updatedAppointment = appointmentsService.flagCustomerAsReady(id);
        return ResponseEntity.ok(appointmentsService.toModel(updatedAppointment));
    }

    @PatchMapping("/{id}/ready/doctor")
    public ResponseEntity<EntityModel<AppointmentDTO>> doctorConfirm(@PathVariable Long id) {
        Appointment updatedAppointment = appointmentsService.flagDoctorAsReady(id);
        return ResponseEntity.ok(appointmentsService.toModel(updatedAppointment));
    }

    @GetMapping("/payment/callback/{id}")
    public ResponseEntity<AppointmentDTO> handlePaymentCallback(@PathVariable Long id, @RequestParam Map<String, String> queryParams) {
        Appointment appointment = appointmentsService.findAppointmentById(id);
        if (appointment.getAppointmentStatus() != AppointmentStatus.BOOKED) {
            return ResponseEntity.badRequest().build();
        }

        if(queryParams.containsKey("vnp_ResponseCode") && !queryParams.get("vnp_ResponseCode").equals("00")) {
            appointment.setAppointmentStatus(AppointmentStatus.CANCELLED);
        } else {
            appointment.setAppointmentStatus(AppointmentStatus.CONFIRMED);
        }
        AppointmentDTO appointmentDTO = appointmentMapper.toDTO(appointment);

        Appointment updatedAppointment = appointmentsService.updateAppointment(id, appointmentDTO);

        String frontendUrl = "http://localhost:3000/customer/payment-return";
        if (queryParams.containsKey("vnp_ResponseCode")) {
            frontendUrl += "?status=" + queryParams.get("vnp_ResponseCode");
        }

        return ResponseEntity.status(302)
                .header("Location", frontendUrl)
                .build();
    }

    @GetMapping("/{id}/payment")
    public ResponseEntity<EntityModel<AppointmentDTO>> getPaymentInfo(@PathVariable Long id) {
        Appointment appointment = appointmentsService.findAppointmentById(id);
        if (appointment.getAppointmentStatus() != AppointmentStatus.BOOKED) {
            return ResponseEntity.badRequest().build();
        }
        PaymentInfoDTO paymentInfo = PaymentInfoDTO.builder()
                .appointmentId(id)
                .customerName(appointment.getCustomer().getName())
                .doctorName(appointment.getDoctor().getName())
                .date(appointment.getDate())
                .timeRange(appointment.getSlot().getTimeRange())
                .amount(appointment.getDoctor().getPrice().doubleValue())
                .qrCodeUrl("https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=APPOINTMENT_PAYMENT_" + id + "_AMOUNT_" + appointment.getDoctor().getPrice())
                .build();

        AppointmentDTO appointmentDTO = appointmentMapper.toDTO(appointment);
        EntityModel<AppointmentDTO> entityModel = EntityModel.of(appointmentDTO);

        return ResponseEntity.ok(entityModel);
    }
}
