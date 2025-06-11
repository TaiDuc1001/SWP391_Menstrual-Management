package swp391.com.backend.domain.dto;

import lombok.Data;

@Data
public class CustomerDTO {
    private Integer id;
    private String firstName;
    private String lastName;
    private String email;
}
