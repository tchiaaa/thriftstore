package com.LiqueStore.controller;

import com.LiqueStore.model.EmployeeModel;
import com.LiqueStore.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.logging.Logger;
import java.util.List;

@RestController
@RequestMapping
@CrossOrigin
public class LoginController {
    private static final Logger logger = Logger.getLogger(LoginController.class.getName());

    @Autowired
    private LoginService loginService;

    @PostMapping("/login")
    public ResponseEntity<List<EmployeeModel>> login(@RequestBody EmployeeModel employeeModel) {
        List<EmployeeModel> getEmployee = loginService.getUsersByUsername(employeeModel.getUsername());
        boolean isAuthenticated = loginService.authenticate(employeeModel.getUsername(),
                employeeModel.getPassword());
        if (isAuthenticated) {
            return ResponseEntity.ok(getEmployee);
        } else {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
            return ResponseEntity.ofNullable(null);
        }
    }

}
