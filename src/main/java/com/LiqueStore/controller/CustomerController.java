package com.LiqueStore.controller;

import com.LiqueStore.model.PaymentModel;
import com.LiqueStore.repository.PaymentRepository;
import com.midtrans.httpclient.error.MidtransError;
import com.midtrans.service.MidtransSnapApi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

@RestController
@RequestMapping("/customer")
@CrossOrigin
public class CustomerController {
    private static final Logger logger = Logger.getLogger(ManagerController.class.getName());
    private final MidtransSnapApi snapApi;
    @Autowired
    public CustomerController(MidtransSnapApi snapApi) {
        this.snapApi = snapApi;
    }
    @Autowired
    private PaymentRepository paymentRepository;

    @PostMapping("/api/payment")
    public ResponseEntity<?> paymentGetaway(@RequestParam("orderid") String orderid,
                                            @RequestParam("totalprice") int totalprice) throws MidtransError {
        Map<String, Object> transactionDetails = new HashMap<>();
        transactionDetails.put("order_id", orderid);
        transactionDetails.put("gross_amount", totalprice);

        Map<String, Object> params = new HashMap<>();
        params.put("transaction_details", transactionDetails);

        // Konfigurasi pembayaran yang diizinkan
        params.put("enabled_payments", new String[]{"bca_va", "shopeepay", "qris", "ovo"});

        // Customer details
//        Map<String, Object> customerDetails = new HashMap<>();
//        customerDetails.put("first_name", "John");
//        customerDetails.put("last_name", "Doe");
//        customerDetails.put("email", "john.doe@example.com");
//        customerDetails.put("phone", "081234567890");
//        params.put("customer_details", customerDetails);

        // Item details
//        List<Map<String, Object>> itemDetails = new ArrayList<>();
//        Map<String, Object> item1 = new HashMap<>();
//        item1.put("id", "item1");
//        item1.put("price", 100000);
//        item1.put("quantity", 1);
//        item1.put("name", "Product 1");
//        itemDetails.add(item1);
//
//        Map<String, Object> item2 = new HashMap<>();
//        item2.put("id", "item2");
//        item2.put("price", 50000);
//        item2.put("quantity", 2);
//        item2.put("name", "Product 2");
//        itemDetails.add(item2);
//        params.put("item_details", itemDetails);

//        Shipping Address
//        Map<String, Object> shippingAddress = new HashMap<>();
//        shippingAddress.put("first_name", "John");
//        shippingAddress.put("last_name", "Doe");
//        shippingAddress.put("phone", "081234567890");
//        shippingAddress.put("address", "Jl. Kebon Jeruk");
//        shippingAddress.put("city", "Jakarta");
//        shippingAddress.put("postal_code", "12345");
//        shippingAddress.put("country_code", "IDN");
//        customerDetails.put("shipping_address", shippingAddress);

//        Billing Address
//        Map<String, Object> billingAddress = new HashMap<>();
//        billingAddress.put("first_name", "John");
//        billingAddress.put("last_name", "Doe");
//        billingAddress.put("phone", "081234567890");
//        billingAddress.put("address", "Jl. Kebon Jeruk");
//        billingAddress.put("city", "Jakarta");
//        billingAddress.put("postal_code", "12345");
//        billingAddress.put("country_code", "IDN");
//        customerDetails.put("billing_address", billingAddress);

//        Expiry
//        Map<String, Object> expiry = new HashMap<>();
//        expiry.put("start_time", "2024-06-22 18:00:00 +0700");
//        expiry.put("unit", "hour");
//        expiry.put("duration", 24);
//        params.put("expiry", expiry);

        String token = snapApi.createTransactionToken(params);

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        logger.info(String.valueOf(response));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/addPayment")
    ResponseEntity<?> addPayment(@RequestParam("payment_type") String paymentType){
        PaymentModel paymentModel = new PaymentModel();
        paymentModel.setNama(paymentType);
        paymentRepository.save(paymentModel);
        return ResponseEntity.ok(paymentModel);
    }
}
