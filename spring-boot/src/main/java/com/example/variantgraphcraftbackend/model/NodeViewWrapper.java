package com.example.variantgraphcraftbackend.model;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class NodeViewWrapper {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int length;
    @ElementCollection
    private List<String> queries;
    @OneToMany
    private List<NodeView> nodeViewList;

    public NodeViewWrapper() {

    }

    public NodeViewWrapper(int length) {
        this.length = length;
        this.queries = new ArrayList<String>();
        this.nodeViewList = new ArrayList<NodeView>();
    }

    public void addEntity(String query, NodeView nodeView) {
        this.queries.add(query);
        this.nodeViewList.add(nodeView);
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

    public List<NodeView> getNodeViewList() {
        return this.nodeViewList;
    }

    public void setNodeViewList(ArrayList<NodeView> nodeViewList) {
        this.nodeViewList = nodeViewList;
    }
}
