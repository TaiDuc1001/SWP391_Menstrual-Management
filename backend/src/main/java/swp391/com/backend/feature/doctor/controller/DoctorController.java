package swp391.com.backend.feature.doctor.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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

    @GetMapping
    public ResponseEntity<List<SimpleDoctorDTO>> getAllDoctors() {
        List<SimpleDoctorDTO> doctors = doctorService.getAllDoctors()
                .stream()
                .map(doctorMapper::toSimpleDTO)
                .toList();
        return ResponseEntity.ok(doctors);
    }
}
