package com.LiqueStore.service;

import com.LiqueStore.model.TemporaryOrderModel;
import com.LiqueStore.repository.TemporaryOrderRepository;
import com.midtrans.httpclient.error.MidtransError;
import com.midtrans.service.MidtransCoreApi;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.List;

@Service
@CrossOrigin
public class MidtransService {
    private static final Logger log = LoggerFactory.getLogger(MidtransService.class);
    private final MidtransCoreApi midtransCoreApi;
    private final TemporaryOrderRepository temporaryOrderRepository;

    @Autowired
    public MidtransService(MidtransCoreApi midtransCoreApi, TemporaryOrderRepository temporaryOrderRepository) {
        this.midtransCoreApi = midtransCoreApi;
        this.temporaryOrderRepository = temporaryOrderRepository;
    }

    public static Timestamp convertStringToTimestamp(String timestampStr) {
        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            java.util.Date parsedDate = dateFormat.parse(timestampStr);
            return new Timestamp(parsedDate.getTime());
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert string to timestamp", e);
        }
    }

    public void checkAndUpdateOrderStatus(String masterOrderId) {
        try {
            // Get transaction status from Midtrans
            JSONObject responseBody = midtransCoreApi.checkTransaction(masterOrderId);
            String statusCode = responseBody.getString("status_code");
            String transactionStatus = responseBody.getString("transaction_status");
            String transactionTime = responseBody.getString("transaction_time");
            JSONObject customerDetails = responseBody.getJSONObject("customer_details");
            String username = customerDetails.getString("first_name");

            // Convert transactionTime to Timestamp
            Timestamp timestamp = convertStringToTimestamp(transactionTime);

            // If transaction is settled
            if ("200".equals(statusCode) && "settlement".equals(transactionStatus)) {
                List<TemporaryOrderModel> temporaryOrders = temporaryOrderRepository.findAllByMasterorderid(masterOrderId);
                for (TemporaryOrderModel temporaryOrderModel : temporaryOrders) {
                    // Check if the status is already "On Packing" and payment date is already set
                    if ("On Packing".equals(temporaryOrderModel.getStatus()) && temporaryOrderModel.getPaymentdate() != null) {
                        log.info("Order {} is already updated. Status: {}, Payment Date: {}",
                                temporaryOrderModel.getOrderid(),
                                temporaryOrderModel.getStatus(),
                                temporaryOrderModel.getPaymentdate());
                    } else {
                        // Update the status, payment date, and payment id
                        temporaryOrderModel.setStatus("On Packing");
                        temporaryOrderModel.setPaymentdate(timestamp);
                        temporaryOrderModel.setUsername(username);
                        temporaryOrderRepository.save(temporaryOrderModel);
                        // Log the updated order information
                        log.info("Order {} updated successfully. Status: {}, Payment Date: {}",
                                temporaryOrderModel.getOrderid(),
                                temporaryOrderModel.getStatus(),
                                temporaryOrderModel.getPaymentdate());
                    }
                }
            } else {
                log.warn("Failed to update order {}. Status code: {}, Transaction status: {}",
                        masterOrderId,
                        statusCode,
                        transactionStatus);
            }
        } catch (MidtransError | RuntimeException e) {
            log.error("Failed to check and update order status for orderId {}: {}", masterOrderId, e.getMessage());
        }
    }
}
