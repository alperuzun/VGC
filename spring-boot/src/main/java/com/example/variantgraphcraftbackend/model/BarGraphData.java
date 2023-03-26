package com.example.variantgraphcraftbackend.model;

import lombok.Data;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class BarGraphData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String x;
    private int y;
    @OneToMany
    private List<SubBar> subBars;

    public BarGraphData() {

    }

    public BarGraphData(String x, int y, ArrayList<SubBar> subBars) {
        this.x = x;
        this.y = y;
        this.subBars = subBars;
    }

    public String toString() {
        return x + ", " + y;
    }

    public String getX() {
        return this.x;
    }

    public void setX(String x) {
        this.x = x;
    }

    public int getY() {
        return this.y;
    }

    public void setY(int y) {
        this.y = y;
    }

    public List<SubBar> getSubBars() {
        return this.subBars;
    }

    public void setSubBars(ArrayList<SubBar> subBars) {
        this.subBars = subBars;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
