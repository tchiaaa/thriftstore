package com.LiqueStore.service;

import com.LiqueStore.model.AccessRightModel;
import com.LiqueStore.model.EmployeeModel;
import com.LiqueStore.repository.AccessRightRepository;
import com.LiqueStore.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LoginService {
    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private AccessRightRepository accessRightRepository;

    public List<EmployeeModel> getUsersByUsername(String username) {
        return employeeRepository.getEmployeeByUsername(username);
    }

    public Boolean authenticate(String username, String password) {
        EmployeeModel userDetails = employeeRepository.findByUsername(username);
        return userDetails != null && userDetails.getPassword().equals(password);
    }

    public List<EmployeeModel> getEmployeesByAccessRightId(int accessrightid) {
        AccessRightModel accessRight = accessRightRepository.findById(accessrightid)
                .orElseThrow(() -> new IllegalArgumentException("Invalid access right ID: " + accessrightid));
        return employeeRepository.findByAccessRight(accessRight);
    }
}

