package com.LiqueStore.model;

import jakarta.persistence.*;

import java.sql.Timestamp;
import java.util.List;

@Entity
@Table(name = "orders")
public class OrdersModel {
    @Id
    private String id;
    private List<String> itemidall;
    private String username;
    private String phonenumber;
    private int totalprice;
    private Timestamp checkoutdate;
    private Timestamp paymentdate;
    private Timestamp packingdate;
    private Timestamp deliverypickupdate;
    private Timestamp deliverydonedate;
    private String status;

    public OrdersModel() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public List<String> getItemidall() {
        return itemidall;
    }

    public void setItemidall(List<String> itemidall) {
        this.itemidall = itemidall;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPhonenumber() {
        return phonenumber;
    }

    public void setPhonenumber(String phonenumber) {
        this.phonenumber = phonenumber;
    }

    public int getTotalprice() {
        return totalprice;
    }

    public void setTotalprice(int totalprice) {
        this.totalprice = totalprice;
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
