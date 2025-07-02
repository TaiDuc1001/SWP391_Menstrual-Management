package swp391.com.backend.feature.appointment.assembler;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;
import swp391.com.backend.feature.appointment.controller.AppointmentsController;
import swp391.com.backend.feature.appointment.data.AppointmentStatus;
import swp391.com.backend.feature.appointment.dto.AppointmentDTO;
import swp391.com.backend.feature.customer.controller.CustomerController;
import swp391.com.backend.feature.doctor.controller.DoctorController;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@Component
public class AppointmentAssembler implements RepresentationModelAssembler<AppointmentDTO, EntityModel<AppointmentDTO>> {
    @Override
    public CollectionModel<EntityModel<AppointmentDTO>> toCollectionModel(Iterable<? extends AppointmentDTO> entities) {
        CollectionModel<EntityModel<AppointmentDTO>> collectionModel = RepresentationModelAssembler.super.toCollectionModel(entities);
        collectionModel.add(linkTo(AppointmentsController.class).withSelfRel().withType("GET,POST"));
        return collectionModel;
    }

    @Override
    public EntityModel<AppointmentDTO> toModel(AppointmentDTO entity) {
        EntityModel<AppointmentDTO> model = EntityModel.of(entity,
                linkTo(AppointmentsController.class).slash(entity.getId()).withSelfRel().withType("GET,PUT,DELETE"),
                linkTo(AppointmentsController.class).withRel("appointments").withType("GET,POST"),
                linkTo(DoctorController.class).slash(entity.getDoctorId()).withRel("doctor").withType("GET,PUT,DELETE"),
                linkTo(CustomerController.class).slash(entity.getCustomerId()).withRel("customer").withType("GET,PUT,DELETE"));

        if(entity.getAppointmentStatus() == (AppointmentStatus.CONFIRMED)) {
            if(!entity.getCustomerReady()){ model.add(linkTo(methodOn(AppointmentsController.class).customerConfirm(entity.getCustomerId())).withRel("ready").withTitle("Customer ready").withType("PATCH")); }
            if(!entity.getDoctorReady()){ model.add(linkTo(methodOn(AppointmentsController.class).doctorConfirm(entity.getDoctorId())).withRel("ready").withTitle("Doctor ready").withType("PATCH")); }
        } else if (entity.getAppointmentStatus() == (AppointmentStatus.IN_PROGRESS)) {
            model.add(linkTo(AppointmentsController.class).slash("status").withRel("finish").withType("PATCH"));
        } else if(entity.getAppointmentStatus() == (AppointmentStatus.BOOKED)) {
            model.add(linkTo(methodOn(AppointmentsController.class).cancelAppointment(entity.getId())).withRel("cancel").withType("DELETE"));
        }
        return model;
    }
}
