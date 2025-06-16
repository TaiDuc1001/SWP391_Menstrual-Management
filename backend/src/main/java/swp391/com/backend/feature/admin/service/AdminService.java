package swp391.com.backend.feature.admin.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import swp391.com.backend.feature.admin.data.Admin;
import swp391.com.backend.feature.admin.data.AdminRepository;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final AdminRepository adminRepository;

    public Admin findAdminById(Long id) {
        return adminRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Admin not found with id: " + id));
    }

    public Admin createAdmin(Admin admin) {
        return adminRepository.save(admin);
    }
}
