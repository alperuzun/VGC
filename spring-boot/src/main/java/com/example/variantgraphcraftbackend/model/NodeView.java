package com.example.variantgraphcraftbackend.model;

import com.example.variantgraphcraftbackend.model.filemanager.PhenotypeReader;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;

@Entity
public class NodeView {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private int numGenes;
    private String queryType; //"gene" vs "pos"
    private String rankType; //"pathogenicity" vs "dp"
    @ElementCollection
    private List<String> graphInfo; //[0] -> geneName, [1] -> chr, [2] -> startpos, [3] -> endpos
    @OneToMany
    private List<Node> nodes;
    @OneToMany
    private List<Link> links;
    @ElementCollection
    private List<String> patientGroups;

    public NodeView(String title, int numGenes, String queryType, String rankType) {
        this.title = title;
        this.numGenes = numGenes;
        this.queryType = queryType;
        this.rankType = rankType;
        this.graphInfo = new ArrayList<String>();
        this.nodes = new ArrayList<Node>();
        this.links = new ArrayList<Link>();
        this.patientGroups = new ArrayList<String>();
    }

    public NodeView() {

    }

    private boolean genotypeCondition(String firstVal, String secondVal, boolean HR, boolean HT, boolean HA) {
        if (HR && HT && HA) {
            return !secondVal.equals(".");
        } else if (HR && HT) {
            return secondVal.equals("0");
        } else if (HR && HA) {
            return !firstVal.equals(".") && firstVal.equals(secondVal);
        } else if (HT && HA) {
            return !secondVal.equals(".") && !secondVal.equals("0");
        } else if (HR) {
            return firstVal.equals("0") && secondVal.equals("0");
        } else if (HT) {
            return !firstVal.equals(secondVal);
        } else if (HA) {
            return !firstVal.equals(".") && !firstVal.equals("0") && firstVal.equals(secondVal);
        }
        return false;
    }

    public void populateSinglePosGraph(String[] variant, String gene, String[] sampleList,
                     boolean HR, boolean HT, boolean HA) {
        HashSet<String> samplesLinked = new HashSet<>();
        this.nodes.add(new Node(variant[0], variant[1], "variant", 0, gene, null));

        for (int i = 0; i < sampleList.length; i++) {
            String[] info = variant[9 + i].split(":");
            String firstVal = info[0].substring(0, 1);
            String secondVal = info[0].substring(2);
            if (this.genotypeCondition(firstVal, secondVal, HR, HT, HA)) {
                if (samplesLinked.contains(sampleList[i])) {
                    this.links.add(new Link(variant[1], sampleList[i], getGT(firstVal, secondVal)));
                    this.nodes.get(0).setSize(this.nodes.get(0).getSize() + 1);
                } else {
                    samplesLinked.add(sampleList[i]);
                    this.nodes.add(new Node(sampleList[i], "sample", 0, gene, null));
                    this.links.add(new Link(variant[1], sampleList[i], getGT(firstVal, secondVal)));
                    this.nodes.get(0).setSize(this.nodes.get(0).getSize() + 1);
                }
            }
        }

    }

    public void populateSinglePosGraph(String[] variant, String gene, String[] sampleList, PhenotypeReader phenotypeReader,
                     boolean HR, boolean HT, boolean HA) {
        HashSet<String> samplesLinked = new HashSet<>();
        this.nodes.add(new Node(variant[0], variant[1], "variant", 0, gene, null));

        for (int i = 0; i < sampleList.length; i++) {
            String[] info = variant[9 + i].split(":");
            String firstVal = info[0].substring(0, 1);
            String secondVal = info[0].substring(2);
            if (this.genotypeCondition(firstVal, secondVal, HR, HT, HA)) {
                if (samplesLinked.contains(sampleList[i])) {
                    this.links.add(new Link(variant[1], sampleList[i], getGT(firstVal, secondVal)));
                    this.nodes.get(0).setSize(this.nodes.get(0).getSize() + 1);
                } else {
                    samplesLinked.add(sampleList[i]);
                    this.nodes.add(new Node(sampleList[i], "sample", 0, gene, phenotypeReader.getGroup(sampleList[i])));
                    this.links.add(new Link(variant[1], sampleList[i], getGT(firstVal, secondVal)));
                    this.nodes.get(0).setSize(this.nodes.get(0).getSize() + 1);
                }
            }
        }
        this.patientGroups = new ArrayList<>(phenotypeReader.getGroupList());


    }


