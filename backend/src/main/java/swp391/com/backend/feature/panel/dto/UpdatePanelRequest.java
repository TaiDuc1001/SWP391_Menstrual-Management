package swp391.com.backend.feature.panel.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import swp391.com.backend.feature.panel.data.PanelTag;
import swp391.com.backend.feature.panel.data.PanelType;

import java.math.BigDecimal;
import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdatePanelRequest {
    @NotBlank(message = "Panel name is required")
    String panelName;
    
    @NotBlank(message = "Description is required")
    String description;
    
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    BigDecimal price;
    
    @NotNull(message = "Response time is required")
    @Min(value = 1, message = "Response time must be at least 1 hour")
    Integer responseTime;
    
    @NotNull(message = "Duration is required")
    @Min(value = 1, message = "Duration must be at least 1 minute")
    Integer duration;
    
    @NotNull(message = "Panel type is required")
    PanelType panelType;
    
    @NotNull(message = "Panel tag is required")
    PanelTag panelTag;
    
    List<Long> testTypeIds;
}
