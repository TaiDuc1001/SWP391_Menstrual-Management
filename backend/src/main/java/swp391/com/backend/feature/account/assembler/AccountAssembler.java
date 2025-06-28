package swp391.com.backend.feature.account.assembler;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;
import swp391.com.backend.feature.account.controller.AccountController;
import swp391.com.backend.feature.account.data.Role;
import swp391.com.backend.feature.account.dto.AccountDTO;
import swp391.com.backend.feature.customer.controller.CustomerController;
import swp391.com.backend.feature.doctor.controller.DoctorController;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@Component
public class AccountAssembler implements RepresentationModelAssembler<AccountDTO, EntityModel<AccountDTO>> {
    @Override
    public EntityModel<AccountDTO> toModel(AccountDTO entity) {
        EntityModel<AccountDTO> model = EntityModel.of(entity,
                linkTo(AccountController.class).slash(entity.getId()).withSelfRel(),
                linkTo(AccountController.class).withRel("allAccounts"));

        if(entity.getRole() == Role.CUSTOMER) {
            model.add(linkTo(methodOn(CustomerController.class).getCustomerById(entity.getId())).withRel("customer"));
        } else if(entity.getRole() == Role.DOCTOR) {
            model.add(linkTo(methodOn(DoctorController.class).getDoctorById(entity.getId())).withRel("doctor"));
        }
        return model;
    }

    @Override
    public CollectionModel<EntityModel<AccountDTO>> toCollectionModel(Iterable<? extends AccountDTO> entities) {
        return RepresentationModelAssembler.super.toCollectionModel(entities);
    }
}