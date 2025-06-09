package swp391.com.backend.domain.controller.order;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp391.com.backend.domain.dto.request.OrderRequestDTO;
import swp391.com.backend.jpa.pojo.order.Order;
import swp391.com.backend.service.order.OrderService;

import java.util.List;

@RestController
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/api/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PostMapping("/api/orders")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequestDTO orderRequest) {
        Order order = new Order();
        order.setAPackage(orderRequest.getAPackage());
        order.setCustomer(orderRequest.getCustomer());
        order.setDate(orderRequest.getDate());
        order.setTotalAmount(orderRequest.getTotalAmount());
        order.setNote(orderRequest.getNote());
        order.setSlot(orderRequest.getSlot());
        Order createdOrder = orderService.createOrder(order);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(createdOrder);
    }
    @DeleteMapping("/api/orders/{id}")
    public ResponseEntity<Void> deleteOrder(@RequestBody OrderRequestDTO orderRequest) {
        orderService.deleteOrder(orderRequest.getId());
        return ResponseEntity.noContent().build();
    }
}
