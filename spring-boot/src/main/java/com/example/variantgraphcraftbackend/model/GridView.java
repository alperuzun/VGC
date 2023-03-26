package com.example.variantgraphcraftbackend.model;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class GridView {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String queryName;
    @ElementCollection
    private List<String> header;
    @OneToMany
    private List<GridViewLine> rowData;

    public GridView() {

    }

    public GridView(String queryName) {
        this.queryName = queryName;
        this.header = new ArrayList<String>();
        this.rowData = new ArrayList<GridViewLine>();
    }

    public void addRow(ArrayList<String> newRow) {
        this.rowData.add(new GridViewLine(newRow));
//        this.setId(id);
    }

    public List<String> getHeader() {
        return this.header;
    }

    public void setHeader(List<String> header) {
        this.header = header;
    }

    public List<GridViewLine> getRowData() {
        return this.rowData;
    }

    public void setRowData(ArrayList<GridViewLine> rowData) {
        this.rowData = rowData;
    }

    public String getQueryName() {
        return this.queryName;
    }

    public void setQueryName(String queryName) {
        this.queryName = queryName;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }
}
