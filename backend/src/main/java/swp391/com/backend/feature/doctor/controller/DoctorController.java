package swp391.com.backend.feature.doctor.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp391.com.backend.feature.doctor.data.Doctor;
import swp391.com.backend.feature.doctor.dto.DoctorDTO;
import swp391.com.backend.feature.doctor.dto.DoctorProfileCompleteDTO;
import swp391.com.backend.feature.doctor.dto.DoctorProfileDTO;
import swp391.com.backend.feature.doctor.dto.SimpleDoctorDTO;
import swp391.com.backend.feature.doctor.mapper.DoctorMapper;
import swp391.com.backend.feature.doctor.service.DoctorService;
import swp391.com.backend.common.util.AuthenticationUtil;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {
    private final DoctorService doctorService;
    private final DoctorMapper doctorMapper;
    private final AuthenticationUtil authenticationUtil;    @GetMapping
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
    public ResponseEntity<DoctorDTO> updateDoctor(@PathVariable Long id,@RequestBody DoctorDTO doctorDTO) {
        Doctor doctorDetails = doctorMapper.toEntity(doctorDTO);
        Doctor updatedDoctor = doctorService.updateDoctor(id ,doctorDetails);
        DoctorDTO updatedDoctorDTO = doctorMapper.toDTO(updatedDoctor);
        return ResponseEntity.ok(updatedDoctorDTO);
    }

    @GetMapping("/specializations")
    public ResponseEntity<List<String>> getSpecializations() {
        List<Doctor> doctors = doctorService.getAllDoctors();
        List<String> specializations = doctors.stream()
            .map(Doctor::getSpecialization)
            .filter(s -> s != null && !s.trim().isEmpty())
            .distinct()
            .toList();
        return ResponseEntity.ok(specializations);
    }

    @GetMapping("/profile")
    public ResponseEntity<DoctorProfileDTO> getDoctorProfile() {
        // Get the current authenticated doctor ID from request header
        Long currentDoctorId = authenticationUtil.getCurrentDoctorId();
        System.out.println("DoctorController.getDoctorProfile: Looking for doctor with ID: " + currentDoctorId);
        
        try {
            Doctor doctor = doctorService.findDoctorById(currentDoctorId);
            System.out.println("DoctorController.getDoctorProfile: Found doctor: " + doctor.getName());
            
            DoctorProfileDTO profileDTO = DoctorProfileDTO.builder()
                    .id(doctor.getId())
                    .name(doctor.getName())
                    .specialization(doctor.getSpecialization())
                    .price(doctor.getPrice() != null ? doctor.getPrice().intValue() : 0)
                    .isProfileComplete(isProfileComplete(doctor))
                    .build();
            return ResponseEntity.ok(profileDTO);
        } catch (Exception e) {
            System.out.println("DoctorController.getDoctorProfile: Doctor not found with ID: " + currentDoctorId + ", error: " + e.getMessage());
            
            // If doctor not found, return empty profile for profile creation
            DoctorProfileDTO emptyProfile = DoctorProfileDTO.builder()
                    .id(currentDoctorId)
                    .name("")
                    .specialization("")
                    .price(0)
                    .isProfileComplete(false)
                    .build();
            return ResponseEntity.ok(emptyProfile);
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<DoctorProfileDTO> updateDoctorProfile(@RequestBody DoctorProfileDTO profileDTO) {
        // Get the current authenticated doctor ID from request header
        Long currentDoctorId = authenticationUtil.getCurrentDoctorId();
        
        try {
            Doctor doctor = doctorService.findDoctorById(currentDoctorId);
            
            Doctor updatedDoctor = doctor.toBuilder()
                    .name(profileDTO.getName())
                    .specialization(profileDTO.getSpecialization())
                    .price(profileDTO.getPrice() != null ? java.math.BigDecimal.valueOf(profileDTO.getPrice()) : null)
                    .build();
            
            Doctor savedDoctor = doctorService.updateDoctor(currentDoctorId, updatedDoctor);
            
            DoctorProfileDTO responseDTO = DoctorProfileDTO.builder()
                    .id(savedDoctor.getId())
                    .name(savedDoctor.getName())
                    .specialization(savedDoctor.getSpecialization())
                    .price(savedDoctor.getPrice() != null ? savedDoctor.getPrice().intValue() : 0)
                    .isProfileComplete(isProfileComplete(savedDoctor))
                    .build();
            
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            // If doctor doesn't exist, create profile using doctor service method
            try {
                Doctor savedDoctor = doctorService.createDoctorForAccount(
                        currentDoctorId,
                        profileDTO.getName(),
                        profileDTO.getSpecialization(),
                        profileDTO.getPrice() != null ? java.math.BigDecimal.valueOf(profileDTO.getPrice()) : null
                );
                
                DoctorProfileDTO responseDTO = DoctorProfileDTO.builder()
                        .id(savedDoctor.getId())
                        .name(savedDoctor.getName())
                        .specialization(savedDoctor.getSpecialization())
                        .price(savedDoctor.getPrice() != null ? savedDoctor.getPrice().intValue() : 0)
                        .isProfileComplete(isProfileComplete(savedDoctor))
                        .build();
                
                return ResponseEntity.ok(responseDTO);
            } catch (Exception createException) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }
    }

    @GetMapping("/profile/check-complete")
    public ResponseEntity<DoctorProfileCompleteDTO> checkProfileComplete() {
        // Get the current authenticated doctor ID from request header
        Long currentDoctorId = authenticationUtil.getCurrentDoctorId();
        
        try {
            Doctor doctor = doctorService.findDoctorById(currentDoctorId);
            boolean isComplete = isProfileComplete(doctor);
            int percentage = calculateCompletionPercentage(doctor);
            
            DoctorProfileCompleteDTO responseDTO = DoctorProfileCompleteDTO.builder()
                    .isComplete(isComplete)
                    .percentage(percentage)
                    .build();
            
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            // If doctor not found, return incomplete profile
            DoctorProfileCompleteDTO responseDTO = DoctorProfileCompleteDTO.builder()
                    .isComplete(false)
                    .percentage(0)
                    .build();
            
            return ResponseEntity.ok(responseDTO);
        }
    }

    @PostMapping("/admin/{accountId}")
    public ResponseEntity<DoctorDTO> createDoctorProfile(
            @PathVariable Long accountId,
            @RequestBody DoctorProfileDTO profileDTO) {
        try {
            Doctor doctor = doctorService.createDoctorForAccount(
                    accountId,
                    profileDTO.getName(),
                    profileDTO.getSpecialization(),
                    profileDTO.getPrice() != null ? java.math.BigDecimal.valueOf(profileDTO.getPrice()) : null
            );
            DoctorDTO doctorDTO = doctorMapper.toDTO(doctor);
            return ResponseEntity.status(HttpStatus.CREATED).body(doctorDTO);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    private boolean isProfileComplete(Doctor doctor) {
        return doctor.getName() != null && !doctor.getName().trim().isEmpty() &&
               doctor.getSpecialization() != null && !doctor.getSpecialization().trim().isEmpty() &&
               doctor.getPrice() != null && doctor.getPrice().intValue() > 0;
    }

    private int calculateCompletionPercentage(Doctor doctor) {
        int completed = 0;
        int total = 3;
        
        if (doctor.getName() != null && !doctor.getName().trim().isEmpty()) completed++;
        if (doctor.getSpecialization() != null && !doctor.getSpecialization().trim().isEmpty()) completed++;
        if (doctor.getPrice() != null && doctor.getPrice().intValue() > 0) completed++;
        
        return Math.round((completed * 100.0f) / total);
    }
}
