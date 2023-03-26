package com.example.variantgraphcraftbackend.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class AboutBox {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String version;
    private String numPatients;
    private int chromosomes;

    public AboutBox() {

    }

    public AboutBox(String name, String version, String numPatients, int chromosomes) {
        this.name = name;
        this.version = version;
        this.numPatients = numPatients;
        this.chromosomes = chromosomes;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getVersion() {
        return this.version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getNumPatients() {
        return this.numPatients;
    }

    public void setNumPatients(String numPatients) {
        this.numPatients = numPatients;
    }

    public int getChromosomes() {
        return this.chromosomes;
    }

    public void setChromosomes(int chromosomes) {
        this.chromosomes = chromosomes;
    }
}
