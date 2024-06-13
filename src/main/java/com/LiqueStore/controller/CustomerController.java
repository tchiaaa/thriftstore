package com.LiqueStore.controller;

import com.LiqueStore.model.PaymentModel;
import com.midtrans.httpclient.error.MidtransError;
import com.midtrans.service.MidtransSnapApi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

@RestController
@RequestMapping
@CrossOrigin
public class CustomerController {
    private static final Logger logger = Logger.getLogger(ManagerController.class.getName());
    private final MidtransSnapApi snapApi;
    @Autowired
    public CustomerController(MidtransSnapApi snapApi) {
        this.snapApi = snapApi;
    }

    @PostMapping("/api/payment")
    public ResponseEntity<?> paymentGetaway(@RequestParam("orderid") String orderid,
                                            @RequestParam("totalprice") int totalprice) throws MidtransError {
        Map<String, Object> transactionDetails = new HashMap<>();
        transactionDetails.put("order_id", orderid);
        transactionDetails.put("gross_amount", totalprice);

        Map<String, Object> params = new HashMap<>();
        params.put("transaction_details", transactionDetails);

        // Konfigurasi pembayaran yang diizinkan
        params.put("enabled_payments", new String[]{"bank_transfer", "shopeepay", "qris", "ovo"});

        String token = snapApi.createTransactionToken(params);

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        logger.info(String.valueOf(response));
        return ResponseEntity.ok(response);
    }
}
