package com.LiqueStore.model;

import jakarta.persistence.*;

import java.sql.Timestamp;

@Entity
@Table(name = "employee")
public class EmployeeModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String username;
    private String fullname;
    private int age;
    private String password;
    private int accessrightid;
    private String status;
    private Timestamp firstjoindate;
    private Timestamp lastupdate;

    public EmployeeModel() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public int getAccessrightid() {
        return accessrightid;
    }

    public void setAccessrightid(int accessrightid) {
        this.accessrightid = accessrightid;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Timestamp getFirstjoindate() {
        return firstjoindate;
    }

    public void setFirstjoindate(Timestamp firstjoindate) {
        this.firstjoindate = firstjoindate;
    }

    public Timestamp getLastupdate() {
        return lastupdate;
    }

    public void setLastupdate(Timestamp lastupdate) {
        this.lastupdate = lastupdate;
    }
}
