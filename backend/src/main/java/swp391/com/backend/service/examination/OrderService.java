package swp391.com.backend.service.examination;


import org.springframework.stereotype.Service;
import swp391.com.backend.jpa.pojo.examination.Examination;
import swp391.com.backend.jpa.repository.examination.OrderRepository;

import java.util.List;

@Service
public class OrderService {
    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<Examination> getAllOrders() {
        return orderRepository.findAll();
    }

    public Examination createOrder(Examination examination) {
        return orderRepository.save(examination);
    }

    public void deleteOrder(Long id){
        Examination examination = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        orderRepository.delete(examination);
    }
}
