package swp391.com.backend.domain.dto;

import lombok.Data;

@Data
public class AccountDTO {
    private Integer id;
    private String email;
    public AccountDTO(Integer id, String email) {
        this.id = id;
        this.email = email;
    }
}
