package swp391.com.backend.domain.dto.dto;

import jdk.jshell.Snippet;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import swp391.com.backend.jpa.pojo.examination.ExaminationStatus;
import swp391.com.backend.jpa.pojo.schedule.Slot;

import java.time.LocalDate;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SimpleExaminationDTO {
    LocalDate date;
    Slot slot;
    String name;
    ExaminationStatus examinationStatus;
}
