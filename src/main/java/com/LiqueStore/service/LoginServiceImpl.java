package com.LiqueStore.service;

import com.LiqueStore.model.EmployeeModel;
import com.LiqueStore.repository.LoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LoginServiceImpl implements LoginService{
    @Autowired
    private LoginRepository loginRepository;

@Override
    public Boolean authenticate(String username, String password) {
        EmployeeModel userDetails = loginRepository.findByUsername(username);
        return userDetails != null && userDetails.getPassword().equals(password);
    }
}
