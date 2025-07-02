package swp391.com.backend.feature.appointment.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp391.com.backend.feature.appointment.assembler.AppointmentAssembler;
import swp391.com.backend.feature.appointment.data.Appointment;
import swp391.com.backend.feature.appointment.data.AppointmentStatus;
import swp391.com.backend.feature.appointment.dto.AppointmentCreateRequest;
import swp391.com.backend.feature.appointment.dto.AppointmentDTO;
import swp391.com.backend.feature.appointment.dto.PaymentInfoDTO;
import swp391.com.backend.feature.appointment.mapper.AppointmentMapper;
import swp391.com.backend.feature.appointment.service.AppointmentsService;
import swp391.com.backend.feature.customer.data.Customer;
import swp391.com.backend.feature.customer.service.CustomerService;
import swp391.com.backend.feature.doctor.data.Doctor;
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
    private final AppointmentAssembler appointmentAssembler;

    @GetMapping
    public ResponseEntity<CollectionModel<EntityModel<AppointmentDTO>>> getAllAppointments() {
        List<Appointment> results = appointmentsService.getAllAppointments();
        List<AppointmentDTO> dtos = appointmentMapper.toDTOs(results);
        CollectionModel<EntityModel<AppointmentDTO>> collectionModel = appointmentAssembler.toCollectionModel(dtos);
        return ResponseEntity.ok(collectionModel);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentDTO> getAppointmentById(@PathVariable Long id) {
        Appointment appointment = appointmentsService.findAppointmentById(id);
        return ResponseEntity.ok(appointmentMapper.toDTO(appointment));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<CollectionModel<EntityModel<AppointmentDTO>>> getAppointmentsByDoctorId(@PathVariable Long doctorId) {
        List<Appointment> results = appointmentsService.getAppointmentsByDoctorId(doctorId);
        List<AppointmentDTO> dtos = appointmentMapper.toDTOs(results);
        CollectionModel<EntityModel<AppointmentDTO>> collectionModel = appointmentAssembler.toCollectionModel(dtos);
        return ResponseEntity.ok(collectionModel);
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<CollectionModel<EntityModel<AppointmentDTO>>> getAppointmentsByCustomerId(@PathVariable Long customerId) {
        List<Appointment> results = appointmentsService.getAppointmentsByCustomerId(customerId);
        List<AppointmentDTO> dtos = appointmentMapper.toDTOs(results);
        CollectionModel<EntityModel<AppointmentDTO>> collectionModel = appointmentAssembler.toCollectionModel(dtos);
        return ResponseEntity.ok(collectionModel);
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

        Appointment updatedAppointment = appointmentsService.updateAppointment(id, appointment);

        String frontendUrl = "http://localhost:3000/customer/payment-return";
        if (queryParams.containsKey("vnp_ResponseCode")) {
            frontendUrl += "?status=" + queryParams.get("vnp_ResponseCode");
        }

        return ResponseEntity.status(302)
                .header("Location", frontendUrl)
                .build();
    }

    @GetMapping("/{id}/payment")
    public ResponseEntity<PaymentInfoDTO> getPaymentInfo(@PathVariable Long id) {
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

        return ResponseEntity.ok(paymentInfo);
    }

    @PutMapping("/payment/scan/{id}")
    public ResponseEntity<AppointmentDTO> scanPayment(@PathVariable Long id) {
        Appointment appointment = appointmentsService.findAppointmentById(id);
        if (appointment.getAppointmentStatus() != AppointmentStatus.BOOKED) {
            return ResponseEntity.badRequest().build();
        }

        appointment.setAppointmentStatus(AppointmentStatus.CONFIRMED);

        Appointment updatedAppointment = appointmentsService.updateAppointment(id, appointment);
        return ResponseEntity.ok(appointmentMapper.toDTO(updatedAppointment));
    }

    @PutMapping("/{id}/payment/confirm")
    public ResponseEntity<AppointmentDTO> confirmPayment(@PathVariable Long id) {
        Appointment appointment = appointmentsService.findAppointmentById(id);
        if (appointment.getAppointmentStatus() != AppointmentStatus.BOOKED) {
            return ResponseEntity.badRequest().build();
        }
        appointment.setAppointmentStatus(AppointmentStatus.CONFIRMED);

        Appointment updatedAppointment = appointmentsService.updateAppointment(id, appointment);
        return ResponseEntity.ok(appointmentMapper.toDTO(updatedAppointment));
    }


    @PostMapping
    public ResponseEntity<EntityModel<AppointmentDTO>> createAppointment(@RequestBody AppointmentCreateRequest request) {
        Doctor doctor = doctorService.findDoctorById(request.getDoctorId());
        Customer customer = customerService.findCustomerById(request.getCustomerId());
        Appointment appointment = Appointment.builder()
                .date(request.getDate())
                .slot(request.getSlot())
                .doctor(doctor)
                .customer(customer)
                .appointmentStatus(AppointmentStatus.CONFIRMED)
                .customerNote(request.getCustomerNote())
                .build();
        Appointment result = appointmentsService.createAppointment(appointment);
        AppointmentDTO dto = appointmentMapper.toDTO(result);
        EntityModel<AppointmentDTO> entityModel = appointmentAssembler.toModel(dto);
        return ResponseEntity.ok(entityModel);
    }


    @PutMapping("/{id}")
    public ResponseEntity<EntityModel<AppointmentDTO>> updateAppointment(@PathVariable Long id, @RequestBody AppointmentDTO appointmentDTO) {
        Appointment appointment = appointmentMapper.toEntity(appointmentDTO);

        Appointment updatedAppointment = appointmentsService.updateAppointment(id, appointment);
        AppointmentDTO dto = appointmentMapper.toDTO(updatedAppointment);
        EntityModel<AppointmentDTO> entityModel = appointmentAssembler.toModel(dto);

        return ResponseEntity.ok(entityModel);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<EntityModel<AppointmentDTO>> updateAppointmentStatus(@PathVariable Long id, @RequestBody AppointmentDTO appointmentDTO) {
        Appointment appointment = appointmentsService.findAppointmentById(id);
        appointment.setAppointmentStatus(appointmentDTO.getAppointmentStatus());

        Appointment updatedAppointment = appointmentsService.updateAppointment(id, appointment);
        AppointmentDTO dto = appointmentMapper.toDTO(updatedAppointment);
        EntityModel<AppointmentDTO> entityModel = appointmentAssembler.toModel(dto);

        return ResponseEntity.ok(entityModel);
    }

    @DeleteMapping("/{id}/status")
    public ResponseEntity<EntityModel<AppointmentDTO>> cancelAppointment(@PathVariable Long id) {
        Appointment appointment = appointmentsService.findAppointmentById(id);
        if(appointment.getAppointmentStatus() != AppointmentStatus.BOOKED) {
            throw new IllegalStateException("Cannot cancel appointment that is not in BOOKED status");
        }
        appointment.setAppointmentStatus(AppointmentStatus.CANCELLED);

        Appointment updatedAppointment = appointmentsService.updateAppointment(id, appointment);
        AppointmentDTO dto = appointmentMapper.toDTO(updatedAppointment);
        EntityModel<AppointmentDTO> entityModel = appointmentAssembler.toModel(dto);

        return ResponseEntity.ok(entityModel);
    }


    @PatchMapping("/{id}/ready/customer")
    public ResponseEntity<AppointmentDTO> customerConfirm(@PathVariable Long id) {
        Appointment appointment = appointmentsService.findAppointmentById(id);
        if (appointment.getAppointmentStatus() != AppointmentStatus.CONFIRMED) {
            throw new IllegalStateException("Appointment is not in CONFIRMED status");
        }

        if(appointment.getCustomerReady()){
            throw new IllegalArgumentException("Customer is already marked as ready");
        }
        
        appointment.setCustomerReady(true);
          boolean doctorConfirmed = appointment.getDoctorReady() != null && appointment.getDoctorReady();
        if (doctorConfirmed) {
            appointment.setAppointmentStatus(AppointmentStatus.IN_PROGRESS);
        }

        Appointment updatedAppointment = appointmentsService.updateAppointment(id, appointment);
        return ResponseEntity.ok(appointmentMapper.toDTO(updatedAppointment));
    }

    @PatchMapping("/{id}/ready/doctor")
    public ResponseEntity<AppointmentDTO> doctorConfirm(@PathVariable Long id) {
        Appointment appointment = appointmentsService.findAppointmentById(id);

        if (appointment.getAppointmentStatus() != AppointmentStatus.CONFIRMED) {
            throw new IllegalStateException("Appointment is not in CONFIRMED status");
        }

        if(appointment.getDoctorReady()){
            throw new IllegalArgumentException("Doctor is already marked as ready");
        }

        appointment.setDoctorReady(true);
        boolean customerConfirmed = appointment.getCustomerReady() != null && appointment.getCustomerReady();
          if (customerConfirmed) {
            appointment.setAppointmentStatus(AppointmentStatus.IN_PROGRESS);
        }

        Appointment updatedAppointment = appointmentsService.updateAppointment(id, appointment);
        return ResponseEntity.ok(appointmentMapper.toDTO(updatedAppointment));
    }

    @PatchMapping("/{id}/readyToStart")
    public ResponseEntity<AppointmentDTO> markReadyToStart(@PathVariable Long id) {
        Appointment appointment = appointmentsService.findAppointmentById(id);
        if (appointment.getAppointmentStatus() != AppointmentStatus.CONFIRMED) {
            return ResponseEntity.badRequest().build();
        }        appointment.setCustomerReady(true);
        appointment.setDoctorReady(true);
        appointment.setAppointmentStatus(AppointmentStatus.IN_PROGRESS);

        Appointment updatedAppointment = appointmentsService.updateAppointment(id, appointment);
        return ResponseEntity.ok(appointmentMapper.toDTO(updatedAppointment));
    }
}
