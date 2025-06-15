package swp391.com.backend.domain.dto.request;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import swp391.com.backend.domain.dto.dto.TestResultListDTO;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ExaminationUpdateRequest {
    Long id;
    String date;
    String timeRange;
    List<TestResultListDTO> testResults;
    String customerName;
    String staffName;
    String examinationStatus;
}
