package com.LiqueStore.model;

import jakarta.persistence.*;

import java.sql.Timestamp;

@Entity
@Table(name = "orders")
public class OrdersModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private int itemid;
    private String namapembeli;
    private int nomorwa;
    private String usernamepembeli;
    private int price;
    private int paymentid;
    private Timestamp checkoutdate;
    private Timestamp paymentdate;
    private Timestamp packingdate;
    private Timestamp deliverypickupdate;
    private Timestamp deliverydonedate;
    private String status;

    public OrdersModel() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getItemid() {
        return itemid;
    }

    public void setItemid(int itemid) {
        this.itemid = itemid;
    }

    public String getNamapembeli() {
        return namapembeli;
    }

    public void setNamapembeli(String namapembeli) {
        this.namapembeli = namapembeli;
    }

    public int getNomorwa() {
        return nomorwa;
    }

    public void setNomorwa(int nomorwa) {
        this.nomorwa = nomorwa;
    }

    public String getUsernamepembeli() {
        return usernamepembeli;
    }

    public void setUsernamepembeli(String usernamepembeli) {
        this.usernamepembeli = usernamepembeli;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public int getPaymentid() {
        return paymentid;
    }

    public void setPaymentid(int paymentid) {
        this.paymentid = paymentid;
    }

    public Timestamp getCheckoutdate() {
        return checkoutdate;
    }

    public void setCheckoutdate(Timestamp checkoutdate) {
        this.checkoutdate = checkoutdate;
    }

    public Timestamp getPaymentdate() {
        return paymentdate;
    }

    public void setPaymentdate(Timestamp paymentdate) {
        this.paymentdate = paymentdate;
    }

    public Timestamp getPackingdate() {
        return packingdate;
    }

    public void setPackingdate(Timestamp packingdate) {
        this.packingdate = packingdate;
    }

    public Timestamp getDeliverypickupdate() {
        return deliverypickupdate;
    }

    public void setDeliverypickupdate(Timestamp deliverypickupdate) {
        this.deliverypickupdate = deliverypickupdate;
    }

    public Timestamp getDeliverydonedate() {
        return deliverydonedate;
    }

    public void setDeliverydonedate(Timestamp deliverydonedate) {
        this.deliverydonedate = deliverydonedate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
