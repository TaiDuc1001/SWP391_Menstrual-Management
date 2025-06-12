package swp391.com.backend.domain.dto.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import swp391.com.backend.jpa.pojo.schedule.Slot;

import java.time.LocalDate;
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ExaminationCreateResponse {
    Long id;
    LocalDate date;
    Slot slot;
}
