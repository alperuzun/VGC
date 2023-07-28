package com.example.variantgraphcraftbackend.model;

import com.example.variantgraphcraftbackend.service.PathogenicParser;

import javax.persistence.*;
import java.io.IOException;
import java.util.*;

@Entity
public class BarView {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String xTitle;
    private String yTitle;
    private String zoomFactor;
    private String chr;
    @OneToMany
    private List<BarGraphData> data;
    @ElementCollection
    private Map<Integer, String> xMarkToVarMap;
    @OneToMany
    private Map<Integer, SingleVariantPathogenicity> svpData;


    public BarView() {

    }

    public BarView(String title, String xTitle, String yTitle, String zoomFactor, String chr) {
        this.title = title;
        this.xTitle = xTitle;
        this.yTitle = yTitle;
        this.zoomFactor = zoomFactor;
        this.chr = chr;
        this.data = new ArrayList<BarGraphData>();
        this.svpData = new HashMap<Integer, SingleVariantPathogenicity>();
        this.xMarkToVarMap = new HashMap<Integer, String>();
    }

    /**
     * Populates a zoomed histogram. Displays number of variants per range.
     * @param chromHistogramData
     */
    public void populateZoomedGraph(HashMap<Integer, Integer> chromHistogramData, HashMap<Integer, ArrayList<SubBar>> subBarMap) {
        this.data = new ArrayList<BarGraphData>();
        ArrayList<Integer> sortedList = new ArrayList<>(chromHistogramData.keySet());
        Collections.sort(sortedList);
        for (int i : sortedList) {
            this.data.add(new BarGraphData(String.valueOf(i), chromHistogramData.get(i), subBarMap.get(i)));
        }
    }

    public void setSvpData(HashMap<Integer, ArrayList<String[]>> posMap, ArrayList<String> header) throws IOException {
        ArrayList<Integer> sortedList = new ArrayList<Integer>(posMap.keySet());
        Collections.sort(sortedList);
        if (this.isFullyZoomed(posMap, sortedList)) {
            this.zoomFactor = "1";
            PathogenicParser pathogenicParser = new PathogenicParser();
            pathogenicParser.loadAll();
            for (int i : sortedList) {
                if (posMap.get(i).size() > 0) {
                    this.xMarkToVarMap.put(i, posMap.get(i).get(0)[1]);
                    SingleVariantPathogenicity svp = new SingleVariantPathogenicity(new ArrayList<String>(Arrays.asList(posMap.get(i).get(0))), this.chr);
                    svp.populate(pathogenicParser, header);
                    this.svpData.put(i, svp);
                }
            }
        }
    }

    public boolean isFullyZoomed(HashMap<Integer, ArrayList<String[]>> posMap, ArrayList<Integer> sortedList) {
        for (int i : sortedList) {
            if (posMap.get(i).size() > 1) {
                return false;
            }
        }
        return true;
    }


    /**
     * Populates initial histogram graph view. Displays number of variants per chromosome.
     * @param chromToVarData
     * @param chromNum
     */
    public void populateGraph(HashMap<String, Integer> chromToVarData, ArrayList<String> chromNum) {

        //Process chromosome list; handle X and Y
        System.out.println(chromToVarData);
        String x = "";
        String y = "";
        if(chromNum.contains("X")) {
            x = chromNum.remove(chromNum.indexOf("X"));
        }
        if(chromNum.contains("Y")) {
            y = chromNum.remove(chromNum.indexOf("Y"));
        }
        ArrayList<Integer> chromNumAsInt = new ArrayList<Integer>();
        for (String s : chromNum) {
            chromNumAsInt.add(Integer.valueOf(s));
        }
        Collections.sort(chromNumAsInt);
        ArrayList<String> sortedChrom = new ArrayList<String>();
        for (int s : chromNumAsInt) {
            sortedChrom.add(String.valueOf(s));
        }
        if(!x.equals("")) {
            sortedChrom.add(x);
        }
        if(!y.equals("")) {
            sortedChrom.add(y);
        }

        this.data = new ArrayList<BarGraphData>();
        for (String s : sortedChrom) {
            this.data.add(new BarGraphData(s, Integer.valueOf(chromToVarData.get(s)), null));
        }
    }

    public String getZoomFactor() {
        return this.zoomFactor;
    }

    public void setZoomFactor(String zoomFactor) {
        this.zoomFactor = zoomFactor;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getxTitle() {
        return this.xTitle;
    }

    public void setxTitle(String xTitle) {
        this.xTitle = xTitle;
    }

    public String getyTitle() {
        return this.yTitle;
    }

    public void setyTitle(String yTitle) {
        this.yTitle = yTitle;
    }

    public List<BarGraphData> getData() {
        return this.data;
    }

    public void setData(ArrayList<BarGraphData> data) {
        this.data = data;
    }

    public Map<Integer, SingleVariantPathogenicity> getSvpData() {
        return this.svpData;
    }

    public void setSvpData(HashMap<Integer, SingleVariantPathogenicity> svpData) {
        this.svpData = svpData;
    }

    public String getChr() {
        return this.chr;
    }

    public void setChr(String chr) {
        this.chr = chr;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public Map<Integer, String> getxMarkToVarMap() {
        return this.xMarkToVarMap;
    }

    public void setxMarkToVarMap(HashMap<Integer, String> xMarkToVarMap) {
        this.xMarkToVarMap = xMarkToVarMap;
    }
}