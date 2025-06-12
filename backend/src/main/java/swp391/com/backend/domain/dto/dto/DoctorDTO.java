package swp391.com.backend.domain.dto.dto;

import lombok.Data;

@Data
public class DoctorDTO {
    private Long id;
    private String name;
    private String specialization;
    private String price; // Changed to String to handle BigDecimal formatting
    private String email; // Assuming email is part of the DoctorDTO
}
