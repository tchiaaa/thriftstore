package com.LiqueStore.controller;

import com.LiqueStore.model.EmployeeModel;
import com.LiqueStore.model.ItemModel;
import com.LiqueStore.model.TypeModel;
import com.LiqueStore.repository.ItemRepository;
import com.LiqueStore.repository.TypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@RestController
@RequestMapping
@CrossOrigin
public class SupervisorController {
    private static final Logger logger = Logger.getLogger(ManagerController.class.getName());
    @Autowired
    private TypeRepository typeRepository;
    @Autowired
    private ItemRepository itemRepository;

    @GetMapping("/dataInventori")
    public ResponseEntity<?> dataInventori() {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd MMMM yyyy");
        List<ItemModel> getAllItem = itemRepository.findAll();
        logger.info(String.valueOf(getAllItem));
        List<Map<String, Object>> itemData = getAllItem.stream().map(item -> {
            Map<String, Object> empData = new HashMap<>();
            empData.put("id", item.getId());
            empData.put("nama", item.getName());
            empData.put("typeId", item.getTypeId());
            empData.put("customWeight", item.getCustomweight());
            empData.put("customCapitalPrice", item.getCustomcapitalprice());
            empData.put("customDefaultPrice", item.getCustomdefaultprice());
            empData.put("size", item.getSize());
            Timestamp lastUpdateDate = item.getLastupdate();
            if (lastUpdateDate != null) {
                LocalDateTime lastUpdateDateTime = LocalDateTime.ofInstant(lastUpdateDate.toInstant(), ZoneId.systemDefault());
                empData.put("lastupdate", lastUpdateDateTime.format(dateFormatter));
            } else {
                empData.put("lastupdate", null);
            }
            return empData;
        }).collect(Collectors.toList());
        logger.info(String.valueOf(itemData));
        return ResponseEntity.ok(itemData);
    }

    @GetMapping("/dataTipe")
    public ResponseEntity<?> dataTipe() {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd MMMM yyyy");
        List<TypeModel> getAllTipe = typeRepository.findAll();
        logger.info(String.valueOf(getAllTipe));
        List<Map<String, Object>> itemData = getAllTipe.stream().map(item -> {
            Map<String, Object> empData = new HashMap<>();
            empData.put("id", item.getId());
            empData.put("nama", item.getNama());
            empData.put("varian", item.getVarian());
            empData.put("weight", item.getWeight());
            empData.put("capitalPrice", item.getCapitalprice());
            empData.put("defaultPrice", item.getDefaultprice());
            Timestamp lastUpdateDate = item.getLastupdate();
            if (lastUpdateDate != null) {
                LocalDateTime lastUpdateDateTime = LocalDateTime.ofInstant(lastUpdateDate.toInstant(), ZoneId.systemDefault());
                empData.put("lastupdate", lastUpdateDateTime.format(dateFormatter));
            } else {
                empData.put("lastupdate", null);
            }
            return empData;
        }).collect(Collectors.toList());
        logger.info(String.valueOf(itemData));
        return ResponseEntity.ok(itemData);
    }

    @PostMapping("/tambahTipe")
    public ResponseEntity<?> tambahTipe(@RequestBody TypeModel typeModel){
        // Ambil huruf pertama dari nama
        char firstNameLetter = typeModel.getNama().toUpperCase().charAt(0);
        char firstVariantLetter = typeModel.getVarian().toUpperCase().charAt(0);
        String varcharName = String.valueOf(firstNameLetter);
        String varcharVariant = String.valueOf(firstVariantLetter);
        String tipeKode = varcharName + varcharVariant;
        TypeModel addType = new TypeModel();
        addType.setNama(typeModel.getNama());
        addType.setWeight(typeModel.getWeight());
        addType.setVarian(typeModel.getVarian());
        addType.setCapitalprice(typeModel.getCapitalprice());
        addType.setDefaultprice(typeModel.getDefaultprice());
        addType.setTypecode(tipeKode);
        typeRepository.save(addType);
        logger.info(String.valueOf(addType));
        return ResponseEntity.ok(addType);
    }

    @PostMapping("/editTipe")
    public ResponseEntity<?> editTipe(@RequestBody TypeModel typeModel){
        Optional<TypeModel> optionalTypeModel = typeRepository.findById(typeModel.getId());
        if (optionalTypeModel.isPresent()) {
            TypeModel changeType = optionalTypeModel.get();
            changeType.setNama(typeModel.getNama());
            changeType.setVarian(typeModel.getVarian());
            changeType.setWeight(typeModel.getWeight());
            changeType.setCapitalprice(typeModel.getCapitalprice());
            changeType.setDefaultprice(typeModel.getDefaultprice());
            changeType.setLastupdate(Timestamp.valueOf(LocalDateTime.now()));
            char firstNameLetter = typeModel.getNama().toUpperCase().charAt(0);
            char firstVariantLetter = typeModel.getVarian().toUpperCase().charAt(0);
            String varcharName = String.valueOf(firstNameLetter);
            String varcharVariant = String.valueOf(firstVariantLetter);
            String tipeKode = varcharName + varcharVariant;
            changeType.setTypecode(tipeKode);
            typeRepository.save(changeType);
            return ResponseEntity.ok(changeType);
        } else {
            return ResponseEntity.badRequest().body("Employee not found with ID: " + typeModel.getId());
        }
    }

    @DeleteMapping("/deleteTipe/{id}")
    public ResponseEntity<?> deleteTipe(@PathVariable int id) {
        Optional<TypeModel> optType = typeRepository.findById(id);

        if (optType.isPresent()) {
            typeRepository.deleteById(id);
            return ResponseEntity.ok().body("Type deleted successfully.");
        } else {
            return ResponseEntity.badRequest().body("Type not found with ID: " + id);
        }
    }
}
