package swp391.com.backend.feature.doctor.dto;

import lombok.Data;
import swp391.com.backend.feature.account.dto.ActorDTO;

@Data
public class DoctorDTO implements ActorDTO {
    private Long id;
    private String name;
    private String specialization;
    private String price; // Changed to String to handle BigDecimal formatting
    private String email; // Assuming email is part of the DoctorDTO
}
