package com.example.variantgraphcraftbackend.model;

import com.example.variantgraphcraftbackend.model.rscriptmanager.ExactTest;

import javax.persistence.*;
import java.util.*;

@Entity
public class MapTestElement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String varPos;
    private String varGene;
    private String varChr;
    @ElementCollection
    private List<String> matrixRowsSpaceSeparated;
    @ElementCollection
    private List<String> matrixRowsCommaSeparated;
    @ElementCollection
    private List<String> genotypes;
    @ElementCollection
    private List<String> sampleGroupNames;
    @ElementCollection
    private List<String> testResult;

    public MapTestElement(String varPos, String chr, String gene) {
        this.varPos = varPos;
        this.varGene = gene;
        this.varChr = chr;
        this.matrixRowsSpaceSeparated = new ArrayList<String>();
        this.matrixRowsCommaSeparated = new ArrayList<String>();
        this.genotypes = new ArrayList<String>(Arrays.asList(new String[] {"0/0", "0/1", "1/1"}));
        this.sampleGroupNames = new ArrayList<String>();
    }

    public MapTestElement() {

    }

    public void addMatrixRow(HashMap<String, Integer> groupGTMap) {
        HashSet<String> groupGTs = new HashSet<String>(groupGTMap.keySet());
        String newRowSpaceSeparated = "";
        String newRowCommaSeparated = "";

        for (String key : groupGTs) {
            newRowSpaceSeparated = newRowSpaceSeparated + groupGTMap.get(key) + " ";
            newRowCommaSeparated = newRowCommaSeparated + groupGTMap.get(key) + ",";
        }
        this.matrixRowsSpaceSeparated.add(newRowSpaceSeparated);
        this.matrixRowsCommaSeparated.add(newRowCommaSeparated);
        System.out.println("In addMatrixRow: " + this.matrixRowsCommaSeparated);
    }

    public void handleStatisticalAnalysis() {

        ExactTest exactTest = new ExactTest();
        exactTest.runFisherExact(this.getRowsAsList());
        this.setTestResult(exactTest.getResult());
    }

    public String getRowsAsList() {
        String list = "";
        for (String row: this.matrixRowsCommaSeparated) {
            list = list + row;
        }
        list = list.substring(0, list.length() - 1);
        return list;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getVarPos() {
        return this.varPos;
    }

    public void setVarPos(String varPos) {
        this.varPos = varPos;
    }

    public String getVarGene() {
        return this.varGene;
    }

    public void setVarGene(String varGene) {
        this.varGene = varGene;
    }

    public String getVarChr() {
        return this.varChr;
    }

    public void setVarChr(String varChr) {
        this.varChr = varChr;
    }

    public List<String> getMatrixRowsSpaceSeparated() {
        return this.matrixRowsSpaceSeparated;
    }

    public void setMatrixRowsSpaceSeparated(ArrayList<String> matrixRowsSpaceSeparated) {
        this.matrixRowsSpaceSeparated = matrixRowsSpaceSeparated;
    }

    public List<String> getMatrixRowsCommaSeparated() {
        return this.matrixRowsCommaSeparated;
    }

    public void setMatrixRowsCommaSeparated(ArrayList<String> matrixRowsCommaSeparated) {
        this.matrixRowsCommaSeparated = matrixRowsCommaSeparated;
    }

    public List<String> getGenotypes() {
        return this.genotypes;
    }

    public void setGenotypes(ArrayList<String> genotypes) {
        this.genotypes = genotypes;
    }

    public List<String> getSampleGroupNames() {
        return this.sampleGroupNames;
    }

    public void setSampleGroupNames(ArrayList<String> sampleGroupNames) {
        this.sampleGroupNames = sampleGroupNames;
    }

    public List<String> getTestResult() {
        return this.testResult;
    }

    public void setTestResult(ArrayList<String> testResult) {
        this.testResult = testResult;
    }
}
