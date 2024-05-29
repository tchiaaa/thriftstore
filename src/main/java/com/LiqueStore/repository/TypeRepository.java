package com.LiqueStore.repository;

import com.LiqueStore.model.TypeModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TypeRepository extends JpaRepository<TypeModel, Integer> {
}
