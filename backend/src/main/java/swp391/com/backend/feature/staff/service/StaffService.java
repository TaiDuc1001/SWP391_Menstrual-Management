package swp391.com.backend.feature.staff.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import swp391.com.backend.feature.staff.data.Staff;
import swp391.com.backend.feature.staff.data.StaffRepository;

@Service
@RequiredArgsConstructor
public class StaffService {
    private final StaffRepository staffRepository;

    public Staff findStaffById(Long id) {
        return staffRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Staff not found with id: " + id));
    }

    public Staff createStaff(Staff staff) {
        return staffRepository.save(staff);
    }
}
