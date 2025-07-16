package swp391.com.backend.feature.appointment.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import swp391.com.backend.feature.appointment.data.*;
import swp391.com.backend.feature.appointment.dto.CreateRescheduleRequestDTO;
import swp391.com.backend.feature.appointment.dto.RescheduleStatus;
import swp391.com.backend.feature.customer.service.CustomerService;
import swp391.com.backend.feature.doctor.service.DoctorService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RescheduleService {
    
    private final RescheduleRequestRepository rescheduleRequestRepository;
    private final RescheduleOptionRepository rescheduleOptionRepository;
    private final AppointmentsService appointmentsService;
    private final CustomerService customerService;
    private final DoctorService doctorService;

    @Transactional
    public RescheduleRequest createRescheduleRequest(CreateRescheduleRequestDTO createRequest) {

        if (createRequest.getOptions() == null || createRequest.getOptions().isEmpty()) {
            throw new RuntimeException("At least one reschedule option is required");
        }
        
        if (createRequest.getOptions().size() > 1) {
            throw new RuntimeException("Only one reschedule option is allowed per request");
        }

        Appointment appointment = appointmentsService.findAppointmentById(createRequest.getAppointmentId());

        if (appointment.getAppointmentStatus() == AppointmentStatus.BOOKED) {
            throw new RuntimeException("Cannot reschedule appointment before payment is completed. Please complete payment first.");
        }

        if (appointment.getAppointmentStatus() != AppointmentStatus.CONFIRMED && 
            appointment.getAppointmentStatus() != AppointmentStatus.WAITING_FOR_CUSTOMER &&
            appointment.getAppointmentStatus() != AppointmentStatus.WAITING_FOR_DOCTOR) {
            throw new RuntimeException("Cannot reschedule appointment in current status: " + appointment.getAppointmentStatus());
        }

        var existingRequest = rescheduleRequestRepository.findByAppointmentIdAndStatus(
            createRequest.getAppointmentId(), RescheduleStatus.PENDING);
        
        if (existingRequest.isPresent()) {
            throw new RuntimeException("There is already a pending reschedule request for this appointment");
        }

        RescheduleRequest rescheduleRequest = RescheduleRequest.builder()
                .appointment(appointment)
                .customer(appointment.getCustomer())
                .doctor(appointment.getDoctor())
                .customerNote(createRequest.getCustomerNote())
                .status(RescheduleStatus.PENDING)
                .build();

        RescheduleRequest savedRequest = rescheduleRequestRepository.save(rescheduleRequest);

        List<RescheduleOption> options = createRequest.getOptions().stream()
                .map(optionRequest -> RescheduleOption.builder()
                        .rescheduleRequest(savedRequest)
                        .date(optionRequest.getDate())
                        .slot(optionRequest.getSlot())
                        .isSelected(false)
                        .build())
                .collect(Collectors.toList());

        rescheduleOptionRepository.saveAll(options);
        savedRequest.setOptions(options);

        return savedRequest;
    }

    public List<RescheduleRequest> getRescheduleRequestsForDoctor(Long doctorId) {
        return rescheduleRequestRepository.findByDoctorIdOrderByCreatedAtDesc(doctorId);
    }

    public List<RescheduleRequest> getPendingRescheduleRequestsForDoctor(Long doctorId) {
        var doctor = doctorService.findDoctorById(doctorId);
        return rescheduleRequestRepository.findByDoctorAndStatusOrderByCreatedAtDesc(doctor, RescheduleStatus.PENDING);
    }

    public RescheduleRequest getRescheduleRequestById(Long id) {
        return rescheduleRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reschedule request not found with id: " + id));
    }

    @Transactional
    public RescheduleRequest approveRescheduleOption(Long rescheduleRequestId, Long optionId) {
        RescheduleRequest rescheduleRequest = getRescheduleRequestById(rescheduleRequestId);
        
        if (rescheduleRequest.getStatus() != RescheduleStatus.PENDING) {
            throw new RuntimeException("Only pending reschedule requests can be approved");
        }

        rescheduleRequest.getOptions().forEach(option -> {
            option.setIsSelected(false);
            rescheduleOptionRepository.save(option);
        });

        RescheduleOption selectedOption = rescheduleOptionRepository.findById(optionId)
                .orElseThrow(() -> new RuntimeException("Reschedule option not found with id: " + optionId));
        
        selectedOption.setIsSelected(true);
        rescheduleOptionRepository.save(selectedOption);

        Appointment appointment = rescheduleRequest.getAppointment();
        appointment.setDate(selectedOption.getDate());
        appointment.setSlot(selectedOption.getSlot());
        appointment.setAppointmentStatus(AppointmentStatus.CONFIRMED); // Reset về confirmed sau khi reschedule
        appointment.setCustomerConfirmed(false);
        appointment.setDoctorConfirmed(false);
        appointmentsService.updateAppointment(appointment.getId(), appointment);

        rescheduleRequest.setStatus(RescheduleStatus.APPROVED);
        return rescheduleRequestRepository.save(rescheduleRequest);
    }

    @Transactional
    public RescheduleRequest rejectRescheduleRequest(Long rescheduleRequestId) {
        RescheduleRequest rescheduleRequest = getRescheduleRequestById(rescheduleRequestId);
        
        if (rescheduleRequest.getStatus() != RescheduleStatus.PENDING) {
            throw new RuntimeException("Only pending reschedule requests can be rejected");
        }

        rescheduleRequest.setStatus(RescheduleStatus.REJECTED);
        return rescheduleRequestRepository.save(rescheduleRequest);
    }

    @Transactional
    public RescheduleRequest cancelRescheduleRequest(Long rescheduleRequestId) {
        RescheduleRequest rescheduleRequest = getRescheduleRequestById(rescheduleRequestId);
        
        if (rescheduleRequest.getStatus() != RescheduleStatus.PENDING) {
            throw new RuntimeException("Only pending reschedule requests can be cancelled");
        }

        rescheduleRequest.setStatus(RescheduleStatus.CANCELLED);
        return rescheduleRequestRepository.save(rescheduleRequest);
    }

    public List<RescheduleRequest> getRescheduleRequestsByAppointmentId(Long appointmentId) {
        return rescheduleRequestRepository.findByAppointmentIdOrderByCreatedAtDesc(appointmentId);
    }

    public List<RescheduleRequest> getRescheduleRequestsForCustomer(Long customerId) {
        return rescheduleRequestRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }
}

