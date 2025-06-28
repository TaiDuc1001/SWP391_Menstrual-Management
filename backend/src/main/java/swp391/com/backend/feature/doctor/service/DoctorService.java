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
        try {
            Doctor doctor = findDoctorById(id).toBuilder()
                    .name(doctorDetails.getName())
                    .specialization(doctorDetails.getSpecialization())
                    .price(doctorDetails.getPrice())
                    .build();
            return doctorRepository.save(doctor);
        } catch (EntityNotFoundException e) {
            // If doctor doesn't exist, create a new one with the given ID
            Doctor newDoctor = doctorDetails.toBuilder()
                    .id(id)
                    .build();
            return doctorRepository.save(newDoctor);
        }
    }

    public Doctor createOrUpdateDoctor(Long accountId, Doctor doctorDetails) {
        return doctorRepository.findById(accountId)
                .map(existingDoctor -> existingDoctor.toBuilder()
                        .name(doctorDetails.getName())
                        .specialization(doctorDetails.getSpecialization())
                        .price(doctorDetails.getPrice())
                        .build())
                .map(doctorRepository::save)
                .orElseGet(() -> {
                    Doctor newDoctor = doctorDetails.toBuilder()
                            .id(accountId)
                            .build();
                    return doctorRepository.save(newDoctor);
                });
    }
}
