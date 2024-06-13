package com.LiqueStore.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "temporaryorder")
public class TemporaryOrderModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String orderid;
    private String username;
    private String phonenumber;
    private int totalprice;
    private int totalweight;
    private List<String> waitinglist;
    private List<String> itemidall;
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

    public OrderColourModel getColourid() {
        return colourid;
    }

    public void setColourid(OrderColourModel colourid) {
        this.colourid = colourid;
    }

    public List<String> getWaitinglist() {
        return waitinglist;
    }

    public void setWaitinglist(List<String> waitinglist) {
        this.waitinglist = waitinglist;
    }

    public List<String> getItemidall() {
        return itemidall;
    }

    public void setItemidall(List<String> itemidall) {
        this.itemidall = itemidall;
    }
}
