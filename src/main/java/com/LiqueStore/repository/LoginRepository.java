package com.LiqueStore.repository;

import com.LiqueStore.model.EmployeeModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoginRepository extends JpaRepository<EmployeeModel, Long> {
    EmployeeModel findByUsername(String username);
}
