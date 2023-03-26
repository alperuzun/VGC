package com.example.variantgraphcraftbackend.model;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class GridViewWrapper {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int length;
    @ElementCollection
    private List<String> queries;
    @OneToMany
    private List<GridView> gridViewList;

    public GridViewWrapper() {

    }

    public GridViewWrapper(int length) {
        this.length = length;
        this.queries = new ArrayList<String>();
        this.gridViewList = new ArrayList<GridView>();
    }

    public void addEntity(String query, GridView gridView) {
        this.queries.add(query);
        this.gridViewList.add(gridView);
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getLength() {
        return this.length;
    }

    public void setLength(int length) {
        this.length = length;
    }

    public List<String> getQueries() {
        return this.queries;
    }

    public void setQueries(ArrayList<String> queries) {
        this.queries = queries;
    }

    public List<GridView> getGridViewList() {
        return this.gridViewList;
    }

    public void setGridViewList(ArrayList<GridView> gridViewList) {
        this.gridViewList = gridViewList;
    }
}
