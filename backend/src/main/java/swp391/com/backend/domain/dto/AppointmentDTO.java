package swp391.com.backend.domain.dto;

import lombok.Data;
import swp391.com.backend.jpa.pojo.roles.Customer;
import swp391.com.backend.jpa.pojo.roles.Doctor;

@Data
public class AppointmentDTO {
    private Customer customer;
    private String date;
    private String status;
    private Doctor doctor;
    private Integer slot;
    private String note;
    private String description;

}
