package swp391.com.backend.feature.appointment.service;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import swp391.com.backend.feature.appointment.assembler.AppointmentAssembler;
import swp391.com.backend.feature.appointment.data.Appointment;
import swp391.com.backend.feature.appointment.data.AppointmentRepository;
import swp391.com.backend.feature.appointment.data.AppointmentStatus;
import swp391.com.backend.feature.appointment.dto.AppointmentCreateRequest;
import swp391.com.backend.feature.appointment.dto.AppointmentDTO;
import swp391.com.backend.feature.appointment.dto.PaymentInfoDTO;
import swp391.com.backend.feature.appointment.mapper.AppointmentMapper;
import swp391.com.backend.feature.customer.data.Customer;
import swp391.com.backend.feature.customer.service.CustomerService;
import swp391.com.backend.feature.doctor.data.Doctor;
import swp391.com.backend.feature.doctor.service.DoctorService;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AppointmentsService {
    private final AppointmentRepository appointmentRepository;
    private final DoctorService doctorService;
    private final CustomerService customerService;
    private final AppointmentMapper appointmentMapper;
    private final AppointmentAssembler appointmentAssembler;

    public CollectionModel<EntityModel<AppointmentDTO>> getAllAppointments() {
        return toCollectionModel(appointmentRepository.findAll());
    }

    public CollectionModel<EntityModel<AppointmentDTO>> getAppointmentsByDoctorId(Long id) {
        List<Appointment> result = appointmentRepository.findAppointmentsByDoctorId(id).stream()
                .filter(appointment -> !(appointment.getAppointmentStatus() == (AppointmentStatus.BOOKED)))
                .toList();
        return toCollectionModel(result);
    }

    public CollectionModel<EntityModel<AppointmentDTO>> getAppointmentsByCustomerId(Long id) {
        return toCollectionModel(appointmentRepository.findAppointmentsByCustomerId(id));
    }

    @Transactional
    public EntityModel<AppointmentDTO> createAppointment(AppointmentCreateRequest request) {
        Doctor doctor = doctorService.findDoctorById(request.getDoctorId());
        Customer customer = customerService.findCustomerById(request.getCustomerId());
        Appointment appointment = Appointment.builder()
                .date(request.getDate())
                .slot(request.getSlot())
                .doctor(doctor)
                .customer(customer)
                .appointmentStatus(AppointmentStatus.CONFIRMED)
                .customerNote(request.getCustomerNote())
                .customerReady(false)
                .doctorReady(false)
                .build();
        validateNewAppointment(appointment);
        return toModel(appointmentRepository.save(appointment));
    }

    @Transactional
    public EntityModel<AppointmentDTO> updateAppointmentStatus(Long id, AppointmentDTO dto) {
        Appointment existingAppointment = findAppointmentById(id);
        existingAppointment.setAppointmentStatus(dto.getAppointmentStatus());
        return toModel(appointmentRepository.save(existingAppointment));
    }

    public EntityModel<AppointmentDTO> updateAppointment(Long id, AppointmentDTO appointmentDTO) {
        Appointment existingAppointment = findAppointmentById(id);
        Customer customer = customerService.findCustomerById(appointmentDTO.getCustomerId());
        Doctor doctor = doctorService.findDoctorById(appointmentDTO.getDoctorId());
        existingAppointment = existingAppointment.toBuilder()
                .customer(customer)
                .doctor(doctor)
                .customerNote(appointmentDTO.getCustomerNote())
                .appointmentStatus(appointmentDTO.getAppointmentStatus())
                .date(appointmentDTO.getDate())
                .slot(appointmentDTO.getSlot())
                .build();
        return toModel(appointmentRepository.save(existingAppointment));
    }

    public EntityModel<AppointmentDTO> cancelAppointment(Long id) {
        Appointment existingAppointment = findAppointmentById(id);
        existingAppointment.setAppointmentStatus(AppointmentStatus.CANCELLED);
        return toModel(appointmentRepository.save(existingAppointment));
    }

    private Appointment findAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Appointment not found with id: " + id));
    }

    public EntityModel<AppointmentDTO> getAppointmentById(Long id) {
        Appointment appointment = findAppointmentById(id);
        return toModel(appointment);
    }

    private void validateNewAppointment(Appointment appointment) {
        Appointment result = appointmentRepository.findAppointmentByDoctorIdAndSlotAndDate(
                appointment.getDoctor().getId(), appointment.getSlot(),appointment.getDate());

        if (result != null) {
            throw new EntityExistsException(
                String.format("An appointment already exists for doctor %s on %s at %s", 
                    appointment.getDoctor().getName(),
                    appointment.getDate(),
                    appointment.getSlot().getTimeRange())
            );
        }
    }

    public EntityModel<AppointmentDTO> toModel(Appointment appointment) {
        AppointmentDTO dto = appointmentMapper.toDTO(appointment);
        return appointmentAssembler.toModel(dto);
    }

    public CollectionModel<EntityModel<AppointmentDTO>> toCollectionModel(List<Appointment> appointments) {
        List<AppointmentDTO> appointmentModels = appointmentMapper.toDTOs(appointments);
        return appointmentAssembler.toCollectionModel(appointmentModels);
    }

    public EntityModel<AppointmentDTO> flagDoctorAsReady(Long id) {
        Appointment appointment = findAppointmentById(id);

        if (appointment.getAppointmentStatus() != AppointmentStatus.CONFIRMED) {
            throw new IllegalStateException("Appointment is not in CONFIRMED status");
        }

        if(appointment.getDoctorReady()){
            throw new IllegalArgumentException("Doctor is already marked as ready");
        }

        appointment.setDoctorReady(true);
        boolean customerConfirmed = appointment.getCustomerReady();
        if (customerConfirmed) {
            appointment.setAppointmentStatus(AppointmentStatus.IN_PROGRESS);
        }
        return toModel(appointmentRepository.save(appointment));
    }

    public EntityModel<AppointmentDTO> flagCustomerAsReady(Long id) {
        Appointment appointment = findAppointmentById(id);
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
        return toModel(appointmentRepository.save(appointment));
    }

    public ResponseEntity<AppointmentDTO> handlePaymentCallback(Long id, Map<String, String> queryParams) {
        Appointment appointment = findAppointmentById(id);
        if (appointment.getAppointmentStatus() != AppointmentStatus.BOOKED) {
            throw new IllegalStateException("Appointment is not in BOOKED status");
        }

        if(queryParams.containsKey("vnp_ResponseCode") && !queryParams.get("vnp_ResponseCode").equals("00")) {
            appointment.setAppointmentStatus(AppointmentStatus.CANCELLED);
        } else {
            appointment.setAppointmentStatus(AppointmentStatus.CONFIRMED);
        }
        AppointmentDTO appointmentDTO = appointmentMapper.toDTO(appointment);

        String frontendUrl = "http://localhost:3000/customer/payment-return";
        if (queryParams.containsKey("vnp_ResponseCode")) {
            frontendUrl += "?status=" + queryParams.get("vnp_ResponseCode");
        }

        return ResponseEntity.status(302)
                .header("Location", frontendUrl)
                .build();
    }

    public ResponseEntity<EntityModel<AppointmentDTO>> getPaymentInfo(Long id){
        Appointment appointment = findAppointmentById(id);
        if (appointment.getAppointmentStatus() != AppointmentStatus.BOOKED) {
            throw new IllegalStateException("Appointment is not in BOOKED status");
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


        return ResponseEntity.ok(toModel(appointment));
    }
}
