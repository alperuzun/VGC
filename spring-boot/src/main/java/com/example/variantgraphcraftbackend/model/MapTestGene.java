package com.example.variantgraphcraftbackend.model;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class MapTestGene {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToMany
    private List<MapTestElement> variants;
    private String chr;
    private String gene;
    private String ensembleID;

    public MapTestGene(String gene, String chr, String ensembleID) {
        this.gene = gene;
        this.chr = chr;
        this.ensembleID = ensembleID;
        this.variants = new ArrayList<MapTestElement>();
    }

    public MapTestGene() {

    }

    public void addVariantElement(MapTestElement element) {
        this.variants.add(element);
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<MapTestElement> getVariants() {
        return this.variants;
    }

    public void setVariants(ArrayList<MapTestElement> variants) {
        this.variants = variants;
    }

    public String getChr() {
        return this.chr;
    }

    public void setChr(String chr) {
        this.chr = chr;
    }

    public String getGene() {
        return this.gene;
    }

    public void setGene(String gene) {
        this.gene = gene;
    }

    public String getEnsembleID() {
        return this.ensembleID;
    }

    public void setEnsembleID(String ensembleID) {
        this.ensembleID = ensembleID;
    }

    public String toString() {
        String s = "MAPTESTGENE: " + this.gene + '\n';
        for (MapTestElement element : this.variants) {
            s = s + element.getRowsAsList() + '\n';
            s = s + element.getTestResult() + '\n';
        }
        return s;
    }
}