    private String getGT(String firstVal, String secondVal) {
        if (firstVal.equals(secondVal)) {
            if (firstVal.equals("0")) {
                return "HR";
            } else {
                return "HA";
            }
        }
        return "HT";
    }

    public void populateSingleGeneGraph(List<String[]> variants, String gene, String[] sampleList,
                                        boolean HR, boolean HT, boolean HA) {
        HashSet<String> samplesLinked = new HashSet<>();
        System.out.println("BOOLEANS: " + HR + HT + HA);
        for (String[] v : variants) {
            this.nodes.add(new Node(v[0], v[1], "variant", 0, gene, null));
            int index = this.nodes.size() - 1;
            for (int i = 0; i < sampleList.length; i++) {
                String[] info = v[9 + i].split(":");
                String firstVal = info[0].substring(0, 1);
                String secondVal = info[0].substring(2);
                if (this.genotypeCondition(firstVal, secondVal, HR, HT, HA)) {
                    if (samplesLinked.contains(sampleList[i])) {
                        this.links.add(new Link(v[1], sampleList[i], getGT(firstVal, secondVal)));
                        this.nodes.get(index).setSize(this.nodes.get(index).getSize() + 1);
                    } else {
                        samplesLinked.add(sampleList[i]);
                        this.nodes.add(new Node(sampleList[i], "sample", 0, gene, null));
                        this.links.add(new Link(v[1], sampleList[i], getGT(firstVal, secondVal)));
                        this.nodes.get(index).setSize(this.nodes.get(index).getSize() + 1);
                    }
                }
            }
        }
        System.out.println("Done populating!");
    }

    public void populateSingleGeneGraph(List<String[]> variants, String gene, String[] sampleList,
                                        PhenotypeReader phenotypeReader, boolean HR, boolean HT, boolean HA) {
        HashSet<String> samplesLinked = new HashSet<>();
        System.out.println("BOOLEANS: " + HR + HT + HA);
        for (String[] v : variants) {
            this.nodes.add(new Node(v[0], v[1], "variant", 0, gene, null));
            int index = this.nodes.size() - 1;
            for (int i = 0; i < sampleList.length; i++) {
                String[] info = v[9 + i].split(":");
                String firstVal = info[0].substring(0, 1);
                String secondVal = info[0].substring(2);
                if (this.genotypeCondition(firstVal, secondVal, HR, HT, HA)) {
                    if (samplesLinked.contains(sampleList[i])) {
                        this.links.add(new Link(v[1], sampleList[i], getGT(firstVal, secondVal)));
                        this.nodes.get(index).setSize(this.nodes.get(index).getSize() + 1);
                        this.nodes.get(index).incrementGroup(phenotypeReader.getGroup(sampleList[i]));
                    } else {
                        samplesLinked.add(sampleList[i]);
                        this.nodes.add(new Node(sampleList[i], "sample", 0, gene, phenotypeReader.getGroup(sampleList[i])));
                        this.links.add(new Link(v[1], sampleList[i], getGT(firstVal, secondVal)));
                        this.nodes.get(index).setSize(this.nodes.get(index).getSize() + 1);
                        this.nodes.get(index).incrementGroup(phenotypeReader.getGroup(sampleList[i]));
                    }
                }
            }
            this.nodes.get(index).generateGroupToNumSamplesString();
        }
        this.patientGroups = new ArrayList<>(phenotypeReader.getGroupList());

        System.out.println("Done populating!");
    }

    public void populateMultiGeneGraph(List<String[]> variants, HashMap<String, String> varToGeneMap, String[] sampleList,
                                       boolean HR, boolean HT, boolean HA) {
        HashSet<String> samplesLinked = new HashSet<>();
        System.out.println("BOOLEANS: " + HR + HT + HA);
        for (String[] v : variants) {
            this.nodes.add(new Node(v[0], v[1], "variant", 0, varToGeneMap.get(v[1]), null));
            int index = this.nodes.size() - 1;
            for (int i = 0; i < sampleList.length; i++) {
                String[] info = v[9 + i].split(":");
                String firstVal = info[0].substring(0, 1);
                String secondVal = info[0].substring(2);
                if (this.genotypeCondition(firstVal, secondVal, HR, HT, HA)) {
                    if (samplesLinked.contains(sampleList[i])) {
                        this.links.add(new Link(v[1], sampleList[i], this.getGT(firstVal, secondVal)));
                        this.nodes.get(index).setSize(this.nodes.get(index).getSize() + 1);
                    } else {
                        samplesLinked.add(sampleList[i]);
                        this.nodes.add(new Node(sampleList[i], "sample", 0, varToGeneMap.get(v[1]), null));
                        this.links.add(new Link(v[1], sampleList[i], this.getGT(firstVal, secondVal)));
                        this.nodes.get(index).setSize(this.nodes.get(index).getSize() + 1);
                    }
                }
            }
        }
    }

