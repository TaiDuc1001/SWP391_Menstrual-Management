package swp391.com.backend.feature.doctor.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
public class SimpleDoctorDTO {
    Long id;
    String name;
    String specialization;
    BigDecimal price;
    Integer experience; // Số năm kinh nghiệm
}
