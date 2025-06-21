package swp391.com.backend.feature.vnpay.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp391.com.backend.feature.vnpay.dto.CreatePaymentRequest;
import swp391.com.backend.feature.vnpay.service.VNPayService;

import java.io.UnsupportedEncodingException;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping ("/api/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final VNPayService vnPayService;

    @GetMapping
    public ResponseEntity<String> createPayment(@RequestBody CreatePaymentRequest dto) throws UnsupportedEncodingException {
        return ResponseEntity.ok(vnPayService.createPayment(dto));
    }


    @GetMapping("/payment-return")
    public ResponseEntity<Map<String, String>> paymentReturn(@RequestParam Map<String, String> queryParams) {
        return ResponseEntity.ok(queryParams);
    }
}
