package com.LiqueStore.model;

import jakarta.persistence.*;

import java.sql.Timestamp;

@Entity
@Table(name = "type")
public class TypeModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String nama;
    private int weight;
    private int capitalprice;
    private int defaultprice;
    private Timestamp lastupdate;
    private String varian;
    private String typecode;

    public TypeModel() {
    }

    public TypeModel(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNama() {
        return nama;
    }

    public void setNama(String nama) {
        this.nama = nama;
    }

    public int getWeight() {
        return weight;
    }

    public void setWeight(int weight) {
        this.weight = weight;
    }

    public int getCapitalprice() {
        return capitalprice;
    }

    public void setCapitalprice(int capitalprice) {
        this.capitalprice = capitalprice;
    }

    public int getDefaultprice() {
        return defaultprice;
    }

    public void setDefaultprice(int defaultprice) {
        this.defaultprice = defaultprice;
    }

    public Timestamp getLastupdate() {
        return lastupdate;
    }

    public void setLastupdate(Timestamp lastupdate) {
        this.lastupdate = lastupdate;
    }

    public String getVarian() {
        return varian;
    }

    public void setVarian(String varian) {
        this.varian = varian;
    }

    public String getTypecode() {
        return typecode;
    }

    public void setTypecode(String typecode) {
        this.typecode = typecode;
    }
}
