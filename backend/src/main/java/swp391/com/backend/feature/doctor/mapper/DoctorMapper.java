package swp391.com.backend.feature.doctor.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import swp391.com.backend.feature.doctor.dto.DoctorDTO;
import swp391.com.backend.feature.doctor.dto.SimpleDoctorDTO;
import swp391.com.backend.feature.doctor.data.Doctor;

@Mapper(componentModel = "spring")
public interface DoctorMapper {
    SimpleDoctorDTO toSimpleDTO(Doctor entity);
    @Mapping(target = "degree", source = "degree")
    @Mapping(target = "university", source = "university")
    DoctorDTO toDTO(Doctor entity);
    @Mapping(target = "degree", source = "degree")
    @Mapping(target = "university", source = "university")
    @Mapping(target = "account", ignore = true)
    @Mapping(target = "appointments", ignore = true)
    @Mapping(target = "schedules", ignore = true)
    Doctor toEntity(DoctorDTO dto);


}