    public void populateMultiGeneGraph(List<String[]> variants, HashMap<String, String> varToGeneMap, String[] sampleList,
                                       PhenotypeReader phenotypeReader, boolean HR, boolean HT, boolean HA) {
        HashSet<String> samplesLinked = new HashSet<>();
        System.out.println("BOOLEANS: " + HR + HT + HA);
        for (String[] v : variants) {
            this.nodes.add(new Node(v[0], v[1], "variant", 0, varToGeneMap.get(v[1]), null));
            int index = this.nodes.size() - 1;
            for (int i = 0; i < sampleList.length; i++) {
                String[] info = v[9 + i].split(":");
                String firstVal = info[0].substring(0, 1);
                String secondVal = info[0].substring(2);
                if (this.genotypeCondition(firstVal, secondVal, HR, HT, HA)) {
                    if (samplesLinked.contains(sampleList[i])) {
                        this.links.add(new Link(v[1], sampleList[i], this.getGT(firstVal, secondVal)));
                        this.nodes.get(index).setSize(this.nodes.get(index).getSize() + 1);
                        this.nodes.get(index).incrementGroup(phenotypeReader.getGroup(sampleList[i]));
                    } else {
                        samplesLinked.add(sampleList[i]);
                        this.nodes.add(new Node(sampleList[i], "sample", 0, varToGeneMap.get(v[1]), phenotypeReader.getGroup(sampleList[i])));
                        this.links.add(new Link(v[1], sampleList[i], this.getGT(firstVal, secondVal)));
                        this.nodes.get(index).setSize(this.nodes.get(index).getSize() + 1);
                        this.nodes.get(index).incrementGroup(phenotypeReader.getGroup(sampleList[i]));
                    }
                }
            }
        }
        this.patientGroups = new ArrayList<>(phenotypeReader.getGroupList());
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getNumGenes() {
        return this.numGenes;
    }

    public void setNumGenes(int numGenes) {
        this.numGenes = numGenes;
    }

    public String getQueryType() {
        return this.queryType;
    }

    public void setQueryType(String queryType) {
        this.queryType = queryType;
    }

    public String getRankType() {
        return this.rankType;
    }

    public void setRankType(String rankType) {
        this.rankType = rankType;
    }

    public List<String> getGraphInfo() {
        return this.graphInfo;
    }

    public void setGraphInfo(ArrayList<String> graphInfo) {
        this.graphInfo = graphInfo;
    }

    public List<Node> getNodes() {
        return this.nodes;
    }

    public void setNodes(ArrayList<Node> nodes) {
        this.nodes = nodes;
    }

    public List<Link> getLinks() {
        return this.links;
    }

    public void setLinks(ArrayList<Link> links) {
        this.links = links;
    }

    public List<String> getPatientGroups() {
        return this.patientGroups;
    }

    public void setPatientGroups(ArrayList<String> patientGroups) {
        this.patientGroups = patientGroups;
    }
}



//    public void populateSinglePosGraph(String[] variant, String gene, String[] sampleList, boolean HR, boolean HT, boolean HA) {
//        HashSet<String> samplesLinked = new HashSet<>();
//        this.nodes.add(new Node(variant[1], "variant", 0, gene));
//        if (HR && HT && HA) {
//            for (int i = 0; i < sampleList.length; i++) {
//                String[] info = variant[9 + i].split(":");
//                String firstVal = info[0].substring(0, 1);
//                String secondVal = info[0].substring(2);
//                if (!secondVal.equals(".")) {
//                    if (samplesLinked.contains(sampleList[i])) {
//                        this.links.add(new Link(variant[1], sampleList[i], getGT(firstVal, secondVal)));
//                        this.nodes.get(0).setSize(this.nodes.get(0).getSize() + 1);
//                    } else {
//                        samplesLinked.add(sampleList[i]);
//                        this.nodes.add(new Node(sampleList[i], "sample", 0, gene));
//                        this.links.add(new Link(variant[1], sampleList[i], getGT(firstVal, secondVal)));
//                        this.nodes.get(0).setSize(this.nodes.get(0).getSize() + 1);
//                    }
//                }
//            }
//        } else if (HR && HT) {
//            for (int i = 0; i < sampleList.length; i++) {
//                String[] info = variant[9 + i].split(":");
//                String firstVal = info[0].substring(0, 1);
//                String secondVal = info[0].substring(2);
//                if (secondVal.equals("0")) {
//                    if (samplesLinked.contains(sampleList[i])) {
//                        this.links.add(new Link(variant[1], sampleList[i], getGT(firstVal, secondVal)));
//                        this.nodes.get(0).setSize(this.nodes.get(0).getSize() + 1);
//                    } else {
//                        samplesLinked.add(sampleList[i]);
//                        this.nodes.add(new Node(sampleList[i], "sample", 0, gene));
//                        this.links.add(new Link(variant[1], sampleList[i], getGT(firstVal, secondVal)));
//                        this.nodes.get(0).setSize(this.nodes.get(0).getSize() + 1);
//                    }
//                }
//            }
//        } else if (HR && HA) {
//            for (int i = 0; i < sampleList.length; i++) {
//                String[] info = variant[9 + i].split(":");
//                String firstVal = info[0].substring(0, 1);
//                String secondVal = info[0].substring(2);
//                if (!firstVal.equals(".") && firstVal.equals(secondVal)) {
//                    if (samplesLinked.contains(sampleList[i])) {
//                        this.links.add(new Link(variant[1], sampleList[i], getGT(firstVal, secondVal)));
//                        this.nodes.get(0).setSize(this.nodes.get(0).getSize() + 1);
//                    } else {
//                        samplesLinked.add(sampleList[i]);
//                        this.nodes.add(new Node(sampleList[i], "sample", 0, gene));
//                        this.links.add(new Link(variant[1], sampleList[i], getGT(firstVal, secondVal)));
//                        this.nodes.get(0).setSize(this.nodes.get(0).getSize() + 1);
//                    }
//                }
//            }
//        } else if (HT && HA) {
//            for (int i = 0; i < sampleList.length; i++) {
//                String[] info = variant[9 + i].split(":");
//                String firstVal = info[0].substring(0, 1);
//                String secondVal = info[0].substring(2);
//                if (!secondVal.equals(".") && !secondVal.equals("0")) {
//                    if (samplesLinked.contains(sampleList[i])) {
//                        this.links.add(new Link(variant[1], sampleList[i], getGT(firstVal, secondVal)));
//                        this.nodes.get(0).setSize(this.nodes.get(0).getSize() + 1);
//                    } else {
//                        samplesLinked.add(sampleList[i]);
//                        this.nodes.add(new Node(sampleList[i], "sample", 0, gene));
//                        this.links.add(new Link(variant[1], sampleList[i], getGT(firstVal, secondVal)));
//                        this.nodes.get(0).setSize(this.nodes.get(0).getSize() + 1);
//                    }
//                }
//            }
//        } else if (HR) {
//            for (int i = 0; i < sampleList.length; i++) {
//                String[] info = variant[9 + i].split(":");
//                String firstVal = info[0].substring(0, 1);
//                String secondVal = info[0].substring(2);
//                if (firstVal.equals("0") && secondVal.equals("0")) {
//                    if (samplesLinked.contains(sampleList[i])) {
//                        this.links.add(new Link(variant[1], sampleList[i], getGT(firstVal, secondVal)));
//                        this.nodes.get(0).setSize(this.nodes.get(0).getSize() + 1);
//                    } else {
//                        samplesLinked.add(sampleList[i]);
//                        this.nodes.add(new Node(sampleList[i], "sample", 0, gene));
//                        this.links.add(new Link(variant[1], sampleList[i], getGT(firstVal, secondVal)));
//                        this.nodes.get(0).setSize(this.nodes.get(0).getSize() + 1);
//                    }
//                }
//            }
//        } else if (HT) {
//            for (int i = 0; i < sampleList.length; i++) {
//                String[] info = variant[9 + i].split(":");
//                String firstVal = info[0].substring(0, 1);
//                String secondVal = info[0].substring(2);
//                if (!firstVal.equals(secondVal)) {
//                    if (samplesLinked.contains(sampleList[i])) {
//                        this.links.add(new Link(variant[1], sampleList[i], getGT(firstVal, secondVal)));
//                        this.nodes.get(0).setSize(this.nodes.get(0).getSize() + 1);
//                    } else {
//                        samplesLinked.add(sampleList[i]);
//                        this.nodes.add(new Node(sampleList[i], "sample", 0, gene));
//                        this.links.add(new Link(variant[1], sampleList[i], getGT(firstVal, secondVal)));
//                        this.nodes.get(0).setSize(this.nodes.get(0).getSize() + 1);
//                    }
//                }
//            }
//        } else if (HA) {
//            for (int i = 0; i < sampleList.length; i++) {
//                String[] info = variant[9 + i].split(":");
//                String firstVal = info[0].substring(0, 1);
//                String secondVal = info[0].substring(2);
//                if (!firstVal.equals(".") && !firstVal.equals("0") && firstVal.equals(secondVal)) {
//                    if (samplesLinked.contains(sampleList[i])) {
//                        this.links.add(new Link(variant[1], sampleList[i], getGT(firstVal, secondVal)));
//                        this.nodes.get(0).setSize(this.nodes.get(0).getSize() + 1);
//                    } else {
//                        samplesLinked.add(sampleList[i]);
//                        this.nodes.add(new Node(sampleList[i], "sample", 0, gene));
//                        this.links.add(new Link(variant[1], sampleList[i], getGT(firstVal, secondVal)));
//                        this.nodes.get(0).setSize(this.nodes.get(0).getSize() + 1);
//                    }
//                }
//            }
//        }
//    }

//
//    public void populateSingleGeneGraph(List<String[]> variants, String gene, String[] sampleList, boolean HR, boolean HT, boolean HA) {
//        HashSet<String> samplesLinked = new HashSet<>();
//        System.out.println("BOOLEANS: " + HR + HT + HA);
//        if (HR && HT && HA) {
//            for (String[] v : variants) {
//                this.nodes.add(new Node(v[1], "variant", 0, gene));
//                int index = this.nodes.size() - 1;
//                for (int i = 0; i < sampleList.length; i++) {
//                    String[] info = v[9 + i].split(":");
//                    String firstVal = info[0].substring(0, 1);
//                    String secondVal = info[0].substring(2);
//                    if (!secondVal.equals(".")) {
//                        if (samplesLinked.contains(sampleList[i])) {
//                            this.links.add(new Link(v[1], sampleList[i], getGT(firstVal, secondVal)));
//                            this.nodes.get(index).setSize(this.nodes.get(index).getSize() + 1);
//                        } else {
//                            samplesLinked.add(sampleList[i]);
//                            this.nodes.add(new Node(sampleList[i], "sample", 0, gene));
//                            this.links.add(new Link(v[1], sampleList[i], getGT(firstVal, secondVal)));
//                            this.nodes.get(index).setSize(this.nodes.get(index).getSize() + 1);
//                        }
//                    }
//                }
//            }
//        } else if (HR && HT) {
//            for (String[] v : variants) {
//                this.nodes.add(new Node(v[1], "variant", 0, gene));
//                int index = this.nodes.size() - 1;
//                for (int i = 0; i < sampleList.length; i++) {
//                    String[] info = v[9 + i].split(":");
//                    String firstVal = info[0].substring(0, 1);
//                    String secondVal = info[0].substring(2);
//                    if (firstVal.equals("0")) {
//                        if (samplesLinked.contains(sampleList[i])) {
//                            this.links.add(new Link(v[1], sampleList[i], getGT(firstVal, secondVal)));
//                            this.nodes.get(index).setSize(this.nodes.get(index).getSize() + 1);
//                        } else {
//                            samplesLinked.add(sampleList[i]);
//                            this.nodes.add(new Node(sampleList[i], "sample", 0, gene));
//                            this.links.add(new Link(v[1], sampleList[i], getGT(firstVal, secondVal)));
//                            this.nodes.get(index).setSize(this.nodes.get(index).getSize() + 1);
//                        }
//                    }
//                }
//            }
//        } else if (HR && HA) {
//            for (String[] v : variants) {
//                this.nodes.add(new Node(v[1], "variant", 0, gene));
//                int index = this.nodes.size() - 1;
//                for (int i = 0; i < sampleList.length; i++) {
//                    String[] info = v[9 + i].split(":");
//                    String firstVal = info[0].substring(0, 1);
//                    String secondVal = info[0].substring(2);
//                    if (!firstVal.equals(".") && firstVal.equals(secondVal)) {
//                        if (samplesLinked.contains(sampleList[i])) {
//                            this.links.add(new Link(v[1], sampleList[i], getGT(firstVal, secondVal)));
//                            this.nodes.get(index).setSize(this.nodes.get(index).getSize() + 1);
//                        } else {
//                            samplesLinked.add(sampleList[i]);
//                            this.nodes.add(new Node(sampleList[i], "sample", 0, gene));
//                            this.links.add(new Link(v[1], sampleList[i], getGT(firstVal, secondVal)));
//                            this.nodes.get(index).setSize(this.nodes.get(index).getSize() + 1);
//                        }
//                    }
//                }
//            }
//        } else if (HT && HA) {
//            for (String[] v : variants) {
//                this.nodes.add(new Node(v[1], "variant", 0, gene));
//                int index = this.nodes.size() - 1;
//                for (int i = 0; i < sampleList.length; i++) {
//                    String[] info = v[9 + i].split(":");
//                    String firstVal = info[0].substring(0, 1);
//                    String secondVal = info[0].substring(2);
//                    if (!secondVal.equals(".") && !secondVal.equals("0")) {
//                        if (samplesLinked.contains(sampleList[i])) {
//                            this.links.add(new Link(v[1], sampleList[i], getGT(firstVal, secondVal)));
//                            this.nodes.get(index).setSize(this.nodes.get(index).getSize() + 1);
//                        } else {
//                            samplesLinked.add(sampleList[i]);
//                            this.nodes.add(new Node(sampleList[i], "sample", 0, gene));
//                            this.links.add(new Link(v[1], sampleList[i], getGT(firstVal, secondVal)));
//                            this.nodes.get(index).setSize(this.nodes.get(index).getSize() + 1);
//                        }
//                    }
//                }
//            }
//        } else if (HR) {
//            for (String[] v : variants) {
//                this.nodes.add(new Node(v[1], "variant", 0, gene));
//                int index = this.nodes.size() - 1;
//                for (int i = 0; i < sampleList.length; i++) {
//                    String[] info = v[9 + i].split(":");
//                    String firstVal = info[0].substring(0, 1);
//                    String secondVal = info[0].substring(2);
//                    if (firstVal.equals("0") && secondVal.equals("0")) {
//                        if (samplesLinked.contains(sampleList[i])) {
//                            this.links.add(new Link(v[1], sampleList[i], getGT(firstVal, secondVal)));
//                            this.nodes.get(index).setSize(this.nodes.get(index).getSize() + 1);
//                        } else {
//                            samplesLinked.add(sampleList[i]);
//                            this.nodes.add(new Node(sampleList[i], "sample", 0, gene));
//                            this.links.add(new Link(v[1], sampleList[i], getGT(firstVal, secondVal)));
//                            this.nodes.get(index).setSize(this.nodes.get(index).getSize() + 1);
//                        }
//                    }
//                }
//            }
//        } else if (HT) {
//            for (String[] v : variants) {
//                this.nodes.add(new Node(v[1], "variant", 0, gene));
//                int index = this.nodes.size() - 1;
//                for (int i = 0; i < sampleList.length; i++) {
//                    String[] info = v[9 + i].split(":");
//                    String firstVal = info[0].substring(0, 1);
//                    String secondVal = info[0].substring(2);
//                    if (!firstVal.equals(secondVal)) {
//                        if (samplesLinked.contains(sampleList[i])) {
//                            this.links.add(new Link(v[1], sampleList[i], getGT(firstVal, secondVal)));
//                            this.nodes.get(index).setSize(this.nodes.get(index).getSize() + 1);
//                        } else {
//                            samplesLinked.add(sampleList[i]);
//                            this.nodes.add(new Node(sampleList[i], "sample", 0, gene));
//                            this.links.add(new Link(v[1], sampleList[i], getGT(firstVal, secondVal)));
//                            this.nodes.get(index).setSize(this.nodes.get(index).getSize() + 1);
//                        }
//                    }
//                }
//            }
//        } else if (HA) {
//            for (String[] v : variants) {
//                this.nodes.add(new Node(v[1], "variant", 0, gene));
//                int index = this.nodes.size() - 1;
//                for (int i = 0; i < sampleList.length; i++) {
//                    String[] info = v[9 + i].split(":");
//                    String firstVal = info[0].substring(0, 1);
//                    String secondVal = info[0].substring(2);
//                    if (!firstVal.equals(".") && !firstVal.equals("0") && firstVal.equals(secondVal)) {
//                        if (samplesLinked.contains(sampleList[i])) {
//                            this.links.add(new Link(v[1], sampleList[i], getGT(firstVal, secondVal)));
//                            this.nodes.get(index).setSize(this.nodes.get(index).getSize() + 1);
//                        } else {
//                            samplesLinked.add(sampleList[i]);
//                            this.nodes.add(new Node(sampleList[i], "sample", 0, gene));
//                            this.links.add(new Link(v[1], sampleList[i], getGT(firstVal, secondVal)));
//                            this.nodes.get(index).setSize(this.nodes.get(index).getSize() + 1);
//                        }
//                    }
//                }
//            }
//        }
//        System.out.println("Done populating!");
//    }
//
//    public void populateMultiGeneGraph(List<String[]> variants, HashMap<String, String> varToGeneMap, String[] sampleList, boolean HR, boolean HT, boolean HA) {
//        HashSet<String> samplesLinked = new HashSet<>();
//        System.out.println("BOOLEANS: " + HR + HT + HA);
//        if (HR && HT && HA) {
//            for (String[] v : variants) {
//                this.nodes.add(new Node(v[1], "variant", 0, varToGeneMap.get(v[1])));
//                int index = this.nodes.size() - 1;
//                for (int i = 0; i < sampleList.length; i++) {
//                    String[] info = v[9 + i].split(":");
//                    String firstVal = info[0].substring(0, 1);
//                    String secondVal = info[0].substring(2);
//                    if (!secondVal.equals(".")) {
//                        if (samplesLinked.contains(sampleList[i])) {
//                            this.links.add(new Link(v[1], sampleList[i], this.getGT(firstVal, secondVal)));
//                            this.nodes.get(index).setSize(this.nodes.get(index).getSize() + 1);
//                        } else {
//                            samplesLinked.add(sampleList[i]);
//                            this.nodes.add(new Node(sampleList[i], "sample", 0, varToGeneMap.get(v[1])));
//                            this.links.add(new Link(v[1], sampleList[i], this.getGT(firstVal, secondVal)));
//                            this.nodes.get(index).setSize(this.nodes.get(index).getSize() + 1);
//                        }
//                    }
//                }
//            }
//        } else if (HR && HT) {
//            for (String[] v : variants) {
//                this.nodes.add(new Node(v[1], "variant", 0, varToGeneMap.get(v[1])));
//                int index = this.nodes.size() - 1;
//                for (int i = 0; i < sampleList.length; i++) {
//                    String[] info = v[9 + i].split(":");
//                    String firstVal = info[0].substring(0, 1);
//                    String secondVal = info[0].substring(2);
//                    if (firstVal.equals("0")) {
//                        if (samplesLinked.contains(sampleList[i])) {
//                            this.links.add(new Link(v[1], sampleList[i], this.getGT(firstVal, secondVal)));
//                            this.nodes.get(index).setSize(this.nodes.get(index).getSize() + 1);
//                        } else {
//                            samplesLinked.add(sampleList[i]);
//                            this.nodes.add(new Node(sampleList[i], "sample", 0, varToGeneMap.get(v[1])));
//                            this.links.add(new Link(v[1], sampleList[i], this.getGT(firstVal, secondVal)));
//                            this.nodes.get(index).setSize(this.nodes.get(index).getSize() + 1);
//                        }
//                    }
//                }
//            }
//        } else if (HR && HA) {
//            for (String[] v : variants) {
//                this.nodes.add(new Node(v[1], "variant", 0, varToGeneMap.get(v[1])));
//                int index = this.nodes.size() - 1;
//                for (int i = 0; i < sampleList.length; i++) {
//                    String[] info = v[9 + i].split(":");
//                    String firstVal = info[0].substring(0, 1);
//                    String secondVal = info[0].substring(2);
//                    if (!firstVal.equals(".") && firstVal.equals(secondVal)) {
//                        if (samplesLinked.contains(sampleList[i])) {
//                            this.links.add(new Link(v[1], sampleList[i], this.getGT(firstVal, secondVal)));
//                            this.nodes.get(index).setSize(this.nodes.get(index).getSize() + 1);
//                        } else {
//                            samplesLinked.add(sampleList[i]);
//                            this.nodes.add(new Node(sampleList[i], "sample", 0, varToGeneMap.get(v[1])));
//                            this.links.add(new Link(v[1], sampleList[i], this.getGT(firstVal, secondVal)));
//                            this.nodes.get(index).setSize(this.nodes.get(index).getSize() + 1);
//                        }
//                    }
//                }
//            }
//        } else if (HT && HA) {
//            for (String[] v : variants) {
//                this.nodes.add(new Node(v[1], "variant", 0, varToGeneMap.get(v[1])));
//                int index = this.nodes.size() - 1;
//                for (int i = 0; i < sampleList.length; i++) {
//                    String[] info = v[9 + i].split(":");
//                    String firstVal = info[0].substring(0, 1);
//                    String secondVal = info[0].substring(2);
//                    if (!secondVal.equals(".") && !secondVal.equals("0")) {
//                        if (samplesLinked.contains(sampleList[i])) {
//                            this.links.add(new Link(v[1], sampleList[i], this.getGT(firstVal, secondVal)));
//                            this.nodes.get(index).setSize(this.nodes.get(index).getSize() + 1);
//                        } else {
//                            samplesLinked.add(sampleList[i]);
//                            this.nodes.add(new Node(sampleList[i], "sample", 0, varToGeneMap.get(v[1])));
//                            this.links.add(new Link(v[1], sampleList[i], this.getGT(firstVal, secondVal)));
//                            this.nodes.get(index).setSize(this.nodes.get(index).getSize() + 1);
//                        }
//                    }
//                }
//            }
//        } else if (HR) {
//            for (String[] v : variants) {
//                this.nodes.add(new Node(v[1], "variant", 0, varToGeneMap.get(v[1])));
//                int index = this.nodes.size() - 1;
//                for (int i = 0; i < sampleList.length; i++) {
//                    String[] info = v[9 + i].split(":");
//                    String firstVal = info[0].substring(0, 1);
//                    String secondVal = info[0].substring(2);
//                    if (firstVal.equals("0") && secondVal.equals("0")) {
//                        if (samplesLinked.contains(sampleList[i])) {
//                            this.links.add(new Link(v[1], sampleList[i], this.getGT(firstVal, secondVal)));
//                            this.nodes.get(index).setSize(this.nodes.get(index).getSize() + 1);
//                        } else {
//                            samplesLinked.add(sampleList[i]);
//                            this.nodes.add(new Node(sampleList[i], "sample", 0, varToGeneMap.get(v[1])));
//                            this.links.add(new Link(v[1], sampleList[i], this.getGT(firstVal, secondVal)));
//                            this.nodes.get(index).setSize(this.nodes.get(index).getSize() + 1);
//                        }
//                    }
//                }
//            }
//        } else if (HT) {
//            for (String[] v : variants) {
//                this.nodes.add(new Node(v[1], "variant", 0, varToGeneMap.get(v[1])));
//                int index = this.nodes.size() - 1;
//                for (int i = 0; i < sampleList.length; i++) {
//                    String[] info = v[9 + i].split(":");
//                    String firstVal = info[0].substring(0, 1);
//                    String secondVal = info[0].substring(2);
//                    if (!firstVal.equals(secondVal)) {
//                        if (samplesLinked.contains(sampleList[i])) {
//                            this.links.add(new Link(v[1], sampleList[i], this.getGT(firstVal, secondVal)));
//                            this.nodes.get(index).setSize(this.nodes.get(index).getSize() + 1);
//                        } else {
//                            samplesLinked.add(sampleList[i]);
//                            this.nodes.add(new Node(sampleList[i], "sample", 0, varToGeneMap.get(v[1])));
//                            this.links.add(new Link(v[1], sampleList[i], this.getGT(firstVal, secondVal)));
//                            this.nodes.get(index).setSize(this.nodes.get(index).getSize() + 1);
//                        }
//                    }
//                }
//            }
//        } else if (HA) {
//            for (String[] v : variants) {
//                this.nodes.add(new Node(v[1], "variant", 0, varToGeneMap.get(v[1])));
//                int index = this.nodes.size() - 1;
//                for (int i = 0; i < sampleList.length; i++) {
//                    String[] info = v[9 + i].split(":");
//                    String firstVal = info[0].substring(0, 1);
//                    String secondVal = info[0].substring(2);
//                    if (!firstVal.equals(".") && !firstVal.equals("0") && firstVal.equals(secondVal)) {
//                        if (samplesLinked.contains(sampleList[i])) {
//                            this.links.add(new Link(v[1], sampleList[i], this.getGT(firstVal, secondVal)));
//                            this.nodes.get(index).setSize(this.nodes.get(index).getSize() + 1);
//                        } else {
//                            samplesLinked.add(sampleList[i]);
//                            this.nodes.add(new Node(sampleList[i], "sample", 0, varToGeneMap.get(v[1])));
//                            this.links.add(new Link(v[1], sampleList[i], this.getGT(firstVal, secondVal)));
//                            this.nodes.get(index).setSize(this.nodes.get(index).getSize() + 1);
//                        }
//                    }
//                }
//            }
//        }
//    }