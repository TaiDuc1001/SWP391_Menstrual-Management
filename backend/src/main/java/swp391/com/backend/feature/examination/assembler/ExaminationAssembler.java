package swp391.com.backend.feature.examination.assembler;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;
import swp391.com.backend.feature.customer.controller.CustomerController;
import swp391.com.backend.feature.examination.controller.ExaminationController;
import swp391.com.backend.feature.examination.data.ExaminationStatus;
import swp391.com.backend.feature.examination.dto.ExaminationDTO;
import swp391.com.backend.feature.panel.controller.PanelController;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@Component
public class ExaminationAssembler implements RepresentationModelAssembler<ExaminationDTO, EntityModel<ExaminationDTO>> {

    @Override
    public EntityModel<ExaminationDTO> toModel(ExaminationDTO entity) {
        ExaminationDTO dummyDTO = new ExaminationDTO();
        EntityModel<ExaminationDTO> model = EntityModel.of(entity,
                linkTo(ExaminationController.class).slash(entity.getId()).withSelfRel().withType("GET,PUT,DELETE"),
                linkTo(CustomerController.class).slash(entity.getCustomerId()).withRel("customer").withType("GET,PUT,DELETE"),
                linkTo(PanelController.class).slash(entity.getPanelId()).withRel("panel").withType("GET,PUT,DELETE"));

        if(!(entity.getExaminationStatus() == ExaminationStatus.COMPLETED || entity.getExaminationStatus() == ExaminationStatus.CANCELLED)) {
            model.add(linkTo(methodOn(ExaminationController.class).updateExaminationStatus(entity.getId(), dummyDTO)).withRel("status").withType("PATCH"));
            model.add(linkTo(methodOn(ExaminationController.class).cancelExamination(entity.getId())).withRel("status").withType("DELETE"));
        }
        return model;
    }

    @Override
    public CollectionModel<EntityModel<ExaminationDTO>> toCollectionModel(Iterable<? extends ExaminationDTO> entities) {
        // Implement the method to convert a collection of ExaminationDTOs to CollectionModel
        return RepresentationModelAssembler.super.toCollectionModel(entities);
    }
}
