package com.LiqueStore.controller;

import com.LiqueStore.Response;
import com.LiqueStore.model.AccessRightModel;
import com.LiqueStore.model.CustomerModel;
import com.LiqueStore.model.EmployeeModel;
import com.LiqueStore.model.TemporaryOrderModel;
import com.LiqueStore.repository.CustomerRepository;
import com.LiqueStore.repository.EmployeeRepository;
import com.LiqueStore.repository.TemporaryOrderRepository;
import com.LiqueStore.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.logging.Logger;

@RestController
@RequestMapping
@CrossOrigin
public class LoginController {
    private static final Logger logger = Logger.getLogger(LoginController.class.getName());
    @Autowired
    private LoginService loginService;
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private TemporaryOrderRepository temporaryOrderRepository;
    @Autowired
    private EmployeeRepository employeeRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String username,
                                   @RequestParam String password,
                                   @RequestParam String orderid) {
        CustomerModel getCustData = customerRepository.findByUsername(username);
        TemporaryOrderModel temporaryOrderModel = temporaryOrderRepository.findByOrderid(orderid);
        if (getCustData != null && getCustData.getAccessRight().getId() == 4) {
            logger.info("data customer ada");
            CustomerModel getCustomer = customerRepository.findByUsername(username);
            boolean cekPhoneOrder = false;
            if (temporaryOrderModel != null){
                if (getCustomer.getPhonenumber().equals(temporaryOrderModel.getPhonenumber())){
                    cekPhoneOrder = true;
                }
            }
            boolean isAuthenticated = loginService.authenticateCustomer(username, password);
            if (isAuthenticated) {
                logger.info("username ada");
                Map<String, Object> response = new HashMap<>();
                response.put("customer", getCustomer);
                response.put("cekPhoneOrder", cekPhoneOrder);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("invalid username or password");
            }
        }
        else {
            EmployeeModel getEmployee = employeeRepository.findByUsername(username);
            boolean isAuthenticated = loginService.authenticateEmployee(username, password);
            if (isAuthenticated) {
                return ResponseEntity.ok(getEmployee);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("invalid username or password");
            }
        }
    }

    @PostMapping("/register")
    ResponseEntity<?> register(@RequestParam("username") String username,
                               @RequestParam("password") String password,
                               @RequestParam("name") String name,
                               @RequestParam("email") String email,
                               @RequestParam("usernameIG") String usernameIG,
                               @RequestParam("phonenumber") String phonenumber,
                               @RequestParam("birthdate") @DateTimeFormat(pattern = "yyyy-MM-dd") Date birthdate){
        CustomerModel existingUsername = customerRepository.findByUsername(username);
        if (existingUsername != null) {
            return ResponseEntity.badRequest().body(new Response("Username sudah digunakan"));
        }
        CustomerModel existingEmail = customerRepository.findByEmail(email);
        if (existingEmail != null) {
            return ResponseEntity.badRequest().body(new Response("Email sudah digunakan"));
        }
        CustomerModel addCustomer = new CustomerModel();
        addCustomer.setUsername(username);
        addCustomer.setPassword(passwordEncoder.encode(password));
        addCustomer.setName(name);
        addCustomer.setEmail(email);
        addCustomer.setUsernameig(usernameIG);
        addCustomer.setPhonenumber(phonenumber);
        addCustomer.setBirthdate(birthdate);
        AccessRightModel accessRightModel = new AccessRightModel(4);
        addCustomer.setAccessRight(accessRightModel);
        addCustomer.setStatus("active");
        customerRepository.save(addCustomer);
        TemporaryOrderModel temporaryOrderModel = new TemporaryOrderModel();
        temporaryOrderModel.setUsername(username);
        logger.info(String.valueOf(addCustomer));
        return ResponseEntity.ok(new Response("berhasil register"));
    }

    @GetMapping("/getNomorWa")
    public ResponseEntity<?> getNomorWa(@RequestParam(name = "orderid") String orderid){
        TemporaryOrderModel temporaryOrderModel = temporaryOrderRepository.findByOrderid(orderid);
        logger.info(orderid);
        return ResponseEntity.ok(temporaryOrderModel);
    }
}
