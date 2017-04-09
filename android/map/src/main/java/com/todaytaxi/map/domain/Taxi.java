package com.todaytaxi.map.domain;

/**
 * 出租车
 *
 * Created by zhujun on 2017/4/9 0009.
 */

public class Taxi {

    private String id;
    private double lng;
    private double lat;

    /**
     * 角度
     */
    private Integer direction;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public double getLng() {
        return lng;
    }

    public void setLng(double lng) {
        this.lng = lng;
    }

    public double getLat() {
        return lat;
    }

    public void setLat(double lat) {
        this.lat = lat;
    }

    public Integer getDirection() {
        return direction;
    }

    public void setDirection(Integer direction) {
        this.direction = direction;
    }
}
