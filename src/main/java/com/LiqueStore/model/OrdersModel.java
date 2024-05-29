package com.LiqueStore.model;

import jakarta.persistence.*;

import java.sql.Timestamp;

@Entity
@Table(name = "orders")
public class OrdersModel {
    @Id
    private String id;
    private String namapembeli;
    private String nomorwa;
    private String usernamepembeli;
    private int price;
    private Timestamp checkoutdate;
    private Timestamp paymentdate;
    private Timestamp packingdate;
    private Timestamp deliverypickupdate;
    private Timestamp deliverydonedate;
    private String status;
    @ManyToOne
    @JoinColumn(name = "itemid", referencedColumnName = "id")
    private ItemModel itemId;
    @ManyToOne
    @JoinColumn(name = "paymentid", referencedColumnName = "id")
    private PaymentModel paymentId;

    public OrdersModel() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public ItemModel getItemId() {
        return itemId;
    }

    public void setItemId(ItemModel itemId) {
        this.itemId = itemId;
    }

    public String getNamapembeli() {
        return namapembeli;
    }

    public void setNamapembeli(String namapembeli) {
        this.namapembeli = namapembeli;
    }

    public String getNomorwa() {
        return nomorwa;
    }

    public void setNomorwa(String nomorwa) {
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

    public PaymentModel getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(PaymentModel paymentId) {
        this.paymentId = paymentId;
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
