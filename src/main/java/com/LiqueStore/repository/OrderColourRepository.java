package com.LiqueStore.repository;

import com.LiqueStore.model.OrderColourModel;
import com.LiqueStore.model.TypeModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderColourRepository extends JpaRepository<OrderColourModel, Integer> {
    OrderColourModel findByColourcode(String colourcode);
}
