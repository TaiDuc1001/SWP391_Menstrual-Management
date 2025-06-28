package swp391.com.backend.feature.doctor.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp391.com.backend.feature.doctor.data.Doctor;
import swp391.com.backend.feature.doctor.dto.DoctorDTO;
import swp391.com.backend.feature.doctor.dto.SimpleDoctorDTO;
import swp391.com.backend.feature.doctor.mapper.DoctorMapper;
import swp391.com.backend.feature.doctor.service.DoctorService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {
    private final DoctorService doctorService;
    private final DoctorMapper doctorMapper;

    @GetMapping
    public ResponseEntity<List<SimpleDoctorDTO>> getAllDoctors() {
        List<SimpleDoctorDTO> doctors = doctorService.getAllDoctors()
                .stream()
                .map(doctorMapper::toSimpleDTO)
                .toList();
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DoctorDTO> getDoctorById(@PathVariable Long id) {
        Doctor doctor = doctorService.findDoctorById(id);
        DoctorDTO doctorDTO = doctorMapper.toDTO(doctor);
        return ResponseEntity.ok(doctorDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DoctorDTO> updateDoctor(@PathVariable Long id, @RequestBody DoctorDTO doctorDTO) {
        Doctor doctorDetails = doctorMapper.toEntity(doctorDTO);
        Doctor updatedDoctor = doctorService.updateDoctor(id, doctorDetails);
        DoctorDTO updatedDoctorDTO = doctorMapper.toDTO(updatedDoctor);
        return ResponseEntity.ok(updatedDoctorDTO);
    }

    // Profile management endpoints
    @GetMapping("/profile")
    public ResponseEntity<DoctorDTO> getDoctorProfile(@RequestParam Long accountId) {
        try {
            // Since Doctor.id = Account.id due to @MapsId, we can use accountId directly
            Doctor doctor = doctorService.findDoctorById(accountId);
            DoctorDTO doctorDTO = doctorMapper.toDTO(doctor);
            
            // If doctor exists but has empty profile fields, set default values
            if (doctorDTO.getName() == null || doctorDTO.getName().trim().isEmpty()) {
                doctorDTO.setName("");
            }
            if (doctorDTO.getSpecialization() == null || doctorDTO.getSpecialization().trim().isEmpty()) {
                doctorDTO.setSpecialization("");
            }
            if (doctorDTO.getPrice() == null) {
                doctorDTO.setPrice(java.math.BigDecimal.ZERO);
            }
            
            return ResponseEntity.ok(doctorDTO);
        } catch (Exception e) {
            // Return empty profile if doctor not found - should not happen for registered doctors
            DoctorDTO emptyProfile = new DoctorDTO();
            emptyProfile.setId(accountId);
            emptyProfile.setName("");
            emptyProfile.setSpecialization("");
            emptyProfile.setPrice(java.math.BigDecimal.ZERO);
            return ResponseEntity.ok(emptyProfile);
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<DoctorDTO> updateDoctorProfile(@RequestBody DoctorDTO doctorDTO, @RequestParam Long accountId) {
        try {
            // Since Doctor.id = Account.id due to @MapsId, we can use accountId directly
            Doctor doctorDetails = doctorMapper.toEntity(doctorDTO);
            Doctor updatedDoctor = doctorService.updateDoctor(accountId, doctorDetails);
            DoctorDTO updatedDoctorDTO = doctorMapper.toDTO(updatedDoctor);
            return ResponseEntity.ok(updatedDoctorDTO);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update doctor profile: " + e.getMessage());
        }
    }

    @GetMapping("/profile/check-complete")
    public ResponseEntity<Map<String, Object>> checkProfileComplete(@RequestParam Long accountId) {
        try {
            // Since Doctor.id = Account.id due to @MapsId, we can use accountId directly
            Doctor doctor = doctorService.findDoctorById(accountId);
            boolean isComplete = doctor.getName() != null && !doctor.getName().trim().isEmpty() &&
                    doctor.getSpecialization() != null && !doctor.getSpecialization().trim().isEmpty() &&
                    doctor.getPrice() != null && doctor.getPrice().compareTo(java.math.BigDecimal.ZERO) > 0;

            Map<String, Object> response = new HashMap<>();
            response.put("isComplete", isComplete);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("isComplete", false);
            return ResponseEntity.ok(response);
        }
    }

    @GetMapping("/specializations")
    public ResponseEntity<List<String>> getSpecializations() {
        List<String> specializations = List.of(
                "Gynecology",
                "Urology",
                "Infectious Diseases",
                "Sexual Health",
                "Reproductive Health",
                "Women's Health",
                "Obstetrics",
                "Endocrinology",
                "General Medicine",
                "Dermatology"
        );
        return ResponseEntity.ok(specializations);
    }
}
