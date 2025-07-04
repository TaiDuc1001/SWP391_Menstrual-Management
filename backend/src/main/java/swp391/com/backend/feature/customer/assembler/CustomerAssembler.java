package swp391.com.backend.feature.customer.assembler;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;
import swp391.com.backend.feature.account.controller.AccountController;
import swp391.com.backend.feature.appointment.controller.AppointmentsController;
import swp391.com.backend.feature.customer.controller.CustomerController;
import swp391.com.backend.feature.customer.dto.CustomerDTO;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@Component
public class CustomerAssembler implements RepresentationModelAssembler<CustomerDTO, EntityModel<CustomerDTO>> {
    @Override
    public EntityModel<CustomerDTO> toModel(CustomerDTO entity) {
        EntityModel<CustomerDTO> model = EntityModel.of(entity,
                linkTo(CustomerController.class).withSelfRel().withType("GET,PUT,DELETE"),
                linkTo(AccountController.class).slash(entity.getId()).withRel("accounts").withType("GET,PUT,DELETE"),
                linkTo(methodOn(AppointmentsController.class).getAppointmentsByCustomerId(entity.getId())).withRel("appointments").withType("GET"));
        return model;
    }

    @Override
    public CollectionModel<EntityModel<CustomerDTO>> toCollectionModel(Iterable<? extends CustomerDTO> entities) {
        return RepresentationModelAssembler.super.toCollectionModel(entities);
    }
}
