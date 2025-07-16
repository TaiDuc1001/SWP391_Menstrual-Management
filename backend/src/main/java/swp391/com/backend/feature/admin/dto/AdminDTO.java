package swp391.com.backend.feature.admin.dto;

import swp391.com.backend.feature.account.dto.ActorDTO;
import lombok.Data;

@Data
public class AdminDTO implements ActorDTO {
    private Integer id;
    private String name;
}

