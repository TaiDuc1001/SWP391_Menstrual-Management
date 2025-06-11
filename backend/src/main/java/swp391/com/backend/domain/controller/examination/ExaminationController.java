package swp391.com.backend.domain.controller.examination;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp391.com.backend.domain.dto.dto.ExaminationDTO;
import swp391.com.backend.domain.dto.dto.SimpleExaminationDTO;
import swp391.com.backend.domain.dto.request.OrderCreateRequest;
import swp391.com.backend.domain.mapper.ExaminationMapper;
import swp391.com.backend.jpa.pojo.examination.Examination;
import swp391.com.backend.service.examination.OrderService;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class ExaminationController {
    private final OrderService orderService;
    private final ExaminationMapper examinationMapper;

    @GetMapping
    public ResponseEntity<List<SimpleExaminationDTO>> getAllOrders() {
        List<SimpleExaminationDTO> result = orderService.getAllOrders()
                .stream()
                .map(examinationMapper::toSimpleDTO)
                .toList();
        result.forEach(System.out::println);
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<ExaminationDTO> createOrder(@RequestBody OrderCreateRequest request) {

        Examination examination = Examination.builder()
                .panel(request.getAPanel())
                .date(request.getDate())
                .slot(request.getSlot())
                .build();

        Examination createdExamination = orderService.createOrder(examination);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(examinationMapper.toDTO(createdExamination));
    }



    @DeleteMapping("/api/orders/{id}")
    public ResponseEntity<Void> deleteOrder(@RequestBody ExaminationDTO orderRequest) {
        orderService.deleteOrder(orderRequest.getId());
        return ResponseEntity.noContent().build();
    }
}
