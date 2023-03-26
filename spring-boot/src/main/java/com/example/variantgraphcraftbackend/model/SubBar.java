package com.example.variantgraphcraftbackend.model;

import com.example.variantgraphcraftbackend.service.ClinvarParser;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.io.IOException;

@Entity
public class SubBar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String type; //intron vs exon
    private int val; //number of variants
    private String gene;
    private int num;
    private String name;
    private String conditions;
    private String significance;
    private String chromosome;
    private int location;
    private String snpId;
    private boolean inClinvar;

    public SubBar() {

    }

    public SubBar(String type, int num, int val, String gene, int position) {
        this.type = type;
        this.num = num;
        this.val = val;
        this.gene = gene;
        this.location = position;
    }

    public int getNum() {
        return this.num;
    }

    public void setNum(int num) {
        this.num = num;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getType() {
        return this.type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getVal() {
        return this.val;
    }

    public void setVal(int val) {
        this.val = val;
    }

    public String getGene() {
        return this.gene;
    }

    public void setGene(String gene) {
        this.gene = gene;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
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

    public int getLocation() {
        return this.location;
    }

    public void setLocation(int location) {
        this.location = location;
    }

    public String getSnpId() {
        return this.snpId;
    }

    public void setSnpId(String snpId) {
        this.snpId = snpId;
    }

    public boolean getInClinvar() {
        return this.inClinvar;
    }

    public void setVariantInfo(String chr, ClinvarParser parser) throws IOException {
        String[] variantInfo = parser.findVariant(this.location, chr, true);
//        String[] variantInfo = parser.findVariant("B3GALT6", "1167659", "1");
        if(variantInfo != null) {
            this.setName(variantInfo[0]);
            this.setConditions(variantInfo[1]);
            this.setSignificance(variantInfo[2]);
            this.setChromosome(variantInfo[3]);
            this.setSnpId(variantInfo[5]);
            this.inClinvar = true;
            System.out.println("In Set Variant Info: ");
            for (int i = 0; i < variantInfo.length; i++) {
                System.out.println(variantInfo[i]);
            }
//            System.out.println(variantInfo);
        }
    }
}
