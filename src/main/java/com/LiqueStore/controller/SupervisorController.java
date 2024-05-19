package com.LiqueStore.controller;

import com.LiqueStore.Response;
import com.LiqueStore.model.AbsensiModel;
import com.LiqueStore.model.AccessRightModel;
import com.LiqueStore.model.EmployeeModel;
import com.LiqueStore.repository.AbsensiRepository;
import com.LiqueStore.repository.AccessRightRepository;
import com.LiqueStore.repository.EmployeeRepository;
import com.LiqueStore.service.LoginService;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.*;
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
    private static final Logger logger = Logger.getLogger(SupervisorController.class.getName());
    boolean cekPasscode = false;
    boolean cekDataEmployee = false;
    String tempUsername;
    int tempId;
    boolean cekTanggal = false;
    int idxAbsensi = 0;
    int idxOldEmployee = 0;

    @Autowired
    private LoginService loginService;
    @Autowired
    private EmployeeRepository employeeRepository;
    @Autowired
    private AbsensiRepository absensiRepository;
    @Autowired
    private AccessRightRepository accessRightRepository;
//    @Autowired
//    private PasswordEncoder passwordEncoder;

    @PostMapping("/passcode")
    public ResponseEntity<?> tambahAbsensi(@RequestBody String passcode) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(passcode);
        String extractedPasscode = jsonNode.get("passcode").asText();
        logger.info(extractedPasscode);
        List<EmployeeModel> getPasscode = loginService.getEmployeesByAccessRightId(1);
        for (EmployeeModel employeeModel : getPasscode) {
            String nomorwa = employeeModel.getPhonenumber();
            String lastFourDigits = nomorwa.substring(nomorwa.length() - 4);
            logger.info(lastFourDigits);
            if (lastFourDigits.equals(extractedPasscode)) {
                logger.info("masuk");
                cekPasscode = true;
                tempUsername = employeeModel.getUsername();
                tempId = employeeModel.getId();
            }
        }
        if (cekPasscode){
            List<EmployeeModel> getEmployee = loginService.getUsersByUsername(tempUsername);
            List<AbsensiModel> getAbsensi = absensiRepository.getAbsensiByEmployeeid(tempId);
            logger.info(String.valueOf(tempId));
            logger.info(String.valueOf(getAbsensi));
            if (!getAbsensi.isEmpty()){
                for (int i = 0; i < getAbsensi.size(); i++) {
                    if (getAbsensi.get(i).getTodaydate().equals(Date.valueOf(LocalDate.now()))){
                        cekTanggal = true;
                        idxAbsensi = i;
                    }
                }
                if (cekTanggal){
                    getAbsensi.get(idxAbsensi).setClockout(Timestamp.valueOf(LocalDateTime.now()));
                    Timestamp temp = getAbsensi.get(idxAbsensi).getClockout();
                    logger.info(String.valueOf(temp));
                    absensiRepository.save(getAbsensi.get(idxAbsensi));

                    return ResponseEntity.ok(new Response("Berhasil Clock Out, " + tempUsername));
//                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Response(tempUsername + " Sudah Melakukan ClockIn"));
                }
                else{
                    AbsensiModel absensi = new AbsensiModel();
                    absensi.setEmployeeid(getEmployee.get(0).getId());
                    absensi.setUsername(getEmployee.get(0).getUsername());
                    absensi.setPassword(getEmployee.get(0).getPassword());
                    absensi.setClockin(Timestamp.valueOf(LocalDateTime.now()));
                    absensi.setTodaydate(Date.valueOf(LocalDate.now()));
                    absensiRepository.save(absensi);
                }
            }
            else{
                logger.info("bikin baru");
                AbsensiModel absensi = new AbsensiModel();
                absensi.setEmployeeid(getEmployee.get(0).getId());
                absensi.setUsername(getEmployee.get(0).getUsername());
                absensi.setPassword(getEmployee.get(0).getPassword());
                absensi.setClockin(Timestamp.valueOf(LocalDateTime.now()));
                absensi.setTodaydate(Date.valueOf(LocalDate.now()));
                absensiRepository.save(absensi);
            }
            return ResponseEntity.ok(new Response("Berhasil Clock In, " + tempUsername));
        }
        else{
            logger.info(String.valueOf(Date.valueOf(LocalDate.now())));
            logger.info("admin tidak ditermukan");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Response("Passcode Salah"));
        }
    }

    @GetMapping("/dataKaryawan")
    public ResponseEntity<?> getAllEmployees(){
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd MMMM yyyy");
        List<EmployeeModel> getAdminOnly = loginService.getEmployeesByAccessRightId(1);
        logger.info(String.valueOf(getAdminOnly));
        List<Map<String, Object>> employeeData = getAdminOnly.stream().map(employee -> {
            Map<String, Object> empData = new HashMap<>();
            empData.put("id", employee.getId());
            empData.put("username", employee.getUsername());
            empData.put("fullname", employee.getFullname());
            empData.put("email", employee.getEmail());
            LocalDate birthDate = employee.getBirthdate().toLocalDate();
            empData.put("tanggallahir", birthDate.format(dateFormatter));
            logger.info(String.valueOf(birthDate));
            LocalDate currentDate = LocalDate.now();
            empData.put("umur", Period.between(birthDate, currentDate).getYears());
            empData.put("nomorwa", employee.getPhonenumber());
            empData.put("status", employee.getStatus());
            Timestamp firstJoinDate = employee.getFirstjoindate();
            LocalDateTime firstJoinDateTime = LocalDateTime.ofInstant(firstJoinDate.toInstant(), ZoneId.systemDefault());
            logger.info(String.valueOf(firstJoinDateTime));
            empData.put("firstjoindate", firstJoinDateTime.format(dateFormatter));
            Timestamp lastUpdateDate = employee.getLastupdate();
            if (lastUpdateDate != null) {
                LocalDateTime lastUpdateDateTime = LocalDateTime.ofInstant(lastUpdateDate.toInstant(), ZoneId.systemDefault());
                empData.put("lastupdate", lastUpdateDateTime.format(dateFormatter));
            } else {
                empData.put("lastupdate", null); // or some default value
            }
            empData.put("jabatan", employee.getAccessRight().getPosition());
            return empData;
        }).collect(Collectors.toList());
        logger.info(String.valueOf(employeeData));
        return ResponseEntity.ok(employeeData);
    }

    @PostMapping("/tambahKaryawan")
    public ResponseEntity<?> tambahKaryawan(@RequestBody EmployeeModel employeeModel){
        logger.info("Received Employee Model: " + employeeModel.getAccessRight().getId());
//        String hashedPassword = passwordEncoder.encode(employeeModel.getPassword());
        Optional<AccessRightModel> accessRight = accessRightRepository.findById(employeeModel.getAccessRight().getId());
        if (accessRight.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid Access Right ID");
        }
        EmployeeModel addEmployee = new EmployeeModel();
        addEmployee.setFullname(employeeModel.getFullname());
        addEmployee.setAccessRight(accessRight.get());
        addEmployee.setBirthdate(employeeModel.getBirthdate());
        addEmployee.setPhonenumber(employeeModel.getPhonenumber());
        addEmployee.setEmail(employeeModel.getEmail());
        addEmployee.setUsername(employeeModel.getUsername());
        addEmployee.setFirstjoindate(employeeModel.getFirstjoindate());
        addEmployee.setJam_masuk(employeeModel.getJam_masuk());
        addEmployee.setJadwal_libur(employeeModel.getJadwal_libur());
        addEmployee.setStatus("bekerja");
        addEmployee.setPassword("123");
        employeeRepository.save(addEmployee);
        logger.info(String.valueOf(addEmployee));
        return ResponseEntity.ok(addEmployee);
    }

    @PostMapping("/editKaryawan")
    public ResponseEntity<?> editKaryawan(@RequestBody EmployeeModel employeeModel){
        logger.info("Data lama: " + employeeModel);
//        String hashedPassword = passwordEncoder.encode(employeeModel.getPassword());
        Optional<AccessRightModel> accessRight = accessRightRepository.findById(1);
        if (!accessRight.isPresent()) {
            return ResponseEntity.badRequest().body("Invalid Access Right ID");
        }
        List<EmployeeModel> oldEmployee = employeeRepository.findAll();
        for (int i = 0; i < oldEmployee.size(); i++) {
            if (oldEmployee.get(i).getId() == employeeModel.getId()){
                cekDataEmployee = true;
                idxOldEmployee = i;
            }
        }
        if (cekDataEmployee){
            oldEmployee.get(idxOldEmployee).setUsername(employeeModel.getUsername());
            oldEmployee.get(idxOldEmployee).setFullname(employeeModel.getFullname());
            oldEmployee.get(idxOldEmployee).setEmail(employeeModel.getEmail());
            oldEmployee.get(idxOldEmployee).setPassword(employeeModel.getPassword());
            oldEmployee.get(idxOldEmployee).setPhonenumber(employeeModel.getPhonenumber());
            oldEmployee.get(idxOldEmployee).setAccessRight(accessRight.get());
            oldEmployee.get(idxOldEmployee).setLastupdate(Timestamp.valueOf(LocalDateTime.now()));
            oldEmployee.get(idxOldEmployee).setStatus("aktif");
            employeeRepository.save(oldEmployee.get(idxOldEmployee));
            logger.info(String.valueOf(oldEmployee.get(idxOldEmployee)));
        }
        return ResponseEntity.ok(oldEmployee.get(idxOldEmployee));
    }

    @GetMapping("/daftarSelectKaryawan")
    public ResponseEntity<?> daftarSelectKaryawan(){
        List<EmployeeModel> listKaryawan = loginService.getEmployeesByAccessRightId(1);
        return ResponseEntity.ok(listKaryawan);
//
    }

    @GetMapping("/pilihKaryawan")
    public ResponseEntity<?> pilihKaryawan(@RequestParam(name = "idAbsensi") String idAbsensi){
        logger.info(idAbsensi);
        SimpleDateFormat clockFormat = new SimpleDateFormat("HH:mm");
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");
        List<AbsensiModel> pilihKaryawan = absensiRepository.getAbsensiByEmployeeid(Integer.parseInt(idAbsensi));
        if (pilihKaryawan == null){
            return ResponseEntity.ok(new Response("Data Karyawan null"));
        }
        else{
            logger.info(String.valueOf(pilihKaryawan));
            List<Map<String, Object>> employeeData = pilihKaryawan.stream().map(absensi -> {
                Map<String, Object> empData = new HashMap<>();
                empData.put("id", absensi.getId());
                empData.put("username", absensi.getUsername());
                empData.put("tanggal", dateFormat.format(absensi.getTodaydate()));
                if (absensi.getClockin() != null) {
                    empData.put("clockIn", clockFormat.format(absensi.getClockin()));
                }
                else {
                    empData.put("clockIn", "");
                }
                if (absensi.getClockout() != null) {
                    empData.put("clockOut", clockFormat.format(absensi.getClockout()));
                }
                else {
                    empData.put("clockOut", "");
                }
                return empData;
            }).collect(Collectors.toList());
            return ResponseEntity.ok(employeeData);
        }
    }
}
