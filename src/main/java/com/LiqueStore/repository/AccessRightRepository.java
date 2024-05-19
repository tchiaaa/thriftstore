package com.LiqueStore.repository;

import com.LiqueStore.model.AccessRightModel;
import com.LiqueStore.model.EmployeeModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccessRightRepository extends JpaRepository<AccessRightModel, Integer> {

}
