package com.LiqueStore.repository;

import com.LiqueStore.model.AccessRightModel;
import com.LiqueStore.model.EmployeeModel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EmployeeRepository extends JpaRepository<EmployeeModel, Long> {
    EmployeeModel findByUsername(String username);
    List<EmployeeModel> findByAccessRight(AccessRightModel accessRight);
    List<EmployeeModel> getEmployeeByUsername(String username);
}
