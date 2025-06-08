package swp391.com.backend.dto;

import lombok.Getter;
import lombok.Setter;
import swp391.com.backend.pojo.roles.Customer;
import swp391.com.backend.pojo.roles.Doctor;

@Getter
@Setter
public class AppointmentDTO {
    private Customer customer;
    private String appointmentDate;
    private String status;
    private Doctor doctor;
    private Integer slot;
    private String note;
    private String description;

}
