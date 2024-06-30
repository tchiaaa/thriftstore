package com.LiqueStore.repository;

import com.LiqueStore.model.TypeModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TypeRepository extends JpaRepository<TypeModel, Integer> {
    TypeModel findByTypecode(String typecode);
}
