package swp391.com.backend.feature.schedule.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SlotResponse {
    private String name;
    private String timeRange;
}
