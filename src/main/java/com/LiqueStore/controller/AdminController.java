package com.LiqueStore.controller;

import com.LiqueStore.model.*;
import com.LiqueStore.repository.*;
import com.LiqueStore.service.FileStorageService;
import com.LiqueStore.service.MidtransService;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
@CrossOrigin
public class AdminController {
    private static final Logger logger = Logger.getLogger(AdminController.class.getName());
    private static final org.slf4j.Logger log = LoggerFactory.getLogger(AdminController.class);
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
    @Autowired
    private MidtransService midtransService;

    @GetMapping("/daftarTipe")
    public ResponseEntity<?> daftarTipe(){
        List<TypeModel> getAllType = typeRepository.findAll();
        logger.info(String.valueOf(getAllType));
        return ResponseEntity.ok(getAllType);
    }

    @GetMapping("/dataInventori")
    public ResponseEntity<?> dataInventori() {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        List<ItemModel> getAllItem = itemRepository.findAll();
        logger.info(String.valueOf(getAllItem));
        List<Map<String, Object>> itemData = getAllItem.stream().map(item -> {
            Map<String, Object> empData = new HashMap<>();
            empData.put("id", item.getId());
            empData.put("itemcode", item.getItemcode());
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

    @GetMapping("/dataTipe")
    public ResponseEntity<?> dataTipe() {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        List<TypeModel> getAllTipe = typeRepository.findAll();
        logger.info(String.valueOf(getAllTipe));
        List<Map<String, Object>> itemData = getAllTipe.stream().map(item -> {
            Map<String, Object> empData = new HashMap<>();
            empData.put("id", item.getId());
            empData.put("nama", item.getNama());
            empData.put("varian", item.getVarian());
            empData.put("typecode", item.getTypecode());
            empData.put("weight", item.getWeight());
            Timestamp lastUpdateDate = item.getLastupdate();
            if (lastUpdateDate != null) {
                LocalDateTime lastUpdateDateTime = LocalDateTime.ofInstant(lastUpdateDate.toInstant(), ZoneId.systemDefault());
                logger.info(String.valueOf(lastUpdateDateTime.toLocalDate()));
                empData.put("lastupdate", lastUpdateDateTime.format(dateFormatter));
            } else {
                empData.put("lastupdate", "-");
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

    @GetMapping("/getColourOrder/{id}")
    public ResponseEntity<?> getColourOrder(@PathVariable int id){
        Optional<OrderColourModel> optionalOrderColourModel = orderColourRepository.findById(id);
        if (optionalOrderColourModel.isPresent()){
            OrderColourModel orderColourModel = optionalOrderColourModel.get();
            String firstChar = orderColourModel.getColourcode();
            return ResponseEntity.ok(orderColourModel);
        }
        else{
            return ResponseEntity.badRequest().body("Colour not found with ID: " + id);

        }
    }

    @PostMapping("/tambahTemporaryOrder")
    public ResponseEntity<?> tambahTemporaryOrder(@RequestParam("colourcode") String colourcode,
                                                  @RequestParam("orderid") int orderid,
                                                  @RequestParam("phonenumber") String phonenumber,
                                                  @RequestParam("totalprice") int totalprice,
                                                  @RequestParam("typecode") String typecode){
        String ctrId = String.format("%03d", orderid);
        List<TemporaryOrderModel> listTemporaryOrder = temporaryOrderRepository.findAll();
        logger.info(listTemporaryOrder.toString());
        OrderColourModel orderColourModel = orderColourRepository.findByColourcode(colourcode);
        TypeModel typeModel = typeRepository.findByTypecode(typecode);
        String tempOrderid = "";
        LocalDate today = LocalDate.now();
        // Format tanggal menjadi YYMMDD
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyMMdd");
        String formattedDate = today.format(formatter);
        if (listTemporaryOrder.isEmpty()){
            logger.info("temporary order masih kosong");
            TemporaryOrderModel addTemporaryOrder = new TemporaryOrderModel();
            tempOrderid = colourcode + ctrId + formattedDate;
            addTemporaryOrder.setOrderid(tempOrderid);
            addTemporaryOrder.setColourid(new OrderColourModel(orderColourModel.getId()));
            addTemporaryOrder.setPhonenumber(phonenumber);
            addTemporaryOrder.setTotalprice(totalprice);
            addTemporaryOrder.setTotalweight(typeModel.getWeight());
            addTemporaryOrder.setStatus("Payment Not Done");
            addTemporaryOrder.setCheckoutdate(Timestamp.valueOf(LocalDateTime.now()));
            addTemporaryOrder.setMasterorderid(tempOrderid);
            TemporaryOrderModel savedTempOrder = temporaryOrderRepository.save(addTemporaryOrder);
            return ResponseEntity.ok(savedTempOrder);
        }
        else{
            boolean cekNomor = listTemporaryOrder.stream()
                    .map(order -> order.getOrderid().substring(1, 4))
                    .anyMatch(getNomor -> Integer.parseInt(getNomor) == orderid);
            boolean cekTemporderData = listTemporaryOrder.stream()
                    .anyMatch(order -> order.getColourid().getColourcode().equals(colourcode) &&
                            order.getOrderid().substring(4, 10).equals(formattedDate));
            if (cekTemporderData && cekNomor) {
                logger.info("kodenya sama buk");
                return ResponseEntity.badRequest().body("Kode pemesanan sudah digunakan");
            }
            Optional<TemporaryOrderModel> lowestOrderIdOrder = listTemporaryOrder.stream()
                    .filter(order -> order.getPhonenumber().equals(phonenumber))
                    .min(Comparator.comparingInt(order -> Integer.parseInt(order.getOrderid().substring(1, 4))));
            tempOrderid = colourcode + ctrId + formattedDate;
            TemporaryOrderModel addTemporaryOrder = new TemporaryOrderModel();
            addTemporaryOrder.setOrderid(tempOrderid);
            addTemporaryOrder.setColourid(new OrderColourModel(orderColourModel.getId()));
            addTemporaryOrder.setPhonenumber(phonenumber);
            addTemporaryOrder.setTotalprice(totalprice);
            addTemporaryOrder.setTotalweight(typeModel.getWeight());
            addTemporaryOrder.setStatus("Payment Not Done");
            addTemporaryOrder.setCheckoutdate(Timestamp.valueOf(LocalDateTime.now()));
            if (lowestOrderIdOrder.isPresent()){
                TemporaryOrderModel temporaryOrderModel = lowestOrderIdOrder.get();
                addTemporaryOrder.setMasterorderid(temporaryOrderModel.getMasterorderid());
            }
            else{
                addTemporaryOrder.setMasterorderid(tempOrderid);
            }
            TemporaryOrderModel savedTempOrder = temporaryOrderRepository.save(addTemporaryOrder);
            return ResponseEntity.ok(savedTempOrder);
        }
    }

    @PostMapping("/simpanCheckoutLink/{orderid}")
    public ResponseEntity<?> simpanCheckoutLink(@PathVariable String orderid){
        TemporaryOrderModel temporaryOrderModel = temporaryOrderRepository.findByOrderid(orderid);
        temporaryOrderModel.setLink("http://localhost:3000/login?orderid=" + temporaryOrderModel.getOrderid());
        String link = "http://localhost:3000/login?orderid=" + temporaryOrderModel.getOrderid();
        logger.info(link);
        temporaryOrderRepository.save(temporaryOrderModel);
        return ResponseEntity.ok(temporaryOrderModel);
    }

    @GetMapping("/getSelectedColour/{id}")
    public ResponseEntity<?> getSelectedColour(@PathVariable int id){
        Optional<OrderColourModel> optionalOrderColourModel = orderColourRepository.findById(id);
        List<Map<String, Object>> matchedOrders = new ArrayList<>();
        if (optionalOrderColourModel.isPresent()){
            OrderColourModel orderColourModel = optionalOrderColourModel.get();
            List<TemporaryOrderModel> temporaryOrderModel = temporaryOrderRepository.findAll();
            for (TemporaryOrderModel tempOrder : temporaryOrderModel) {
                String firstChar = tempOrder.getOrderid().substring(0, 1);
                String substringOrderId = tempOrder.getOrderid().substring(1, 4);
                if (substringOrderId.startsWith("00")) {
                    substringOrderId = substringOrderId.substring(2); // Menghapus angka '0' di depan jika ada
                } else if (substringOrderId.startsWith("0")) {
                    substringOrderId = substringOrderId.substring(1); // Menghapus angka '0' di depan jika ada
                }
                if (firstChar.equals(orderColourModel.getColourcode())) {
                    Map<String, Object> orderMap = new HashMap<>();
                    orderMap.put("colourid", tempOrder.getColourid());
                    orderMap.put("id", tempOrder.getId());
                    orderMap.put("itemidall", tempOrder.getItemidall());
                    orderMap.put("orderid", tempOrder.getOrderid());
                    orderMap.put("phonenumber", tempOrder.getPhonenumber());
                    orderMap.put("totalprice", tempOrder.getTotalprice());
                    orderMap.put("totalweight", tempOrder.getTotalweight());
                    orderMap.put("username", tempOrder.getUsername());
                    orderMap.put("waitinglist", tempOrder.getWaitinglist());
                    orderMap.put("kodepemesanan", substringOrderId);
                    orderMap.put("link", tempOrder.getLink());
                    orderMap.put("status", tempOrder.getStatus());
                    orderMap.put("masterorderid", tempOrder.getMasterorderid());
                    matchedOrders.add(orderMap);
                }
            }
            if (!matchedOrders.isEmpty()) {
                return ResponseEntity.ok(matchedOrders);
            } else {
                return ResponseEntity.badRequest().body("Tidak ditemukan kecocokan warna");
            }
        }
        else {
            return ResponseEntity.badRequest().body("Employee not found with ID: " + id);
        }
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
        Optional<TemporaryOrderModel> temporaryOrderModel = temporaryOrderRepository.findById(id);
        if (temporaryOrderModel.isPresent()){
            TemporaryOrderModel updateTemporaryOrder = temporaryOrderModel.get();
            updateTemporaryOrder.setUsername(username);
            updateTemporaryOrder.setPhonenumber(phonenumber);
            updateTemporaryOrder.setItemidall(itemidall);
            updateTemporaryOrder.setTotalprice(totalprice);
            updateTemporaryOrder.setTotalweight(totalweight);
            updateTemporaryOrder.setWaitinglist(waitinglist);
            TemporaryOrderModel savedTemporaryOrder = temporaryOrderRepository.save(updateTemporaryOrder);
            return ResponseEntity.ok(savedTemporaryOrder);
        }
        else{
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
            return ResponseEntity.ok(savedTemporaryOrder);
        }
    }

    @PostMapping("/inputOrder")
    public ResponseEntity<?> inputOrder(@RequestBody List<TemporaryOrderModel> orderData){
        log.info("Received order data: {}", orderData);
        // Filter data to remove entries with null username
        List<TemporaryOrderModel> filteredOrderData = orderData.stream()
                .filter(order -> order.getUsername() != null)
                .toList();
        if (filteredOrderData.isEmpty()) {
            log.warn("No valid orders to process");
        }
        // Ambil informasi tambahan dari tabel TemporaryOrderModel berdasarkan orderid
        List<String> orderIds = filteredOrderData.stream()
                .map(TemporaryOrderModel::getOrderid)
                .toList();
        List<TemporaryOrderModel> temporaryOrders = temporaryOrderRepository.findAllByOrderidIn(orderIds);
        Map<String, TemporaryOrderModel> tempOrderMap = temporaryOrders.stream()
                .collect(Collectors.toMap(TemporaryOrderModel::getOrderid, order -> order));
        Map<String, List<TemporaryOrderModel>> groupedByUsername = filteredOrderData.stream()
                .collect(Collectors.groupingBy(TemporaryOrderModel::getUsername));
        log.info("Grouped order data by username: {}", groupedByUsername);
        List<OrdersModel> ordersToInsert = new ArrayList<>();
        for (Map.Entry<String, List<TemporaryOrderModel>> entry : groupedByUsername.entrySet()) {
            String username = entry.getKey();
            List<TemporaryOrderModel> userOrders = entry.getValue();
            log.info("Processing orders for user: {}", username);
            boolean allPaid = userOrders.stream().allMatch(order -> "On Packing".equals(order.getStatus()));
            if (allPaid) {
                log.info("All orders for user {} are paid", username);
                userOrders.forEach(order -> {
                    order.setIsactive(false);
                    temporaryOrderRepository.save(order);
                });
                TemporaryOrderModel minOrder = userOrders.stream()
                        .min(Comparator.comparingInt(order -> Integer.parseInt(order.getOrderid().substring(1, 4))))
                        .orElse(null);
                if (minOrder != null) {
                    TemporaryOrderModel fullOrderInfo = tempOrderMap.get(minOrder.getOrderid());
                    OrdersModel addOrders = new OrdersModel();
                    addOrders.setId(fullOrderInfo.getOrderid());
                    addOrders.setStatus(fullOrderInfo.getStatus());
                    addOrders.setUsername(fullOrderInfo.getUsername());
                    addOrders.setPhonenumber(fullOrderInfo.getPhonenumber());
                    addOrders.setCheckoutdate(fullOrderInfo.getCheckoutdate());
                    addOrders.setPaymentdate(fullOrderInfo.getPaymentdate());
                    ordersToInsert.add(addOrders);
                    log.info("Order for user {} added: {}", username, addOrders);
                }
            }
        }
        if (!ordersToInsert.isEmpty()) {
            ordersRepository.saveAll(ordersToInsert);
            log.info("Orders saved successfully");
            return ResponseEntity.ok("Orders have been submitted successfully");
        } else {
            log.warn("No orders to submit");
            return ResponseEntity.badRequest().body("No orders to submit");
        }
    }

    @PostMapping("/checkUpdateTransaction")
    public ResponseEntity<?> checkUpdateTransaction(@RequestBody List<TemporaryOrderModel> temporaryOrderModels){
        logger.info("masuk transaksinya");
        List<String> failedOrders = new ArrayList<>();

        for (TemporaryOrderModel order : temporaryOrderModels) {
            try {
                logger.info(order.getMasterorderid());
                midtransService.checkAndUpdateOrderStatus(order.getMasterorderid());
            } catch (Exception e) {
                failedOrders.add(order.getOrderid());
                logger.info(e.getMessage());
            }
        }

        if (failedOrders.isEmpty()) {
            return ResponseEntity.ok("berhasil update status");
        } else {
            return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                    .body("Gagal update status untuk order: " + String.join(", ", failedOrders));
        }
    }

    @PostMapping("/deleteTemporaryOrder")
    public ResponseEntity<?> deleteTemporaryOrder(@RequestBody List<TemporaryOrderModel> orderData){
        logger.info(String.valueOf(orderData));
        if (orderData.isEmpty()){
            logger.info("Tidak ada data");
            return ResponseEntity.badRequest().body("Order Data tidak ada");
        }
        else{
            try {
                for (TemporaryOrderModel order : orderData) {
                    order.setIsactive(false);
                    temporaryOrderRepository.save(order);
                }
                return ResponseEntity.ok("Berhasil clear temporary order");
            } catch (Exception e) {
                logger.info("Gagal menghapus temporary order");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Gagal menghapus temporary order");
            }
        }
    }

    @PostMapping("/tambahWarna")
    public ResponseEntity<?> tambahWarna(@RequestBody OrderColourModel orderColourModel) {
        char firstLetter = orderColourModel.getName().toUpperCase().charAt(0);
        String varcharName = String.valueOf(firstLetter);
        OrderColourModel addColour = new OrderColourModel();
        addColour.setName(orderColourModel.getName());
        addColour.setColourcode(varcharName);
        addColour.setColourhex(orderColourModel.getColourhex());
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
        List<Map<String, Object>> orderData = getAllOrders.stream()
            .filter(order -> order.getPaymentdate() != null)
            .map(orders -> {
                Map<String, Object> empData = new HashMap<>();
                empData.put("id", orders.getId());
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
                empData.put("deliverypickupdate", orders.getDeliverypickupdate());
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
            getSelectedOrder.setStatus("On Pick Up");
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
            getSelectedOrder.setStatus("On Delivery");
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
            if (checkoutdate != null) {
                LocalDateTime checkoutDateTime = LocalDateTime.ofInstant(checkoutdate.toInstant(), ZoneId.systemDefault());
                empData.put("checkoutdate", checkoutDateTime.format(dateFormatter));
            }
            Timestamp paymentdate = orders.getPaymentdate();
            if (paymentdate != null) {
                LocalDateTime paymentDateTime = LocalDateTime.ofInstant(paymentdate.toInstant(), ZoneId.systemDefault());
                empData.put("paymentdate", paymentDateTime.format(dateFormatter));
            }
            Timestamp packingdate = orders.getPackingdate();
            if (packingdate != null) {
                LocalDateTime packingDateTime = LocalDateTime.ofInstant(packingdate.toInstant(), ZoneId.systemDefault());
                empData.put("packingdate", packingDateTime.format(dateFormatter));
            }
            Timestamp deliverypickupdate = orders.getDeliverypickupdate();
            if (deliverypickupdate != null) {
                LocalDateTime deliverypickupDateTime = LocalDateTime.ofInstant(deliverypickupdate.toInstant(), ZoneId.systemDefault());
                empData.put("deliverypickupdate", deliverypickupDateTime.format(dateFormatter));
            }
            Timestamp deliverydonedate = orders.getDeliverydonedate();
            if (deliverydonedate != null) {
                LocalDateTime deliverydoneDateTime = LocalDateTime.ofInstant(deliverydonedate.toInstant(), ZoneId.systemDefault());
                empData.put("deliverydonedate", deliverydoneDateTime.format(dateFormatter));
            }
            empData.put("status", orders.getStatus());
            return empData;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(orderData);
    }
}
