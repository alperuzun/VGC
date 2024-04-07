package com.example.variantgraphcraftbackend.model;

import javax.persistence.*;
import java.util.*;

@Entity
public class MapView {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String passFilter;
    @OneToMany
    private List<MapColumn> mapData;
    @ElementCollection
    private List<Integer> startList;
    @ElementCollection
    private List<Integer> endList;
    @ElementCollection
    private List<String> nameList;
    @OneToMany
    private List<MapTestElement> varInfoList;
    @OneToMany
    private List<MapTestGene> geneList;
    @ElementCollection
    private List<String> sortedSampleList;
    @ElementCollection
    private List<String> yAxisLabels;

    public MapView(String title, String passFilter) {
        this.title = title;
        this.passFilter = passFilter;
        this.mapData = new ArrayList<MapColumn>();
        this.startList = new ArrayList<Integer>();
        this.endList = new ArrayList<Integer>();
        this.nameList = new ArrayList<String>();
        this.varInfoList = new ArrayList<MapTestElement>();
        this.geneList = new ArrayList<MapTestGene>();
        this.sortedSampleList = new ArrayList<String>();
        this.yAxisLabels = new ArrayList<String>();
    }

    public MapView() {

    }

    public void populateHeatMap(Map<String, Map<String, List<String[]>>> helperMap, ArrayList<String> samples, List<String[]> variantsSorted) {
        if (this.sortedSampleList.size() == 0) this.sortedSampleList = samples;

        HashMap<String, List<Double>> sampleToVarDPMap = new HashMap<String, List<Double>>();
        HashMap<String, Integer> compareTemplate = new HashMap<String, Integer>();

        samples.forEach(s -> {compareTemplate.put(s, 0); sampleToVarDPMap.put(s, new ArrayList<Double>());});

        List<String> allChr = new ArrayList<String>(helperMap.keySet());

        for (String chr : allChr) {

            List<String> allGenes = new ArrayList<String>(helperMap.get(chr).keySet());

            for (String geneString : allGenes) {
                String[] geneArr = geneString.split(":");
                String gene = geneArr[0];
                String ensembleID = geneArr[1];
                MapTestGene currGene = new MapTestGene(gene, chr, ensembleID);

                List<String[]> variants = helperMap.get(chr).get(geneString);

                for (String[] var : variants) {
                    this.yAxisLabels.add("Chr: " + chr + ", Position: " + var[1]);
                    int ceiling = this.getInitCeiling();

                    HashMap<String, Integer> groupGTMap = new HashMap<String, Integer>();
                    groupGTMap.put("0/0", 0);
                    groupGTMap.put("0/1", 0);
                    groupGTMap.put("1/1", 0);

                    MapTestElement currTestElement = new MapTestElement(var[1], chr, gene, variants.size());
                    HashMap<String, String> samplesGT = this.getGT(var, samples);
                    HashMap<String, Double> samplesDP = this.getDP(var, samples);

                    for (int i = 0; i < this.sortedSampleList.size(); i++) {
                        String currSample = this.sortedSampleList.get(i);
                        sampleToVarDPMap.get(currSample).add(samplesDP.get(currSample));
                        if (i <= ceiling) {
                            this.updateGroupGTMap(groupGTMap, samplesGT.get(currSample));
                        } else if (this.handleRowGTReset(groupGTMap, ceiling, currTestElement)) {
                            // EDIT:
                            groupGTMap = new HashMap<String, Integer>();
                            groupGTMap.put("0/0", 0);
                            groupGTMap.put("0/1", 0);
                            groupGTMap.put("1/1", 0);

                            this.updateGroupGTMap(groupGTMap, samplesGT.get(currSample));

                            ceiling = this.endList.get(this.endList.indexOf(ceiling) + 1);
                        }
                    }
                    //Adds the last matrix row as a MapTestElement
                    if (this.endList.size() > 0) {
                        currTestElement.addMatrixRow(groupGTMap);
                        currTestElement.handleStatisticalAnalysis();
                        currGene.addVariantElement(currTestElement);
                    }
                }
                this.geneList.add(currGene);
            }
        }
        for (String s : samples) {
            MapColumn col = new MapColumn(s);
            col.populateColumn(sampleToVarDPMap.get(s));
            this.mapData.add(col);
        }
    }

    private void updateGroupGTMap(HashMap<String, Integer> gtMap, String currSampleGT) {
        if (gtMap.containsKey(currSampleGT)) {
            gtMap.put(currSampleGT, gtMap.get(currSampleGT) + 1);
        } else {
            String equivalentKey = this.checkEquivalency(gtMap, currSampleGT);
            if (equivalentKey != null) {
                gtMap.put(equivalentKey, gtMap.get(equivalentKey) + 1);
            } 
        }
    }

