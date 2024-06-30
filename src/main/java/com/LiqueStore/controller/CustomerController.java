package com.LiqueStore.controller;

import com.LiqueStore.model.*;
import com.LiqueStore.repository.*;
import com.LiqueStore.service.RajaOngkirService;
import com.midtrans.httpclient.error.MidtransError;
import com.midtrans.service.MidtransSnapApi;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/customer")
@CrossOrigin
public class CustomerController {
    private static final Logger logger = Logger.getLogger(ManagerController.class.getName());
    private static final org.slf4j.Logger log = LoggerFactory.getLogger(CustomerController.class);
    private final MidtransSnapApi snapApi;
    @Autowired
    public CustomerController(MidtransSnapApi snapApi) {
        this.snapApi = snapApi;
    }
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private TemporaryOrderRepository temporaryOrderRepository;
    @Autowired
    private AddressRepository addressRepository;
    @Autowired
    private RajaOngkirService rajaOngkirService;

    @PostMapping("/api/payment")
    public ResponseEntity<?> paymentGetaway(@RequestParam("masterorderid") String masterorderid,
                                            @RequestParam("customerid") int customerid,
                                            @RequestParam("address") String address,
                                            @RequestParam("city") String city,
                                            @RequestParam("zipcode") String zipcode,
                                            @RequestParam("totalprice") int totalprice) throws MidtransError {
        Map<String, Object> transactionDetails = new HashMap<>();
        transactionDetails.put("order_id", masterorderid);
        transactionDetails.put("gross_amount", totalprice);

        Map<String, Object> params = new HashMap<>();
        params.put("transaction_details", transactionDetails);
        params.put("enabled_payments", new String[]{"bca_va", "shopeepay", "qris", "ovo"});

        Optional<CustomerModel> optionalCustomerModel = customerRepository.findById(customerid);
        if (optionalCustomerModel.isPresent()){
            CustomerModel customerModel = optionalCustomerModel.get();
//        Customer details
            Map<String, Object> customerDetails = new HashMap<>();
            customerDetails.put("first_name", customerModel.getName());
            customerDetails.put("email", customerModel.getEmail());
            customerDetails.put("phone", customerModel.getPhonenumber());
            params.put("customer_details", customerDetails);

//        Shipping Address
            Map<String, Object> shippingAddress = new HashMap<>();
            shippingAddress.put("first_name", customerModel.getUsername());
            shippingAddress.put("phone", customerModel.getPhonenumber());
            shippingAddress.put("address", address);
            shippingAddress.put("city", city);
            shippingAddress.put("postal_code", zipcode);
            shippingAddress.put("country_code", "IDN");
            customerDetails.put("shipping_address", shippingAddress);


        }

        String token = snapApi.createTransactionToken(params);
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        logger.info(String.valueOf(response));
        return ResponseEntity.ok(response);
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

//

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
    }

    @GetMapping("/getCustData")
    public ResponseEntity<?> getCustData(@RequestParam(name = "id") int id){
        boolean cekId = false;
        List<CustomerModel> getAllCust = customerRepository.findAll();
        for (int i = 0; i < getAllCust.size(); i++) {
            if (getAllCust.get(i).getId() == id){
                cekId = true;
                break;
            }
        }
        if (cekId){
            logger.info(String.valueOf(getAllCust));
            return ResponseEntity.ok(getAllCust);
        }
        else{
            return ResponseEntity.badRequest().body("Employee not found with ID: " + id);
        }
    }

