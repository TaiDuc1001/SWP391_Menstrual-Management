package swp391.com.backend.feature.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemNotificationDTO {
    private String message;
    private String type; // warning, info, error
    private String priority; // high, medium, low
    private boolean isRead;
}
