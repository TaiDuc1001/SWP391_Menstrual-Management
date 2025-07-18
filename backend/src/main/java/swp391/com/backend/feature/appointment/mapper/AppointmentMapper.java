package swp391.com.backend.feature.appointment.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import swp391.com.backend.feature.appointment.dto.AppointmentDTO;
import swp391.com.backend.feature.appointment.dto.SimpleAppointmentDTO;
import swp391.com.backend.feature.appointment.data.Appointment;

@Mapper(componentModel = "spring")
public interface AppointmentMapper {
    @Mapping(source = "doctor.name", target = "doctorName")
    @Mapping(source = "customer.name", target = "customerName")
    @Mapping(source = "customer.phoneNumber", target = "phoneNumber")
    @Mapping(source = "slot.timeRange", target = "timeRange")
    SimpleAppointmentDTO toSimpleDTO(Appointment appointment);

    Appointment toEntity(AppointmentDTO dto);
    @Mapping(source = "customer.id", target = "customerId")
    @Mapping(source = "customer.name", target = "customerName")
    @Mapping(source = "customer.phoneNumber", target = "phoneNumber")
    @Mapping(source = "doctor.id", target = "doctorId")
    @Mapping(source = "doctor.name", target = "doctorName")
    @Mapping(source = "slot.timeRange", target = "timeRange")
    AppointmentDTO toDTO(Appointment entity);
}

