package com.example.variantgraphcraftbackend.model;

import com.example.variantgraphcraftbackend.service.ClinvarParser;

import javax.persistence.*;
import java.io.IOException;
import java.util.*;

@Entity
public class Node {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name; //position for variants, sample name for patients
    private String type; //"variant" vs "sample"
    private int size; //number of connections
    @ElementCollection
    private Map<String, Integer> groupToNumSamples;
    private String groupToNumSamplesString;
    private String gene;
    private String group;
    private String variantName;
    private String conditions;
    private String significance;
    private String chromosome;
    private String snpId;
    private boolean pathogenic;
    private boolean inClinvar;

    public Node(String name, String type, int size, String gene, String group) {
        this.name = name;
        this.type = type;
        this.size = size;
        this.gene = gene;
        this.group = group;
    }

    public Node(String chr, String name, String type, int size, String gene, String group) {
        try {
            this.name = name;
            this.type = type;
            this.size = size;
            this.gene = gene;
            this.group = group;
            this.variantName = null;
            this.conditions = null;
            this.significance = null;
            this.chromosome = chr;
            this.snpId = null;
            this.pathogenic = false;
            this.inClinvar = false;
            this.groupToNumSamplesString = "";
            this.groupToNumSamples = new LinkedHashMap<String, Integer>();
            ClinvarParser parser = new ClinvarParser();
            this.setVariantInfo(Integer.parseInt(name), chr, parser);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public Node() {

    }

    public void incrementGroup(String groupName) {
        if (this.groupToNumSamples.containsKey(groupName)) {
            this.groupToNumSamples.put(groupName, this.groupToNumSamples.get(groupName) + 1);
        } else {
            this.groupToNumSamples.put(groupName, 1);
        }
    }

    public void generateGroupToNumSamplesString() {
        Set<String> keys = this.groupToNumSamples.keySet();
        for (String group : keys) {
            this.groupToNumSamplesString = this.groupToNumSamplesString.concat("Group " + group + ": n=" + this.groupToNumSamples.get(group) + ", \n");
        }
        if (this.groupToNumSamplesString.length() > 0) {
            this.groupToNumSamplesString = this.groupToNumSamplesString.substring(0, this.groupToNumSamplesString.length() - 1);
        } else {
        }
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

    public String getType() {
        return this.type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getSize() {
        return this.size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public String getGene() {
        return this.gene;
    }

    public void setGene(String gene) {
        this.gene = gene;
    }

    public String getGroup() {
        return this.group;
    }

    public void setGroup(String group) {
        this.group = group;
    }

    public String getVariantName() {
        return this.variantName;
    }

    public void setVariantName(String name) {
        this.variantName = name;
    }

    public String getConditions() {
        return this.conditions;
    }

    public void setConditions(String conditions) {
        this.conditions = conditions;
    }

    public String getSignificance() {
        return this.significance;
    }

    public void setSignificance(String significance) {
        this.significance = significance;
    }

    public String getChromosome() {
        return this.chromosome;
    }

    public void setChromosome(String chromosome) {
        this.chromosome = chromosome;
    }

    public String getSnpId() {
        return this.snpId;
    }

    public void setSnpId(String snpId) {
        this.snpId = snpId;
    }

    public boolean getPathogenic() {
        return this.pathogenic;
    }

    public void setPathogenic(boolean pathogenic) {
        this.pathogenic = pathogenic;
    }

    public boolean getInClinvar() {
        return this.inClinvar;
    }

    public void setInClinvar(boolean inClinvar) {
        this.inClinvar = inClinvar;
    }

    public String getGroupToNumSamplesString() {
        return this.groupToNumSamplesString;
    }

    public void setGroupToNumSamplesString(String groupToNumSamplesString) {
        this.groupToNumSamplesString = groupToNumSamplesString;
    }

    public Map<String, Integer> getGroupToNumSamples() {
        return this.groupToNumSamples;
    }

    public void setGroupToNumSamples(LinkedHashMap<String, Integer> groupToNumSamples) {
        this.groupToNumSamples = groupToNumSamples;
    }

    public void setVariantInfo(int location, String chr, ClinvarParser parser) throws IOException {
        String[] variantInfo = parser.findVariant(Integer.valueOf(this.name), chr, true);
        if(variantInfo != null) {
            this.setVariantName(variantInfo[0]);
            this.setConditions(variantInfo[1]);
            this.setSignificance(variantInfo[2]);
            this.setChromosome(variantInfo[3]);
            this.setSnpId(variantInfo[5]);
            if (variantInfo[2].startsWith("Pathogenic")) {
                this.pathogenic = true;
            } else if (variantInfo[2].startsWith("Benign")) {
                this.pathogenic = false;
            }
            this.inClinvar = true;
        }
    }
}
