package com.example.variantgraphcraftbackend.model;

import com.example.variantgraphcraftbackend.service.PathogenicParser;
import javax.persistence.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

@Entity
public class SingleVariantPathogenicity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String chr;
    @ElementCollection
    private List<String> varInfo;
    private boolean isPathogenic;
    @ElementCollection
    private List<String> clinvarPathogenicVariants;
    @ElementCollection
    private List<String> pathogenicSamples;
    @ElementCollection
    private List<String> benignSamples;
    @ElementCollection
    private List<String> unknownSamples;


    public SingleVariantPathogenicity() {

    }

    public SingleVariantPathogenicity(ArrayList<String> varInfo, String chr) {
        this.chr = chr;
        this.varInfo = varInfo;
        this.isPathogenic = false;
        this.clinvarPathogenicVariants = new ArrayList<String>();
        this.pathogenicSamples = new ArrayList<String>();
        this.benignSamples = new ArrayList<String>();
        this.unknownSamples = new ArrayList<String>();
    }

    private ArrayList<String> getDeletions(String benign, String pathogenic) {
        ArrayList<String> possibleDeletions = new ArrayList<String>();
        if (pathogenic.equals("")) {
            possibleDeletions.add(benign);
            return possibleDeletions;
        } else {
            String leftDeletion = benign.substring(0, benign.length() - pathogenic.length());
            String rightDeletion = benign.substring(pathogenic.length() - 1);
            possibleDeletions.add(leftDeletion);
            possibleDeletions.add(rightDeletion);
        }
        return possibleDeletions;
    }

    public void populate(PathogenicParser pathogenicParser, ArrayList<String> header) {
        System.out.println("POPULATING SINGLE VARIANT PATHOGENICITY. VAR IS:");
        System.out.println(this.varInfo.toString());
        this.isPathogenic = pathogenicParser.isPathogenic(this.chr, varInfo.get(1));
        String ref = this.varInfo.get(3);
        String[] alt = this.varInfo.get(4).split(",");
        HashSet<Integer> pathIndices = new HashSet<Integer>();

        if (this.isPathogenic) {
            ArrayList<String[]> mutList = pathogenicParser.getMutationInfo(this.chr, varInfo.get(1));
            for (String[] mut : mutList) {
                System.out.println("Printing mut...");
                for (String s : mut) {
                    System.out.print(s + ", ");
                }
                this.clinvarPathogenicVariants.add(mut[2] + ":" + mut[3]);
                //check for deletion
                if (mut[2].length() > mut[3].length()) {
                    System.out.println("Deletion detected! Mut[2] is " + mut[2] + ", mut[3] is " + mut[3]);
                    ArrayList<String> pathogenicDeletions = this.getDeletions(mut[2], mut[3]);
                    for (int i = 0; i < alt.length; i++) {
                        System.out.println("\tChecking alt: " + alt[i]);
                        String altDeletion = alt[i].substring(1);
                        for (String pathDeletion : pathogenicDeletions) {
                            if (altDeletion.equals(pathDeletion)) {
                                System.out.println("EQUIVALENT: Index" + i + " added.");
                                pathIndices.add(i + 1);
                            }
                        }
                    }
                //check for insertion
                } else if (mut[2].length() < mut[3].length()) {
                    System.out.println("Insertion detected! Mut[2] is " + mut[2] + ", mut[3] is " + mut[3]);
                    String pathInsertion = mut[3];
                    for (int i = 0; i < alt.length; i++) {
                        System.out.println("\tChecking alt: " + alt[i]);
                        String altInsertion = alt[i];
                        if (altInsertion.equals(pathInsertion)) {
                            System.out.println("EQUIVALENT: Index" + i + " added.");
                            pathIndices.add(i + 1);
                        }
                    }
                //does insertion have same logic as substitution?
                } else {
                    System.out.println("Substitution detected! Mut[2] is " + mut[2] + ", mut[3] is " + mut[3]);
                    String pathInsertion = mut[3];
                    for (int i = 0; i < alt.length; i++) {
                        System.out.println("\tChecking alt: " + alt[i]);
                        String altInsertion = alt[i];
                        if (altInsertion.equals(pathInsertion)) {
                            System.out.println("EQUIVALENT: Index" + i + " added.");
                            pathIndices.add(i + 1);
                        }
                    }
                }
            }
            System.out.println("Pathogenic indices retrieved! Here they are: ");
            System.out.println(pathIndices);

        }
        this.populateSampleInfo(header, pathIndices);

    }

    private void populateSampleInfo(ArrayList<String> header, HashSet<Integer> pathIndices) {
        String[] format = this.varInfo.get(8).split(":");
        int gtIndex = -1;
        for (int i = 0; i < format.length; i++) {
            if (format[i].equals("GT")) {
                gtIndex = i;
            }
        }

        for (int j = 9; j < header.size(); j++) {
            String sampleGT = this.varInfo.get(j).split(":")[gtIndex];
            String firstVal = sampleGT.substring(0, 1);
            String secondVal = sampleGT.substring(2);
            if (firstVal.equals("0") && secondVal.equals("0")) {
                this.benignSamples.add(header.get(j));
            } else if (firstVal.equals(".") && secondVal.equals(".")) {
                this.unknownSamples.add(header.get(j));
            } else {
                for (int pathIndex : pathIndices) {
                    if (Integer.valueOf(firstVal) == pathIndex || Integer.valueOf(secondVal) == pathIndex) {
                        this.pathogenicSamples.add(header.get(j));
                    }
                }
            }

        }


    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getChr() {
        return this.chr;
    }

    public void setChr(String chr) {
        this.chr = chr;
    }

    public List<String> getVarInfo() {
        return this.varInfo;
    }

    public void setVarInfo(ArrayList<String> varInfo) {
        this.varInfo = varInfo;
    }

    public boolean isPathogenic() {
        return this.isPathogenic;
    }

    public void setPathogenic(boolean pathogenic) {
        this.isPathogenic = pathogenic;
    }

    public List<String> getClinvarPathogenicVariants() {
        return this.clinvarPathogenicVariants;
    }

    public void setClinvarPathogenicVariants(ArrayList<String> clinvarPathogenicVariants) {
        this.clinvarPathogenicVariants = clinvarPathogenicVariants;
    }

    public List<String> getPathogenicSamples() {
        return this.pathogenicSamples;
    }

    public void setPathogenicSamples(ArrayList<String> pathogenicSamples) {
        this.pathogenicSamples = pathogenicSamples;
    }

    public List<String> getBenignSamples() {
        return this.benignSamples;
    }

    public void setBenignSamples(ArrayList<String> benignSamples) {
        this.benignSamples = benignSamples;
    }

    public List<String> getUnknownSamples() {
        return this.unknownSamples;
    }

    public void setUnknownSamples(ArrayList<String> unknownSamples) {
        this.unknownSamples = unknownSamples;
    }
}

