package com.LiqueStore.controller;

import com.LiqueStore.model.*;
import com.LiqueStore.repository.*;
import com.LiqueStore.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.midtrans.service.MidtransSnapApi;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@RestController
@RequestMapping
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
        return ResponseEntity.ok(savedTemporaryOrder);
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
}
