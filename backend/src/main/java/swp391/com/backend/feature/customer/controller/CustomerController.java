package swp391.com.backend.feature.customer.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp391.com.backend.feature.customer.data.Customer;
import swp391.com.backend.feature.customer.dto.CustomerDTO;
import swp391.com.backend.feature.customer.mapper.CustomerMapper;
import swp391.com.backend.feature.customer.service.CustomerService;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {
    private final CustomerService customerService;
    private final CustomerMapper customerMapper;

    @GetMapping("/{id}")
    public ResponseEntity<CustomerDTO> getCustomerById(@PathVariable Long id) {
        Customer customer = customerService.getCustomerById(id);
        CustomerDTO customerDTO = customerMapper.toDTO(customer);
        return ResponseEntity.ok(customerDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerDTO> updateCustomer(@PathVariable Long id,@RequestBody CustomerDTO customerDTO) {
        Customer customerDetails = customerMapper.toEntity(customerDTO);
        System.out.println(customerDetails.getName());
        Customer customer = customerService.updateCustomer(id, customerDetails);
        CustomerDTO updatedCustomerDTO = customerMapper.toDTO(customer);
        return ResponseEntity.ok(updatedCustomerDTO);
    }
}
