package swp391.com.backend.feature.doctor.controller;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp391.com.backend.feature.account.data.Account;
import swp391.com.backend.feature.account.data.AccountRepository;
import swp391.com.backend.feature.doctor.data.Doctor;
import swp391.com.backend.feature.doctor.dto.DoctorDTO;
import swp391.com.backend.feature.doctor.dto.SimpleDoctorDTO;
import swp391.com.backend.feature.doctor.mapper.DoctorMapper;
import swp391.com.backend.feature.doctor.service.DoctorService;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {
    private final DoctorService doctorService;
    private final DoctorMapper doctorMapper;
    private final AccountRepository accountRepository;

    @GetMapping
    public ResponseEntity<List<SimpleDoctorDTO>> getAllDoctors() {
        List<SimpleDoctorDTO> doctors = doctorService.getAllDoctors()
                .stream()
                .map(doctorMapper::toSimpleDTO)
                .toList();
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/by-id/{id}")
    public ResponseEntity<DoctorDTO> getDoctorById(@PathVariable Long id) {
        Doctor doctor = doctorService.findDoctorById(id);
        DoctorDTO doctorDTO = doctorMapper.toDTO(doctor);
        return ResponseEntity.ok(doctorDTO);
    }

    @PutMapping("/by-id/{id}")
    public ResponseEntity<DoctorDTO> updateDoctor(@PathVariable Long id,@RequestBody DoctorDTO doctorDTO) {
        Doctor doctorDetails = doctorMapper.toEntity(doctorDTO);
        Doctor updatedDoctor = doctorService.updateDoctor(id ,doctorDetails);
        DoctorDTO updatedDoctorDTO = doctorMapper.toDTO(updatedDoctor);
        return ResponseEntity.ok(updatedDoctorDTO);
    }

    // Đặt endpoint này TRƯỚC /{id}
    @GetMapping("/specializations")
    public ResponseEntity<List<String>> getAllSpecializations() {
        List<String> specializations = List.of(
            "Cardiology", "Dermatology", "Endocrinology", "Gynecology", "Neurology"
            // Thêm các chuyên khoa khác nếu cần
        );
        return ResponseEntity.ok(specializations);
    }

    @GetMapping("/profile")
    public ResponseEntity<DoctorDTO> getProfile() {
        // TODO: Lấy profile thực tế từ service hoặc context đăng nhập
        DoctorDTO mockProfile = new DoctorDTO();
        mockProfile.setName("Mock Doctor");
        mockProfile.setSpecialization("Cardiology");
        mockProfile.setPrice(new java.math.BigDecimal("100.0"));
        // Thêm các trường khác nếu cần
        return ResponseEntity.ok(mockProfile);
    }

    @GetMapping("/profile/check-complete")
    public ResponseEntity<Boolean> checkProfileComplete() {
        // TODO: Kiểm tra profile thực tế đã hoàn thành chưa
        // Tạm thời trả về true để frontend không lỗi
        return ResponseEntity.ok(true);
    }

    @PostMapping
    public ResponseEntity<DoctorDTO> createDoctor(@RequestBody DoctorDTO doctorDTO) {
        try {
            // Validate input
            if (doctorDTO.getAccountId() == null) {
                throw new IllegalArgumentException("Account ID is required");
            }
            
            // Fetch the Account entity by accountId from the DTO
            Account account = accountRepository.findById(doctorDTO.getAccountId())
                    .orElseThrow(() -> new EntityNotFoundException("Account not found with id: " + doctorDTO.getAccountId()));
            
            // Check if doctor already exists for this account
            if (doctorService.existsByAccountId(doctorDTO.getAccountId())) {
                throw new IllegalArgumentException("Doctor profile already exists for this account");
            }
            
            Doctor doctor = doctorMapper.toEntity(doctorDTO);
            doctor.setAccount(account); // Set the account on the Doctor entity
            Doctor createdDoctor = doctorService.createDoctor(doctor);
            DoctorDTO createdDoctorDTO = doctorMapper.toDTO(createdDoctor);
            return ResponseEntity.ok(createdDoctorDTO);
        } catch (EntityNotFoundException | IllegalArgumentException e) {
            throw e; // Let the global exception handler handle these
        } catch (Exception e) {
            // Log the error
            e.printStackTrace();
            throw new RuntimeException("Error creating doctor profile: " + e.getMessage());
        }
    }

    @GetMapping("/profile/account/{accountId}")
    public ResponseEntity<DoctorDTO> getProfileByAccountId(@PathVariable(required = false) Long accountId) {
        if (accountId == null) {
            return ResponseEntity.badRequest().build();
        }
        // Find doctor by account id
        Doctor doctor = doctorService.findDoctorByAccountId(accountId);
        DoctorDTO doctorDTO = doctorMapper.toDTO(doctor);
        return ResponseEntity.ok(doctorDTO);
    }
}
