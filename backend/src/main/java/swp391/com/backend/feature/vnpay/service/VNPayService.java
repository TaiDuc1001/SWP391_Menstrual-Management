package swp391.com.backend.feature.vnpay.service;

import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import swp391.com.backend.feature.appointment.data.Appointment;
import swp391.com.backend.feature.vnpay.dto.CreatePaymentRequest;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class VNPayService {
    String vnp_Version = "2.1.0";
    String vnp_Command = "pay";
    String orderType = "other";
    String bankCode = "NCB";
    String vnp_IpAddr = "127.0.0.1";
    String vnp_TmnCode = "IRO2EWKH";
    String vnp_ReturnUrl = "http://localhost:8080/api/payments/payment-return";
    String vnp_Locale = "vn";


    private static String getRandomNumber(int len) {
        Random rnd = new Random();
        String chars = "0123456789";
        StringBuilder sb = new StringBuilder(len);
        for (int i = 0; i < len; i++) {
            sb.append(chars.charAt(rnd.nextInt(chars.length())));
        }
        return sb.toString();
    }

    private static String hmacSHA512(String key, String data) {
        try {

            if (key == null || data == null) {
                throw new NullPointerException();
            }
            final Mac hmac512 = Mac.getInstance("HmacSHA512");
            byte[] hmacKeyBytes = key.getBytes();
            final SecretKeySpec secretKey = new SecretKeySpec(hmacKeyBytes, "HmacSHA512");
            hmac512.init(secretKey);
            byte[] dataBytes = data.getBytes(StandardCharsets.UTF_8);
            byte[] result = hmac512.doFinal(dataBytes);
            StringBuilder sb = new StringBuilder(2 * result.length);
            for (byte b : result) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();

        } catch (Exception ex) {
            return "";
        }
    }

    private boolean verifyPaymentReturn(Map<String, String> vnpParams) {
        
        String vnpSecureHash = vnpParams.get("vnp_SecureHash");

        
        Map<String, String> params = new HashMap<>(vnpParams);
        params.remove("vnp_SecureHash");
        params.remove("vnp_SecureHashType");

        
        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);

        
        StringBuilder hashData = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = params.get(fieldName);
            if ((fieldValue != null) && (!fieldValue.isEmpty())) {
                hashData.append(fieldName);
                hashData.append('=');
                try {
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }

                if (itr.hasNext()) {
                    hashData.append('&');
                }
            }
        }

        
        String secureHash = hmacSHA512("5PZXHULWJC9I887GU5J0L018DGAQ4VIV", hashData.toString());

        
        return secureHash.equals(vnpSecureHash);
    }

    public String createPayment (CreatePaymentRequest dto) throws UnsupportedEncodingException {
        long amount = dto.getAmount()*100;
        String serviceId = dto.getServiceId();
        String vnp_TxnRef = getRandomNumber(8);


        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        if(dto.getService().trim().equalsIgnoreCase("Appointment")){
            vnp_ReturnUrl = "http://localhost:8080/api/appointments/payment/callback/" + serviceId;
        } else if (dto.getService().trim().equalsIgnoreCase("Examination")) {
            vnp_ReturnUrl = "http://localhost:8080/api/examinations/payment/callback/" + serviceId;
        } else{
            vnp_ReturnUrl = "http://localhost:8080/api/payments/payment-return";
        }


        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_BankCode", bankCode);
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang:" + vnp_TxnRef);
        vnp_Params.put("vnp_OrderType", orderType);
        vnp_Params.put("vnp_Locale", vnp_Locale);
        vnp_Params.put("vnp_ReturnUrl", vnp_ReturnUrl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);


        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();

        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (!fieldValue.isEmpty())) {
                //Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                //Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }

        String queryUrl = query.toString();
        String vnp_SecureHash = hmacSHA512("5PZXHULWJC9I887GU5J0L018DGAQ4VIV", hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html" + "?" + queryUrl;
        return paymentUrl;
    }
}