    private boolean handleRowGTReset(HashMap<String, Integer> gtMap, int ceiling, MapTestElement currTestElement) {
        if (this.endList.size() > 0) {
            currTestElement.addMatrixRow(gtMap);
            if (this.endList.size() > this.endList.indexOf(ceiling) + 1) {
                return true;
            } 
        }
        return false;
    }

    private String checkEquivalency(HashMap<String, Integer> gtMap, String currSampleGT) {
        HashSet<String> existingGTs = new HashSet<>(gtMap.keySet());
        for (String gt : existingGTs) {
            if (this.isEquivalent(gt, currSampleGT)) {
                return gt;
            }
        }
        return null;
    }

    private int getInitCeiling() {
        if (this.endList.size() > 0) {
            return this.endList.get(0);
        }
        return 0;
    }

    public boolean isEquivalent(String firstSampleGT, String secondSampleGT) {
        String[] firstGTArr = firstSampleGT.split("[|/]+");
        String[] secondGTArr = secondSampleGT.split("[|/]+");
        if (!firstGTArr[0].equals(".") || !secondGTArr[0].equals(".")) {
            if ((firstGTArr[0].equals(secondGTArr[0]) && firstGTArr[1].equals(secondGTArr[1]))
                    || (firstGTArr[0].equals(secondGTArr[1]) && firstGTArr[1].equals(secondGTArr[0]))) {
                return true;
            }
        }
        return false;
    }

    public HashMap<String, String> getGT(String[] var, ArrayList<String> originalSampleList) {
        HashMap<String, String> sampleToGTMap = new HashMap<String, String>();
        for (int i = 0; i < this.sortedSampleList.size(); i++) {
            String[] currSample = var[9 + i].split(":");
            String currSampleGT = currSample[0];
            sampleToGTMap.put(originalSampleList.get(i), currSampleGT);
        }
        return sampleToGTMap;
    }

    public HashMap<String, Double> getDP(String[] var, ArrayList<String> originalSampleList) {
        HashMap<String, Double> sampleToDPMap = new HashMap<String, Double>();
        for (int i = 0; i < this.sortedSampleList.size(); i++) {
            String[] currSample = var[9 + i].split(":");
            String currSampleDP = currSample[2];
            sampleToDPMap.put(originalSampleList.get(i), Double.valueOf(currSampleDP));
        }
        return sampleToDPMap;
    }

    public void generateGroupInfo(HashMap<String, ArrayList<String>> groupToPatientsMap) {
        ArrayList<String> sampleGroups = new ArrayList<>(groupToPatientsMap.keySet());
        int counter = 0;
        for (String groupNum : sampleGroups) {
            this.startList.add(counter);
            this.endList.add(counter + groupToPatientsMap.get(groupNum).size() - 1);
            this.nameList.add(groupNum);
            counter = counter + groupToPatientsMap.get(groupNum).size();
            this.sortedSampleList.addAll(groupToPatientsMap.get(groupNum));
        }
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

    public List<MapColumn> getMapData() {
        return this.mapData;
    }

    public void setMapData(ArrayList<MapColumn> mapData) {
        this.mapData = mapData;
    }

    public List<Integer> getStartList() {
        return this.startList;
    }

    public void setStartList(ArrayList<Integer> startList) {
        this.startList = startList;
    }

    public List<Integer> getEndList() {
        return this.endList;
    }

    public void setEndList(ArrayList<Integer> endList) {
        this.endList = endList;
    }

    public List<String> getNameList() {
        return this.nameList;
    }

    public void setNameList(ArrayList<String> nameList) {
        this.nameList = nameList;
    }

    public String getPassFilter() {
        return this.passFilter;
    }

    public void setPassFilter(String passFilter) {
        this.passFilter = passFilter;
    }

    public List<MapTestElement> getVarInfoList() {
        return this.varInfoList;
    }

    public void setVarInfoList(ArrayList<MapTestElement> varInfoList) {
        this.varInfoList = varInfoList;
    }

    public List<MapTestGene> getGeneList() {
        return this.geneList;
    }

    public void setGeneList(ArrayList<MapTestGene> geneList) {
        this.geneList = geneList;
    }

    public List<String> getSortedSampleList() {
        return this.sortedSampleList;
    }

    public void setSortedSampleList(ArrayList<String> sortedSampleList) {
        this.sortedSampleList = sortedSampleList;
    }

    public List<String> getyAxisLabels() {
        return this.yAxisLabels;
    }

    public void setyAxisLabels(ArrayList<String> yAxisLabels) {
        this.yAxisLabels = yAxisLabels;
    }
}
