package com.LiqueStore.repository;

import com.LiqueStore.model.DetailOrdersModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DetailOrdersRepository extends JpaRepository<DetailOrdersModel, Integer> {
}
