package swp391.com.backend.domain.controller.order;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp391.com.backend.domain.dto.dto.OrderDTO;
import swp391.com.backend.domain.dto.request.OrderCreateRequest;
import swp391.com.backend.domain.mapper.OrderMapper;
import swp391.com.backend.jpa.pojo.order.Examination;
import swp391.com.backend.service.order.OrderService;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
    private final OrderMapper orderMapper;

    @GetMapping
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        List<OrderDTO> result = orderService.getAllOrders()
                .stream()
                .map(orderMapper::toDTO)
                .toList();
        result.forEach(System.out::println);
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(@RequestBody OrderCreateRequest request) {

        Examination examination = Examination.builder()
                .aPanel(request.getAPanel())
                .date(request.getDate())
                .slot(request.getSlot())
                .note(request.getNote())
                .build();

        Examination createdExamination = orderService.createOrder(examination);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(orderMapper.toDTO(createdExamination));
    }



    @DeleteMapping("/api/orders/{id}")
    public ResponseEntity<Void> deleteOrder(@RequestBody OrderDTO orderRequest) {
        orderService.deleteOrder(orderRequest.getId());
        return ResponseEntity.noContent().build();
    }
}
