package swp391.com.backend.feature.cycle.assembler;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;
import swp391.com.backend.feature.customer.controller.CustomerController;
import swp391.com.backend.feature.cycle.controller.CycleController;
import swp391.com.backend.feature.cycle.dto.CycleDTO;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;

@Component
public class CycleAssembler implements RepresentationModelAssembler<CycleDTO, EntityModel<CycleDTO>> {
    @Override
    public EntityModel<CycleDTO> toModel(CycleDTO entity) {
        EntityModel<CycleDTO> model = EntityModel.of(entity,
                linkTo(CycleController.class).withSelfRel().withType("GET,PUT,DELETE"),
                linkTo(CustomerController.class).slash(entity.getCustomerId()).withRel("customer").withType("GET,PUT,DELETE"));
        return model;
    }

    @Override
    public CollectionModel<EntityModel<CycleDTO>> toCollectionModel(Iterable<? extends CycleDTO> entities) {
        return RepresentationModelAssembler.super.toCollectionModel(entities);
    }
}
