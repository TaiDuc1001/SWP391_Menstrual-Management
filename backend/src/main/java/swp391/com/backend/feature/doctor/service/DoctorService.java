package swp391.com.backend.feature.doctor.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import swp391.com.backend.feature.doctor.data.Doctor;
import swp391.com.backend.feature.doctor.data.DoctorRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorService {
    private final DoctorRepository doctorRepository;

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Doctor findDoctorById(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Doctor not found with id: " + id));
    }

    public Doctor createDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    public Doctor updateDoctor(Long id, Doctor doctorDetails) {
        Doctor doctor = findDoctorById(id).toBuilder()
                .name(doctorDetails.getName())
                .specialization(doctorDetails.getSpecialization())
                .price(doctorDetails.getPrice())
                .build();
        return doctorRepository.save(doctor);
    }

    public Doctor findDoctorByAccountId(Long accountId) {
        return doctorRepository.findByAccountId(accountId)
                .orElseThrow(() -> new EntityNotFoundException("Doctor not found for account id: " + accountId));
    }
    
    public boolean existsByAccountId(Long accountId) {
        return doctorRepository.findByAccountId(accountId).isPresent();
    }
}
