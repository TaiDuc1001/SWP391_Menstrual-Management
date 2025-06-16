package swp391.com.backend.feature.testType.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TestTypeDTO {
    Long id;
    String name;
    String normalRange;
}
