package com.LiqueStore.model;

import jakarta.persistence.*;

import java.sql.Timestamp;

@Entity
@Table(name = "payment")
public class PermissionModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String name;
    private int accessrightid;
    private Timestamp lastupdate;

    public PermissionModel() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAccessrightid() {
        return accessrightid;
    }

    public void setAccessrightid(int accessrightid) {
        this.accessrightid = accessrightid;
    }

    public Timestamp getLastupdate() {
        return lastupdate;
    }

    public void setLastupdate(Timestamp lastupdate) {
        this.lastupdate = lastupdate;
    }
}
