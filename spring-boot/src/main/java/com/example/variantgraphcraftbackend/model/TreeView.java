package com.example.variantgraphcraftbackend.model;

import com.example.variantgraphcraftbackend.service.ClinvarParser;
import com.example.variantgraphcraftbackend.service.MSigdbParser;
import com.example.variantgraphcraftbackend.service.OMIMParser;

import javax.persistence.*;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Entity
public class TreeView {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String gene;
    private String title;
    private String chr;
    @ElementCollection
    private List<String> omimInformation;
    @ElementCollection
    private Map<String, String> goTermsBP;
    @ElementCollection
    private Map<String, String> goTermsCC;
    @ElementCollection
    private Map<String, String> goTermsMF;
    @ElementCollection
    private Map<String, String> biocarta;
    @ElementCollection
    private Map<String, String> kegg;
    @ElementCollection
    private Map<String, String> pid;
    @ElementCollection
    private Map<String, String> reactome;
    @ElementCollection
    private List<String> pathogenicVariants;
    @ElementCollection
    private List<String> benignVariants;
    @ElementCollection
    private List<String> noConsensus;


    public TreeView() {

    }

    public TreeView(String gene, String title, String chr) {
        this.gene = gene;
        this.title = title;
        this.chr = chr;
        this.omimInformation = new ArrayList<String>();
//        this.goTermsBP = new ArrayList<String>();
//        this.goTermsCC = new ArrayList<String>();
//        this.goTermsMF = new ArrayList<String>();
        this.goTermsBP = new HashMap<String, String>();
        this.goTermsCC = new HashMap<String, String>();
        this.goTermsMF = new HashMap<String, String>();

        this.biocarta = new HashMap<String, String>();
        this.kegg = new HashMap<String, String>();
        this.pid = new HashMap<String, String>();
        this.reactome = new HashMap<String, String>();
        this.pathogenicVariants = new ArrayList<String>();
        this.benignVariants = new ArrayList<String>();
        this.noConsensus = new ArrayList<String>();
    }

    public void populateTree(List<String[]> variants, String retrievedChr) throws IOException {
        ClinvarParser clinvarParser = new ClinvarParser();
        for (String[] var : variants) {
            System.out.println(var.toString());
            String[] clinvarData = clinvarParser.findVariant(Integer.valueOf(var[1]), retrievedChr, true);
            if (clinvarData == null) {
                this.noConsensus.add(var[1]);
            } else {
                if (clinvarData[2].substring(0, 10).equals("Pathogenic")) {
                    this.pathogenicVariants.add(var[1]);
                } else if (clinvarData[2].substring(0, 6).equals("Benign")) {
                    this.benignVariants.add(var[1]);
                } else {
                    this.noConsensus.add(var[1]);
                }
            }
        }
        OMIMParser omimParser = new OMIMParser();
        this.omimInformation.add(omimParser.getGeneAssociation(this.gene));
        MSigdbParser mSigdbParser = new MSigdbParser();
        this.goTermsBP = mSigdbParser.getGOTermsBP(this.gene);
        this.goTermsCC = mSigdbParser.getGOTermsCC(this.gene);
        this.goTermsMF = mSigdbParser.getGOTermsMF(this.gene);
        this.biocarta = mSigdbParser.getBiocarta(this.gene);
        this.kegg = mSigdbParser.getKegg(this.gene);
        this.pid = mSigdbParser.getPid(this.gene);
        this.reactome = mSigdbParser.getReactome(this.gene);
    }

//    public boolean isPathogenic() {
//
//
//    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGene() {
        return this.gene;
    }

    public void setGene(String gene) {
        this.gene = gene;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<String> getOmimInformation() {
        return this.omimInformation;
    }

    public void setOmimInformation(List<String> omimInformation) {
        this.omimInformation = omimInformation;
    }

    public List<String> getPathogenicVariants() {
        return this.pathogenicVariants;
    }

    public void setPathogenicVariants(ArrayList<String> pathogenicVariants) {
        this.pathogenicVariants = pathogenicVariants;
    }

    public List<String> getBenignVariants() {
        return this.benignVariants;
    }

    public void setBenignVariants(ArrayList<String> benignVariants) {
        this.benignVariants = benignVariants;
    }

    public List<String> getNoConsensus() {
        return this.noConsensus;
    }

    public void setNoConsensus(ArrayList<String> noConsensus) {
        this.noConsensus = noConsensus;
    }

    public String getChr() {
        return this.chr;
    }

    public void setChr(String chr) {
        this.chr = chr;
    }

    public Map<String, String> getGoTermsBP() {
        return this.goTermsBP;
    }

    public void setGoTermsBP(HashMap<String, String> goTermsBP) {
        this.goTermsBP = goTermsBP;
    }

    public Map<String, String> getGoTermsCC() {
        return this.goTermsCC;
    }

    public void setGoTermsCC(HashMap<String, String> goTermsCC) {
        this.goTermsCC = goTermsCC;
    }

    public Map<String, String> getGoTermsMF() {
        return this.goTermsMF;
    }

    public void setGoTermsMF(HashMap<String, String> goTermsMF) {
        this.goTermsMF = goTermsMF;
    }

    public Map<String, String> getBiocarta() {
        return this.biocarta;
    }

    public void setBiocarta(HashMap<String, String> biocarta) {
        this.biocarta = biocarta;
    }

    public Map<String, String> getKegg() {
        return this.kegg;
    }

    public void setKegg(HashMap<String, String> kegg) {
        this.kegg = kegg;
    }

    public Map<String, String> getPid() {
        return this.pid;
    }

    public void setPid(HashMap<String, String> pid) {
        this.pid = pid;
    }

    public Map<String, String> getReactome() {
        return this.reactome;
    }

    public void setReactome(HashMap<String, String> reactome) {
        this.reactome = reactome;
    }
}
