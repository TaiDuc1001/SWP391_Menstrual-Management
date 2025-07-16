package swp391.com.backend.feature.appointment.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RatingRequest {
    Integer score;
    String feedback;
}

