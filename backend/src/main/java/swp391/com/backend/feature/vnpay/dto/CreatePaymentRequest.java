package swp391.com.backend.feature.vnpay.dto;

import lombok.Data;

@Data
public class CreatePaymentRequest {
    private long amount;
    private String serviceId;
    private String service;
}

