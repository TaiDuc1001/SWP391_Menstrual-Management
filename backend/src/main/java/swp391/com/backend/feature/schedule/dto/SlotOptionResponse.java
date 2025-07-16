package swp391.com.backend.feature.schedule.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SlotOptionResponse {
    private String slot;
    private String name;
    private String timeRange;
    private int ordinal;
}

