package swp391.com.backend.feature.doctor.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import swp391.com.backend.feature.doctor.data.Doctor;
import swp391.com.backend.feature.doctor.data.DoctorRepository;
import swp391.com.backend.feature.account.data.Account;
import swp391.com.backend.feature.account.data.AccountRepository;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorService {
    private final DoctorRepository doctorRepository;
    private final AccountRepository accountRepository;

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
                .degree(doctorDetails.getDegree())
                .university(doctorDetails.getUniversity())
                .price(doctorDetails.getPrice())
                .experience(doctorDetails.getExperience())
                .build();
        return doctorRepository.save(doctor);
    }

    public Doctor createDoctorForAccount(Long accountId, String name, String specialization, BigDecimal price, int experience, String degree, String university) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException("Account not found with id: " + accountId));
        // Check if doctor profile already exists
        if (doctorRepository.findById(accountId).isPresent()) {
            Doctor existingDoctor = doctorRepository.findById(accountId).get();
            Doctor updatedDoctor = existingDoctor.toBuilder()
                    .name(name)
                    .specialization(specialization)
                    .price(price)
                    .experience(experience)
                    .degree(degree)
                    .university(university)
                    .build();
            return doctorRepository.save(updatedDoctor);
        }
        Doctor doctor = Doctor.builder()
                .account(account)
                .name(name)
                .specialization(specialization)
                .price(price)
                .experience(experience)
                .degree(degree)
                .university(university)
                .build();
        return doctorRepository.save(doctor);
    }

    public Doctor createOrUpdateDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }
}
