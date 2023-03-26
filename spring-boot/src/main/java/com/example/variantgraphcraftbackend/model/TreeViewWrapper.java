package com.example.variantgraphcraftbackend.model;

import javax.persistence.*;
import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.List;

@Entity
public class TreeViewWrapper {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int length;
    @ElementCollection
    private List<String> queries;
    @OneToMany
    private List<TreeView> treeViewList;

    public TreeViewWrapper() {

    }

    public TreeViewWrapper(int length) {
        this.length = length;
        this.queries = new ArrayList<String>();
        this.treeViewList = new ArrayList<TreeView>();
    }

    public void addEntity(String query, TreeView treeView) {
        this.queries.add(query);
        this.treeViewList.add(treeView);
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

    public List<TreeView> getTreeViewList() {
        return this.treeViewList;
    }

    public void setTreeViewList(ArrayList<TreeView> treeViewList) {
        this.treeViewList = treeViewList;
    }
}
