package com.example.variantgraphcraftbackend.model;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class GridViewLine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ElementCollection
    private List<String> row;

    public GridViewLine() {

    }

    public GridViewLine(ArrayList<String> row) {
        this.row = row;
    }

    public List<String> getRow() {
        return this.row;
    }

    public void setRow(ArrayList<String> row) {
        this.row = row;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
