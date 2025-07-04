package swp391.com.backend.feature.doctor.dto;

import lombok.Data;
import swp391.com.backend.feature.account.dto.ActorDTO;

import java.math.BigDecimal;

@Data
public class DoctorDTO implements ActorDTO {
    private Long id;
    private String name;
    private String specialization;
    private BigDecimal price;
}
