package swp391.com.backend.feature.customer.service;


import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import swp391.com.backend.feature.customer.data.Customer;
import swp391.com.backend.feature.customer.data.CustomerRepository;

@Service
@RequiredArgsConstructor
public class CustomerService {
    private final CustomerRepository customerRepository;

    public Customer findCustomerById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Customer not found with id: " + id));
    }

    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public Customer updateCustomer(Long id, Customer customerDetails) {
        Customer customer = findCustomerById(id).toBuilder()
                .id(id)
                .name(customerDetails.getName())
                .address(customerDetails.getAddress())
                .gender(customerDetails.getGender())
                .dateOfBirth(customerDetails.getDateOfBirth())
                .phoneNumber(customerDetails.getPhoneNumber())
                .cccd(customerDetails.getCccd())
                .build();

        return customerRepository.save(customer);
    }
}
