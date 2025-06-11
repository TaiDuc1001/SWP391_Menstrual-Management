package swp391.com.backend.domain.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class PackageDTO {
    private Integer id;
    private String packageName;
    private String description;
    private BigDecimal price;
    private Integer duration;
    private Boolean isActive;
}
