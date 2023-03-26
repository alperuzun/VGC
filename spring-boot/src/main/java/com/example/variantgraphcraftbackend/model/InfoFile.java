package com.example.variantgraphcraftbackend.model;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Entity
public class InfoFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ElementCollection
    private List<String> infoList;

    public InfoFile(String parentPath) {
        this.infoList = new ArrayList<String>();
    }

    public InfoFile() {

    }

    /**
     * Adds the VCF file version to the infoList.
     * @param currLine
     */
    public void addVersion(String currLine) {
        String version = currLine.substring(17);
        this.infoList.add(version);
    }

    /**
     * Adds the header fields & number of patients to the infoList.
     * @param currLine
     */
    public void addHeader(String currLine) {
        String fieldVal = currLine.substring(0, currLine.indexOf("TEST"));
        this.infoList.add(fieldVal);

        String sampleString = currLine.substring(currLine.indexOf("TEST"));
        String[] sampleData = sampleString.split("\t");
        this.infoList.add(String.valueOf(sampleData.length));
    }

    /**
     * Adds the total number of chromosomes & list of individual chromosomes to the
     * infoList as Strings. The individual chromosome numbers are sorted by their
     * String value.
     * @param chromNumber
     * @param chromList
     */
    public void addChromData(int chromNumber, List<String> chromList) {
        this.infoList.add(String.valueOf(chromNumber));
        Collections.sort(chromList);

        for (String key : chromList) {
            this.infoList.add(key);
        }
    }

    /**
     * Returns the VCF file version.
     * @return
     */
    public String getVersion() {
        return this.infoList.get(0);
    }

    /**
     * Returns the total number of patients/samples.
     * @return
     */
    public String getPatients() {
        return this.infoList.get(2);
    }

    /**
     * Returns the total number of chromosomes.
     * @return
     */
    public int getNumChrom() {
        return Integer.valueOf(this.infoList.get(3));
    }

    /**
     * Returns an ArrayList of chromosomes.
     * @return
     */
    public ArrayList<String> getChromosomes() {
        ArrayList<String> chromosomes = new ArrayList<String>();
        for (int i = 4; i < this.infoList.size(); i++) {
            chromosomes.add(this.infoList.get(i));
        }
        return chromosomes;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }
}
