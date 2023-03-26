package com.example.variantgraphcraftbackend.model;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
public class MapColumn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String sampleName;
    @ElementCollection
    private List<Double> compareTo;

    public MapColumn(String sampleName) {
        this.sampleName = sampleName;
        this.compareTo = new ArrayList<Double>();
    }

    public MapColumn() {

    }

    public void populateColumn(List<Double> dpVals) {
        this.compareTo = dpVals;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSampleName() {
        return this.sampleName;
    }

    public void setSampleName(String sampleName) {
        this.sampleName = sampleName;
    }

    public List<Double> getCompareTo() {
        return this.compareTo;
    }

    public void setCompareTo(ArrayList<Double> compareTo) {
        this.compareTo = compareTo;
    }
}
