package swp391.com.backend.feature.appointment.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp391.com.backend.feature.appointment.dto.AppointmentDTO;
import swp391.com.backend.feature.appointment.dto.SimpleAppointmentDTO;
import swp391.com.backend.feature.appointment.dto.AppointmentCreateRequest;
import swp391.com.backend.feature.appointment.dto.PaymentInfoDTO;
import swp391.com.backend.feature.appointment.mapper.AppointmentMapper;
import swp391.com.backend.feature.appointment.data.Appointment;
import swp391.com.backend.feature.appointment.data.AppointmentStatus;
import swp391.com.backend.feature.customer.data.Customer;
import swp391.com.backend.feature.doctor.data.Doctor;
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
    public ResponseEntity<List<SimpleAppointmentDTO>> getAllAppointments() {
        List<SimpleAppointmentDTO> results = appointmentsService.getAllAppointments()
                .stream()
                .map(appointmentMapper::toSimpleDTO)
                .toList();
        return ResponseEntity.ok(results);
    }

    @GetMapping("/doctor")
    public ResponseEntity<List<SimpleAppointmentDTO>> getAppointmentsForDoctor() {
        List<SimpleAppointmentDTO> results = appointmentsService.getAppointmentsForDoctor()
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
                .appointmentStatus(AppointmentStatus.BOOKED)
                .customerNote(request.getCustomerNote())
                .build();
        Appointment result = appointmentsService.createAppointment(appointment);
        return ResponseEntity.ok(appointmentMapper.toDTO(result));
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
        
        // Redirect to frontend payment return page with status
        String frontendUrl = "http://localhost:3000/customer/payment-return";
        if (queryParams.containsKey("vnp_ResponseCode")) {
            frontendUrl += "?status=" + queryParams.get("vnp_ResponseCode");
        }
        
        return ResponseEntity.status(302)
            .header("Location", frontendUrl)
            .build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<AppointmentDTO> updateAppointment(@PathVariable Long id, @RequestBody AppointmentDTO appointmentDTO) {
        Appointment appointment = appointmentMapper.toEntity(appointmentDTO);
        Appointment updatedAppointment = appointmentsService.updateAppointment(id, appointment);
        return ResponseEntity.ok(appointmentMapper.toDTO(updatedAppointment));
    }

    @PutMapping("/confirm/{id}")
    public ResponseEntity<AppointmentDTO> confirmAppointment(@PathVariable Long id) {
        Appointment appointment = appointmentsService.findAppointmentById(id);
        if (appointment.getAppointmentStatus() != AppointmentStatus.CONFIRMED) {
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

    @GetMapping("/payment/{id}")
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

    @PutMapping("/payment/confirm/{id}")
    public ResponseEntity<AppointmentDTO> confirmPayment(@PathVariable Long id) {
        Appointment appointment = appointmentsService.findAppointmentById(id);
        if (appointment.getAppointmentStatus() != AppointmentStatus.BOOKED) {
            return ResponseEntity.badRequest().build();
        }
        appointment.setAppointmentStatus(AppointmentStatus.CONFIRMED);

        Appointment updatedAppointment = appointmentsService.updateAppointment(id, appointment);
        return ResponseEntity.ok(appointmentMapper.toDTO(updatedAppointment));
    }

    @PutMapping("/customer/confirm/{id}")
    public ResponseEntity<AppointmentDTO> customerConfirm(@PathVariable Long id) {
        Appointment appointment = appointmentsService.findAppointmentById(id);
        if (appointment.getAppointmentStatus() != AppointmentStatus.CONFIRMED && 
            appointment.getAppointmentStatus() != AppointmentStatus.WAITING_FOR_CUSTOMER) {
            return ResponseEntity.badRequest().build();
        }
        
        appointment.setCustomerConfirmed(true);
          boolean doctorConfirmed = appointment.getDoctorConfirmed() != null && appointment.getDoctorConfirmed();
        if (doctorConfirmed) {
            appointment.setAppointmentStatus(AppointmentStatus.IN_PROGRESS);
        } else {
            appointment.setAppointmentStatus(AppointmentStatus.WAITING_FOR_DOCTOR);
        }

        Appointment updatedAppointment = appointmentsService.updateAppointment(id, appointment);
        return ResponseEntity.ok(appointmentMapper.toDTO(updatedAppointment));
    }

    @PutMapping("/doctor/confirm/{id}")
    public ResponseEntity<AppointmentDTO> doctorConfirm(@PathVariable Long id) {
        Appointment appointment = appointmentsService.findAppointmentById(id);
        if (appointment.getAppointmentStatus() != AppointmentStatus.CONFIRMED && 
            appointment.getAppointmentStatus() != AppointmentStatus.WAITING_FOR_DOCTOR) {
            return ResponseEntity.badRequest().build();
        }
        
        appointment.setDoctorConfirmed(true);
        
        boolean customerConfirmed = appointment.getCustomerConfirmed() != null && appointment.getCustomerConfirmed();
          if (customerConfirmed) {
            appointment.setAppointmentStatus(AppointmentStatus.IN_PROGRESS);
        } else {
            appointment.setAppointmentStatus(AppointmentStatus.WAITING_FOR_CUSTOMER);
        }

        Appointment updatedAppointment = appointmentsService.updateAppointment(id, appointment);
        return ResponseEntity.ok(appointmentMapper.toDTO(updatedAppointment));
    }

    @PutMapping("/readyToStart/{id}")
    public ResponseEntity<AppointmentDTO> markReadyToStart(@PathVariable Long id) {
        Appointment appointment = appointmentsService.findAppointmentById(id);
        if (appointment.getAppointmentStatus() != AppointmentStatus.CONFIRMED) {
            return ResponseEntity.badRequest().build();
        }        appointment.setCustomerConfirmed(true);
        appointment.setDoctorConfirmed(true);
        appointment.setAppointmentStatus(AppointmentStatus.IN_PROGRESS);

        Appointment updatedAppointment = appointmentsService.updateAppointment(id, appointment);
        return ResponseEntity.ok(appointmentMapper.toDTO(updatedAppointment));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentDTO> getAppointmentById(@PathVariable Long id) {
        Appointment appointment = appointmentsService.findAppointmentById(id);
        return ResponseEntity.ok(appointmentMapper.toDTO(appointment));
    }

}