    @GetMapping("/getOrderData")
    public ResponseEntity<?> getOrderData(@RequestParam(name = "id") int customerid){
        Optional<CustomerModel> listCust = customerRepository.findById(customerid);
        List<TemporaryOrderModel> listTemporaryOrder = temporaryOrderRepository.findAll();
        if (listCust.isPresent()){
            CustomerModel customerModel = listCust.get();
            List<TemporaryOrderModel> listTempOrder = listTemporaryOrder.stream()
                    .filter(order -> customerModel.getPhonenumber().contains(order.getPhonenumber()))
                    .toList();
            Map<String, Object> listDataOrder = new HashMap<>();
            listDataOrder.put("orders", listTempOrder); // Store number of orders
            listDataOrder.put("totalPrice", listTempOrder.stream().mapToInt(TemporaryOrderModel::getTotalprice).sum());
            listDataOrder.put("totalWeight", listTempOrder.stream().mapToInt(TemporaryOrderModel::getTotalweight).sum());
            return ResponseEntity.ok(listDataOrder);
        }
        else{
            return ResponseEntity.badRequest().body("customer id tidak ditemukan");
        }
    }

    @GetMapping("/getAddressData")
    public ResponseEntity<?> getAddressData(@RequestParam(name = "id") int id){
        List<AddressModel> getAddress = addressRepository.findAll();
        if (getAddress.isEmpty()) {
            return ResponseEntity.badRequest().body("tidak ada data");
        }

        // Memfilter alamat berdasarkan id pelanggan
        List<AddressModel> filteredAddress = getAddress.stream()
                .filter(address -> address.getCustomer().getId() == id)
                .collect(Collectors.toList());

        if (!filteredAddress.isEmpty()) {
            logger.info("address ditemukan");
            logger.info(String.valueOf(filteredAddress));
            return ResponseEntity.ok(filteredAddress);
        } else {
            return ResponseEntity.badRequest().body("address tidak ditemukan");
        }
    }

    @PostMapping("/tambahAddress")
    public ResponseEntity<?> tambahAddress(@RequestParam(value = "id", required = false) Integer id,
                                           @RequestParam("addressname") String addressname,
                                           @RequestParam("addressdetail") String addressdetail,
                                           @RequestParam("city") String city,
                                           @RequestParam("state") String state,
                                           @RequestParam("country") String country,
                                           @RequestParam("zipcode") int zipcode,
                                           @RequestParam("note") String note,
                                           @RequestParam("customerid") int customerid,
                                           @RequestParam("cityId") int cityid
                                           ){
        if (id == null){
            AddressModel addressModel = new AddressModel();
            addressModel.setAddressname(addressname);
            addressModel.setAddressdetail(addressdetail);
            addressModel.setCity(city);
            addressModel.setState(state);
            addressModel.setZipcode(zipcode);
            addressModel.setNote(note);
            addressModel.setCustomer(new CustomerModel(customerid));
            addressModel.setCityid(cityid);
            addressRepository.save(addressModel);
            return ResponseEntity.ok("Berhasil Menambah Address");
        }
        else{
            Optional<AddressModel> optionalAddressModel = addressRepository.findById(id);
            if (optionalAddressModel.isPresent()){
                AddressModel getAddress = optionalAddressModel.get();
                getAddress.setAddressname(addressname);
                getAddress.setAddressdetail(addressdetail);
                getAddress.setCity(city);
                getAddress.setState(state);
                getAddress.setZipcode(zipcode);
                getAddress.setNote(note);
                getAddress.setCityid(cityid);
                addressRepository.save(getAddress);
                return ResponseEntity.ok("Berhasil Mengubah Address");
            } else{
                return ResponseEntity.badRequest().body("address not found");
            }
        }
    }

    @GetMapping("/api/rajaongkir/provinces")
    public String getProvinces() {
        return rajaOngkirService.getProvinces();
    }

    @GetMapping("/api/rajaongkir/cities/{provinceId}")
    public String getCities(@PathVariable int provinceId) {
        log.info("masuk pilih kota");
        return rajaOngkirService.getCities(provinceId);
    }

    @GetMapping("/api/rajaongkir/cost")
    public String getShippingCost(@RequestParam int origin, @RequestParam int destination, @RequestParam int weight) {
        return rajaOngkirService.getShippingCost(origin, destination, weight);
    }
}
