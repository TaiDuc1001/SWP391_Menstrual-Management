package swp391.com.backend.domain.dto.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TestTypeDTO {
    String name;
    String normalRange;

}
