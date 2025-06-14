package swp391.com.backend.domain.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import swp391.com.backend.domain.dto.dto.AppointmentDTO;
import swp391.com.backend.domain.dto.simpledto.SimpleAppointmentDTO;
import swp391.com.backend.jpa.pojo.appointments.Appointment;

@Mapper(componentModel = "spring")
public interface AppointmentMapper {
    @Mapping(source = "doctor.name", target = "doctorName")
    @Mapping(source = "slot.timeRange", target = "timeRange")
    SimpleAppointmentDTO toSimpleDTO(Appointment appointment);

    Appointment toEntity(AppointmentDTO dto);

    @Mapping(source = "customer.id", target = "customerId")
    @Mapping(source = "doctor.id", target = "doctorId")
    @Mapping(source = "slot.timeRange", target = "timeRange")
    AppointmentDTO toDTO(Appointment entity);
}
