package com.example.variantgraphcraftbackend.service;

import com.example.variantgraphcraftbackend.model.BarView;
import org.springframework.stereotype.Component;

import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;

@Component
public class ZoomController {

    private BufferedReader input;
    private HashMap<String, Integer> chromToBPMap;
    private boolean read;

    public ZoomController() throws IOException {
        this.input = new BufferedReader(new InputStreamReader(getClass().getResourceAsStream("/chrom_bp_info.txt")));

        this.chromToBPMap = new HashMap<String, Integer>();
        this.read = false;
    }

    public void readBPInfo() throws IOException {
        String currLine = this.input.readLine();
        while(currLine != null) {
            String[] arr = currLine.split(",");
            this.chromToBPMap.put(arr[0], Integer.valueOf(arr[1]));
            currLine = this.input.readLine();
        }
        this.read = true;
    }

    public HashMap<Integer, Integer> generateDataTemplate(String chr) {
        int numBP = this.chromToBPMap.get(chr);
        int initialIncrement = 1000000;
        HashMap<Integer, Integer> template = new HashMap<Integer, Integer>();
        for (int i = 0; i <= numBP; i += initialIncrement) {
            template.put(i, 0);
        }
        return template;
    }

    public int generateZoomedTemplate(HashMap<Integer, Integer> template, HashMap<Integer, ArrayList<String[]>> posMap, int start, int end, int zoomFactor) {
        int increment;
        if (zoomFactor < 100) {
            increment = 1;
        } else {
            increment = (end - start) / 100;
        }
        for (int i = start; i <= end; i += increment) {
            template.put(i, 0);
            posMap.put(i, new ArrayList<String[]>());
        }
        return increment;
    }

    public int generateTemplateForGeneGraph(HashMap<Integer, Integer> template, HashMap<Integer, ArrayList<String[]>> posMap, int start, int end, int zoomFactor) {
        int startVal = (start / zoomFactor) * zoomFactor;
        int endVal = (end / zoomFactor) * zoomFactor + zoomFactor;
        for (int i = startVal; i <= endVal; i += zoomFactor) {
            template.put(i, 0);
            posMap.put(i, new ArrayList<String[]>());
        }
        return zoomFactor;
    }

    public int generateTemplateForRangeGraph(HashMap<Integer, Integer> template, HashMap<Integer, ArrayList<String[]>> posMap, int start, int end) {
        int increment;
        if (end - start < 500) {
            increment = 1;
        } else if (end - start < 1000) {
            increment = 10;
        } else {
            int length = String.valueOf(end - start).length();
            int power = length - 3;
            increment = (int) Math.pow(10, power);
        }
        int startVal = (start / increment) * increment;
        int endVal = (end / increment) * increment + increment;
        for (int i = startVal; i <= endVal; i += increment) {
            template.put(i, 0);
            posMap.put(i, new ArrayList<String[]>());
        }
        return increment;
    }

    public BarView generateGraph(HashMap<Integer, Integer> template) {
        return null;
    }

    public boolean isRead() {
        return this.read;
    }
}
