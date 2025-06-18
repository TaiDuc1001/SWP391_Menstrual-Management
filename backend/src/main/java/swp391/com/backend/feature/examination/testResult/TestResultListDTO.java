package swp391.com.backend.feature.examination.testResult;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TestResultListDTO {
    Long testTypeId;
    String name;
    Boolean diagnosis;
    String testIndex;
    String normalRange;
    String note;
}
