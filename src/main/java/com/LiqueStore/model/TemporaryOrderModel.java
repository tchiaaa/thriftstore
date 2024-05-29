package com.LiqueStore.model;

import jakarta.persistence.*;

@Entity
@Table(name = "temporaryorder")
public class TemporaryOrderModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String orderid;
    private String username;
    private String phonenumber;
    private String itemidall;
    private int totalprice;
    private int totalweight;
    private String waitinglist;
    @ManyToOne
    @JoinColumn(name = "colourid", referencedColumnName = "id")
    private OrderColourModel colourid;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getOrderid() {
        return orderid;
    }

    public void setOrderid(String orderid) {
        this.orderid = orderid;
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

    public String getItemidall() {
        return itemidall;
    }

    public void setItemidall(String itemidall) {
        this.itemidall = itemidall;
    }

    public int getTotalprice() {
        return totalprice;
    }

    public void setTotalprice(int totalprice) {
        this.totalprice = totalprice;
    }

    public int getTotalweight() {
        return totalweight;
    }

    public void setTotalweight(int totalweight) {
        this.totalweight = totalweight;
    }

    public String getWaitinglist() {
        return waitinglist;
    }

    public void setWaitinglist(String waitinglist) {
        this.waitinglist = waitinglist;
    }

    public OrderColourModel getColourid() {
        return colourid;
    }

    public void setColourid(OrderColourModel colourid) {
        this.colourid = colourid;
    }
}
