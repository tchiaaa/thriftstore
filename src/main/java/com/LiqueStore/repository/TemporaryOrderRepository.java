package com.LiqueStore.repository;

import com.LiqueStore.model.TemporaryOrderModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TemporaryOrderRepository extends JpaRepository<TemporaryOrderModel, Integer> {
}
