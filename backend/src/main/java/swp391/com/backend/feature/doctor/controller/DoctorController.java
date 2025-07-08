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

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {
    private final DoctorService doctorService;
    private final DoctorMapper doctorMapper;    @GetMapping
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
        // For now, return a mock profile for doctor ID 1
        // In a real implementation, you would get the current authenticated doctor
        Doctor doctor = doctorService.findDoctorById(1L);
        DoctorProfileDTO profileDTO = DoctorProfileDTO.builder()
                .id(doctor.getId())
                .name(doctor.getName())
                .specialization(doctor.getSpecialization())
                .price(doctor.getPrice() != null ? doctor.getPrice().intValue() : 0)
                .isProfileComplete(isProfileComplete(doctor))
                .build();
        return ResponseEntity.ok(profileDTO);
    }

    @PutMapping("/profile")
    public ResponseEntity<Void> updateDoctorProfile(@RequestBody DoctorProfileDTO profileDTO) {
        // Updating profile is not allowed - view only
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).build();
    }

    @GetMapping("/profile/check-complete")
    public ResponseEntity<DoctorProfileCompleteDTO> checkProfileComplete() {
        // For now, check doctor ID 1
        // In a real implementation, you would get the current authenticated doctor
        Doctor doctor = doctorService.findDoctorById(1L);
        boolean isComplete = isProfileComplete(doctor);
        int percentage = calculateCompletionPercentage(doctor);
        
        DoctorProfileCompleteDTO responseDTO = DoctorProfileCompleteDTO.builder()
                .isComplete(isComplete)
                .percentage(percentage)
                .build();
        
        return ResponseEntity.ok(responseDTO);
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
