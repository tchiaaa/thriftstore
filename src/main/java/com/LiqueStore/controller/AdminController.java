package com.LiqueStore.controller;

import com.LiqueStore.Response;
import com.LiqueStore.model.*;
import com.LiqueStore.repository.*;
import com.LiqueStore.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.midtrans.service.MidtransSnapApi;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
@CrossOrigin
public class AdminController {
    private static final Logger logger = Logger.getLogger(ManagerController.class.getName());
    @Autowired
    private TypeRepository typeRepository;
    @Autowired
    private ItemRepository itemRepository;
    @Autowired
    private OrdersRepository ordersRepository;
    @Autowired
    private OrderColourRepository orderColourRepository;
    @Autowired
    private TemporaryOrderRepository temporaryOrderRepository;
    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping("/daftarTipe")
    public ResponseEntity<?> daftarTipe(){
        List<TypeModel> getAllType = typeRepository.findAll();
        logger.info(String.valueOf(getAllType));
        return ResponseEntity.ok(getAllType);
    }

    @GetMapping("/dataInventori")
    public ResponseEntity<?> dataInventori() {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd MMMM yyyy");
        List<ItemModel> getAllItem = itemRepository.findAll();
        logger.info(String.valueOf(getAllItem));
        List<Map<String, Object>> itemData = getAllItem.stream().map(item -> {
            Map<String, Object> empData = new HashMap<>();
            empData.put("id", item.getId());
            empData.put("nama", item.getName());
            empData.put("jenisBarang", item.getTypeId().getNama());
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
            empData.put("status", item.getStatus());
            return empData;
        }).collect(Collectors.toList());
        logger.info(String.valueOf(itemData));
        return ResponseEntity.ok(itemData);
    }

