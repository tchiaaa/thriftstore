package com.LiqueStore.repository;

import com.LiqueStore.model.AddressModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<AddressModel, Integer> {
}
