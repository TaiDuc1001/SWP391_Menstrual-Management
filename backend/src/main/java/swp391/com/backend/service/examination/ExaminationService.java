package swp391.com.backend.service.examination;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import swp391.com.backend.jpa.pojo.examination.Examination;
import swp391.com.backend.jpa.repository.examination.OrderRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExaminationService {
    private final OrderRepository orderRepository;

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