    @PostMapping(value = "/tambahInventori", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> tambahInventori(@RequestParam("name") String name,
                                             @RequestParam("typeId") int typeId,
                                             @RequestParam("employeeId") int employeeId,
                                             @RequestParam("customWeight") int customWeight,
                                             @RequestParam("customCapitalPrice") int customCapitalPrice,
                                             @RequestParam("customDefaultPrice") int customDefaultPrice,
                                             @RequestParam("size") int size,
                                             @RequestParam("files") List<MultipartFile> files) {
        Optional<TypeModel> optionalTypeModel = typeRepository.findById(typeId);
        String itemCode;
        if (optionalTypeModel.isPresent()) {
            TypeModel getTypeData = optionalTypeModel.get();
            LocalDate currentDate = LocalDate.now();
            // Dapatkan dua digit terakhir dari tahun dan bulan saat ini
            int year = currentDate.getYear();
            String yearString = String.valueOf(year).substring(2); // Mendapatkan dua digit terakhir dari tahun
            String monthString = String.format("%02d", currentDate.getMonthValue()); // Mendapatkan bulan dengan dua digit
            String prefix = getTypeData.getTypecode() + yearString + monthString;
            List<ItemModel> existingTypeCode = itemRepository.findByItemcodeStartingWith(prefix);
            String sequenceString = String.format("%05d", existingTypeCode.size() + 1);
            logger.info(sequenceString);
            itemCode = prefix + sequenceString;
            logger.info(itemCode);
        } else {
            return ResponseEntity.badRequest().body("Employee not found with ID: " + typeId);
        }
        List<String> fileNames = fileStorageService.storeFiles(files);
        ItemModel itemModel = new ItemModel();
        itemModel.setName(name);
        itemModel.setTypeId(new TypeModel(typeId));
        itemModel.setEmployeeId(new EmployeeModel(employeeId));
        itemModel.setItemcode(itemCode);
        itemModel.setCustomweight(customWeight);
        itemModel.setCustomcapitalprice(customCapitalPrice);
        itemModel.setCustomdefaultprice(customDefaultPrice);
        itemModel.setSize(size);
        itemModel.setFiles(fileNames);
        itemModel.setStatus("available");
        ItemModel savedItem = itemRepository.save(itemModel);
        logger.info(String.valueOf(savedItem));
        return ResponseEntity.ok(savedItem);
    }

    @GetMapping("/getColour")
    public ResponseEntity<?> getColour() {
        List<OrderColourModel> getAllColour = orderColourRepository.findAll();
        logger.info(String.valueOf(getAllColour));
        return ResponseEntity.ok(getAllColour);
    }

    @GetMapping("/getItem")
    public ResponseEntity<?> getItem() {
        List<ItemModel> getAllItem = itemRepository.findAll();
        logger.info(String.valueOf(getAllItem));
        return ResponseEntity.ok(getAllItem);
    }

    @PostMapping("/inputTemporaryOrder")
    public ResponseEntity<?> inputTemporaryOrder(@RequestParam("id") int id,
                                         @RequestParam("username") String username,
                                         @RequestParam("phonenumber") String phonenumber,
                                         @RequestParam("itemidall") List<String> itemidall,
                                         @RequestParam("totalweight") int totalweight,
                                         @RequestParam("totalprice") int totalprice,
                                         @RequestParam("waitinglist") List<String> waitinglist,
                                         @RequestParam("colourid") int colourid){
        String ctrId = String.format("%03d", id + 1);
        logger.info(ctrId);
        String hurufDepanWarna = "";
        // Ambil tanggal hari ini
        LocalDate today = LocalDate.now();
        // Format tanggal menjadi YYMMDD
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyMMdd");
        String formattedDate = today.format(formatter);
        Optional<OrderColourModel> optionalOrderColourModel = orderColourRepository.findById(colourid);
        if (optionalOrderColourModel.isPresent()){
            OrderColourModel orderColourModel = optionalOrderColourModel.get();
            hurufDepanWarna = orderColourModel.getColourcode();
        }
        String orderid = hurufDepanWarna + ctrId + formattedDate;
        TemporaryOrderModel addTemporaryOrder = new TemporaryOrderModel();
        addTemporaryOrder.setColourid(new OrderColourModel(colourid));
        addTemporaryOrder.setOrderid(orderid);
        addTemporaryOrder.setUsername(username);
        addTemporaryOrder.setPhonenumber(phonenumber);
        addTemporaryOrder.setTotalprice(totalprice);
        addTemporaryOrder.setTotalweight(totalweight);
        addTemporaryOrder.setWaitinglist(waitinglist);
        addTemporaryOrder.setItemidall(itemidall);
        TemporaryOrderModel savedTemporaryOrder = temporaryOrderRepository.save(addTemporaryOrder);
        logger.info(String.valueOf(savedTemporaryOrder));

        OrdersModel addOrder = new OrdersModel();
        addOrder.setId(orderid);
        addOrder.setItemidall(itemidall);
        addOrder.setUsername(username);
        addOrder.setPhonenumber(phonenumber);
        addOrder.setTotalprice(totalprice);
        LocalDateTime now = LocalDateTime.now();
        Timestamp timestamp = Timestamp.valueOf(now);
        addOrder.setCheckoutdate(timestamp);
        addOrder.setStatus("Payment Not Done");
        OrdersModel saveOrder = ordersRepository.save(addOrder);
        return ResponseEntity.ok(new Response("hasil temporary order: " + savedTemporaryOrder + "hasil order: " + saveOrder));
    }

    @PostMapping("/tambahWarna")
    public ResponseEntity<?> tambahWarna(@RequestBody OrderColourModel orderColourModel) {
        char firstLetter = orderColourModel.getName().toUpperCase().charAt(0);
        String varcharName = String.valueOf(firstLetter);
        OrderColourModel addColour = new OrderColourModel();
        addColour.setName(orderColourModel.getName());
        addColour.setColourcode(varcharName);
        orderColourRepository.save(addColour);
        logger.info(String.valueOf(addColour));
        return ResponseEntity.ok(addColour);
    }

    @GetMapping("/dataOrder")
    public ResponseEntity<?> dataOrder(){
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd MMMM yyyy");
        List<OrdersModel> getAllOrders = ordersRepository.findAll();
        List<ItemModel> getAllItem = itemRepository.findAll();
        // Create a map of item codes to item names
        Map<String, String> itemCodeToNameMap = getAllItem.stream()
                .collect(Collectors.toMap(ItemModel::getItemcode, ItemModel::getName));
        List<Map<String, Object>> orderData = getAllOrders.stream().map(orders -> {
            Map<String, Object> empData = new HashMap<>();
            empData.put("orderid", orders.getId());
            String itemName = orders.getItemidall().stream()
                    .map(itemCodeToNameMap::get)
                    .filter(Objects::nonNull)
                    .findFirst()
                    .orElse("Unknown Item");
            empData.put("namabarang", itemName);
            empData.put("namacust", orders.getUsername());
            Timestamp checkoutdate = orders.getCheckoutdate();
            LocalDateTime firstJoinDateTime = LocalDateTime.ofInstant(checkoutdate.toInstant(), ZoneId.systemDefault());
            logger.info(String.valueOf(firstJoinDateTime));
            empData.put("checkoutdate", firstJoinDateTime.format(dateFormatter));
            empData.put("packingdate", orders.getPackingdate());
            empData.put("deliverydate", orders.getDeliverypickupdate());
            return empData;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(orderData);
    }

    @PostMapping("/updatePackingdate")
    public ResponseEntity<?> updatePackingdate(@RequestParam(name = "rowId") String id) {
        Optional<OrdersModel> optionalOrdersModel = ordersRepository.findById(id);
        logger.info(String.valueOf(optionalOrdersModel));
        if (optionalOrdersModel.isPresent()) {
            OrdersModel getSelectedOrder = optionalOrdersModel.get();
            LocalDateTime now = LocalDateTime.now();
            Timestamp timestamp = Timestamp.valueOf(now);
            getSelectedOrder.setPackingdate(timestamp);
            ordersRepository.save(getSelectedOrder);
            return ResponseEntity.ok(getSelectedOrder);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/updateDeliverydate")
    public ResponseEntity<?> updateDeliverydate(@RequestParam(name = "rowId") String id) {
        Optional<OrdersModel> optionalOrdersModel = ordersRepository.findById(id);
        logger.info(String.valueOf(optionalOrdersModel));
        if (optionalOrdersModel.isPresent()) {
            OrdersModel getSelectedOrder = optionalOrdersModel.get();
            LocalDateTime now = LocalDateTime.now();
            Timestamp timestamp = Timestamp.valueOf(now);
            getSelectedOrder.setDeliverypickupdate(timestamp);
            ordersRepository.save(getSelectedOrder);
            return ResponseEntity.ok(getSelectedOrder);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/getAllOrders")
    public ResponseEntity<?> getAllOrders() {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd MMMM yyyy HH:mm");
        List<OrdersModel> getAllOrders = ordersRepository.findAll();
        List<ItemModel> getAllItem = itemRepository.findAll();
        // Create a map of item codes to item names
        Map<String, String> itemCodeToNameMap = getAllItem.stream()
                .collect(Collectors.toMap(ItemModel::getItemcode, ItemModel::getName));
        List<Map<String, Object>> orderData = getAllOrders.stream().map(orders -> {
            Map<String, Object> empData = new HashMap<>();
            empData.put("orderid", orders.getId());
            String[] itemDetails = orders.getItemidall().stream()
                    .map(itemCode -> {
                        ItemModel item = getAllItem.stream()
                                .filter(i -> i.getItemcode().equals(itemCode))
                                .findFirst()
                                .orElse(null);
                        if (item == null) {
                            return new String[]{"Unknown Item", "Unknown Type"};
                        }
                        Optional<TypeModel> getSelectedType = typeRepository.findById(item.getTypeId().getId());
                        String typeName = "";
                        if (getSelectedType.isPresent()){
                            TypeModel typeModel = getSelectedType.get();
                            typeName = typeModel.getNama();
                        }
                        String itemName = itemCodeToNameMap.getOrDefault(itemCode, "Unknown Item");
                        return new String[]{itemName, typeName};
                    })
                    .findFirst()
                    .orElse(new String[]{"Unknown Item", "Unknown Type"});
            empData.put("namabarang", itemDetails[0]);
            empData.put("jenisbarang", itemDetails[1]);
            empData.put("namapembeli", orders.getUsername());
            Timestamp checkoutdate = orders.getCheckoutdate();
            LocalDateTime checkoutDateTime = LocalDateTime.ofInstant(checkoutdate.toInstant(), ZoneId.systemDefault());
            Timestamp paymentdate = orders.getCheckoutdate();
            LocalDateTime paymentDateTime = LocalDateTime.ofInstant(paymentdate.toInstant(), ZoneId.systemDefault());
            Timestamp packingdate = orders.getCheckoutdate();
            LocalDateTime packingDateTime = LocalDateTime.ofInstant(packingdate.toInstant(), ZoneId.systemDefault());
            Timestamp deliverypickupdate = orders.getCheckoutdate();
            LocalDateTime deliverypickupDateTime = LocalDateTime.ofInstant(deliverypickupdate.toInstant(), ZoneId.systemDefault());
            Timestamp deliverydonedate = orders.getCheckoutdate();
            LocalDateTime deliverydoneDateTime = LocalDateTime.ofInstant(deliverydonedate.toInstant(), ZoneId.systemDefault());
            empData.put("checkoutdate", checkoutDateTime.format(dateFormatter));
            empData.put("paymentdate", paymentDateTime.format(dateFormatter));
            empData.put("packingdate", packingDateTime.format(dateFormatter));
            empData.put("deliverypickupdate", deliverypickupDateTime.format(dateFormatter));
            empData.put("deliverydonedate", deliverydoneDateTime.format(dateFormatter));
            empData.put("status", orders.getStatus());
            return empData;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(orderData);
    }
}
