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
import java.util.Map;

@RestController
@RequestMapping("/api/reschedule")
@RequiredArgsConstructor
public class RescheduleController {
    
    private final RescheduleService rescheduleService;
    private final RescheduleMapper rescheduleMapper;

    /**
     * Customer tạo reschedule request
     */
    @PostMapping("/request")
    public ResponseEntity<RescheduleRequestDTO> createRescheduleRequest(@RequestBody CreateRescheduleRequestDTO createRequest) {
        try {
            RescheduleRequest rescheduleRequest = rescheduleService.createRescheduleRequest(createRequest);
            RescheduleRequestDTO responseDTO = rescheduleMapper.toDTO(rescheduleRequest);
            return ResponseEntity.ok(responseDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Doctor xem danh sách reschedule requests pending
     */
    @GetMapping("/doctor/{doctorId}/pending")
    public ResponseEntity<List<RescheduleRequestDTO>> getPendingRescheduleRequestsForDoctor(@PathVariable Long doctorId) {
        List<RescheduleRequest> requests = rescheduleService.getPendingRescheduleRequestsForDoctor(doctorId);
        List<RescheduleRequestDTO> responseDTOs = rescheduleMapper.toDTOList(requests);
        return ResponseEntity.ok(responseDTOs);
    }

    /**
     * Doctor xem tất cả reschedule requests
     */
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<RescheduleRequestDTO>> getRescheduleRequestsForDoctor(@PathVariable Long doctorId) {
        List<RescheduleRequest> requests = rescheduleService.getRescheduleRequestsForDoctor(doctorId);
        List<RescheduleRequestDTO> responseDTOs = rescheduleMapper.toDTOList(requests);
        return ResponseEntity.ok(responseDTOs);
    }

    /**
     * Customer xem reschedule requests của mình
     */
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<RescheduleRequestDTO>> getRescheduleRequestsForCustomer(@PathVariable Long customerId) {
        List<RescheduleRequest> requests = rescheduleService.getRescheduleRequestsForCustomer(customerId);
        List<RescheduleRequestDTO> responseDTOs = rescheduleMapper.toDTOList(requests);
        return ResponseEntity.ok(responseDTOs);
    }

    /**
     * Xem chi tiết một reschedule request
     */
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

    /**
     * Doctor approve một option
     */
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

    /**
     * Doctor reject reschedule request
     */
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

    /**
     * Customer cancel reschedule request
     */
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

    /**
     * Xem reschedule requests cho một appointment cụ thể
     */
    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<List<RescheduleRequestDTO>> getRescheduleRequestsByAppointmentId(@PathVariable Long appointmentId) {
        List<RescheduleRequest> requests = rescheduleService.getRescheduleRequestsByAppointmentId(appointmentId);
        List<RescheduleRequestDTO> responseDTOs = rescheduleMapper.toDTOList(requests);
        return ResponseEntity.ok(responseDTOs);
    }
}
