package swp391.com.backend.feature.appointment.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp391.com.backend.feature.appointment.data.RescheduleRequest;
import swp391.com.backend.feature.appointment.dto.CreateRescheduleRequestDTO;
import swp391.com.backend.feature.appointment.dto.RescheduleRequestDTO;
import swp391.com.backend.feature.appointment.mapper.RescheduleMapper;
import swp391.com.backend.feature.appointment.service.RescheduleService;

import java.util.List;
import swp391.com.backend.common.util.AuthenticationUtil;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reschedule")
@RequiredArgsConstructor
public class RescheduleController {
    
    private final RescheduleService rescheduleService;
    private final RescheduleMapper rescheduleMapper;
    private final AuthenticationUtil authenticationUtil;

    
    @PostMapping("/request")
    public ResponseEntity<?> createRescheduleRequest(@RequestBody CreateRescheduleRequestDTO createRequest) {
        try {
            RescheduleRequest rescheduleRequest = rescheduleService.createRescheduleRequest(createRequest);
            RescheduleRequestDTO responseDTO = rescheduleMapper.toDTO(rescheduleRequest);
            return ResponseEntity.ok(responseDTO);
        } catch (RuntimeException e) {

            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        }
    }

    
    @GetMapping("/doctor/pending")
    public ResponseEntity<List<RescheduleRequestDTO>> getPendingRescheduleRequestsForDoctor() {

        Long currentDoctorId = authenticationUtil.getCurrentDoctorId();
        System.out.println("RescheduleController.getPendingRescheduleRequestsForDoctor: Getting pending requests for doctor ID: " + currentDoctorId);
        
        List<RescheduleRequest> requests = rescheduleService.getPendingRescheduleRequestsForDoctor(currentDoctorId);
        List<RescheduleRequestDTO> responseDTOs = rescheduleMapper.toDTOList(requests);
        return ResponseEntity.ok(responseDTOs);
    }

    
    @GetMapping("/doctor")
    public ResponseEntity<List<RescheduleRequestDTO>> getRescheduleRequestsForDoctor() {

        Long currentDoctorId = authenticationUtil.getCurrentDoctorId();
        System.out.println("RescheduleController.getRescheduleRequestsForDoctor: Getting all requests for doctor ID: " + currentDoctorId);
        
        List<RescheduleRequest> requests = rescheduleService.getRescheduleRequestsForDoctor(currentDoctorId);
        List<RescheduleRequestDTO> responseDTOs = rescheduleMapper.toDTOList(requests);
        return ResponseEntity.ok(responseDTOs);
    }

    
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<RescheduleRequestDTO>> getRescheduleRequestsForCustomer(@PathVariable Long customerId) {
        List<RescheduleRequest> requests = rescheduleService.getRescheduleRequestsForCustomer(customerId);
        List<RescheduleRequestDTO> responseDTOs = rescheduleMapper.toDTOList(requests);
        return ResponseEntity.ok(responseDTOs);
    }

    
    @GetMapping("/{id}")
    public ResponseEntity<RescheduleRequestDTO> getRescheduleRequestById(@PathVariable Long id) {
        try {
            RescheduleRequest rescheduleRequest = rescheduleService.getRescheduleRequestById(id);
            RescheduleRequestDTO responseDTO = rescheduleMapper.toDTO(rescheduleRequest);
            return ResponseEntity.ok(responseDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    
    @PutMapping("/{rescheduleRequestId}/approve/{optionId}")
    public ResponseEntity<RescheduleRequestDTO> approveRescheduleOption(
            @PathVariable Long rescheduleRequestId, 
            @PathVariable Long optionId) {
        try {
            RescheduleRequest rescheduleRequest = rescheduleService.approveRescheduleOption(rescheduleRequestId, optionId);
            RescheduleRequestDTO responseDTO = rescheduleMapper.toDTO(rescheduleRequest);
            return ResponseEntity.ok(responseDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    
    @PutMapping("/{rescheduleRequestId}/reject")
    public ResponseEntity<RescheduleRequestDTO> rejectRescheduleRequest(@PathVariable Long rescheduleRequestId) {
        try {
            RescheduleRequest rescheduleRequest = rescheduleService.rejectRescheduleRequest(rescheduleRequestId);
            RescheduleRequestDTO responseDTO = rescheduleMapper.toDTO(rescheduleRequest);
            return ResponseEntity.ok(responseDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    
    @PutMapping("/{rescheduleRequestId}/cancel")
    public ResponseEntity<RescheduleRequestDTO> cancelRescheduleRequest(@PathVariable Long rescheduleRequestId) {
        try {
            RescheduleRequest rescheduleRequest = rescheduleService.cancelRescheduleRequest(rescheduleRequestId);
            RescheduleRequestDTO responseDTO = rescheduleMapper.toDTO(rescheduleRequest);
            return ResponseEntity.ok(responseDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    
    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<List<RescheduleRequestDTO>> getRescheduleRequestsByAppointmentId(@PathVariable Long appointmentId) {
        List<RescheduleRequest> requests = rescheduleService.getRescheduleRequestsByAppointmentId(appointmentId);
        List<RescheduleRequestDTO> responseDTOs = rescheduleMapper.toDTOList(requests);
        return ResponseEntity.ok(responseDTOs);
    }
}

