package swp391.com.backend.controller.order;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import swp391.com.backend.dto.OrderRequestDTO;
import swp391.com.backend.pojo.order.Order;
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

    @PostMapping("/api/orders/create")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequestDTO orderRequest) {
        Order order = new Order();
        order.setCustomer(orderRequest.getCustomer());
        order.setDate(orderRequest.getDate());
        order.setTotalAmount(orderRequest.getTotalAmount());
        order.setNote(orderRequest.getNote());
        order.setSlot(orderRequest.getSlot());
        Order createdOrder = orderService.createOrder(order);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(createdOrder);
    }
}
