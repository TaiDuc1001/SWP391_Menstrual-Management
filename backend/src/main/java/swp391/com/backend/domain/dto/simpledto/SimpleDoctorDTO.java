package swp391.com.backend.domain.dto.simpledto;

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
    BigDecimal price; // Use String to handle formatting and currency symbols
}
