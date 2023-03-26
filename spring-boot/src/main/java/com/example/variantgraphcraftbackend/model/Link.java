package com.example.variantgraphcraftbackend.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Link {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String source;
    private String target;
    private String GT;

    public Link(String source, String target, String GT) {
        this.source = source;
        this.target = target;
        this.GT = GT;
    }

    public Link() {

    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSource() {
        return this.source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getTarget() {
        return this.target;
    }

    public void setTarget(String target) {
        this.target = target;
    }

    public String getGT() {
        return this.GT;
    }

    public void setGT(String GT) {
        this.GT = GT;
    }
}
