package com.LiqueStore.repository;

import com.LiqueStore.model.CustomerModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CustomerRepository extends JpaRepository<CustomerModel, Integer> {
    CustomerModel findByUsername(String username);
    CustomerModel findByEmail(String email);
    List<CustomerModel> getCustomerByUsername(String username);
}
