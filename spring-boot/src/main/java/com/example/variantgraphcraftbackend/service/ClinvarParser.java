package com.example.variantgraphcraftbackend.service;

import com.example.variantgraphcraftbackend.model.SubBar;

import java.io.*;
import java.util.*;

public class ClinvarParser {

    private BufferedReader input;
    private String currLine;
    private HashMap<String, int[]> clinvarNav;
    private int chrIdx;
    private int locIdx;
    private int startLineIdx;
    private int endLineIdx;
    private String clinvarPath;

    public ClinvarParser(String refGenome) {
        this.clinvarNav = new HashMap<String, int[]>();
        this.populateClinvarNav();
        if (refGenome.equals("GRCh37")) {
            this.chrIdx = 7;
            this.locIdx = 8;
            this.startLineIdx = 0;
            this.endLineIdx = 1;
            this.clinvarPath = "/clinvar_sorted_grch37.txt";
        } else {
            this.chrIdx = 9;
            this.locIdx = 10;
            this.startLineIdx = 2;
            this.endLineIdx = 3;
            this.clinvarPath = "/clinvar_sorted_grch38.txt";
        }
    }


    private void populateClinvarNav() {
        this.clinvarNav.put("1", new int[] {1, 11510, 1, 11510});
        this.clinvarNav.put("2", new int[] {11511, 24084, 11511, 24079});
        this.clinvarNav.put("3", new int[] {24085, 31345, 24080, 31338});
        this.clinvarNav.put("4", new int[] {31346, 35569, 31339, 35561});
        this.clinvarNav.put("5", new int[] {35570, 42270, 35562, 42262});
        this.clinvarNav.put("6", new int[] {42271, 48152, 42263, 48144});
        this.clinvarNav.put("7", new int[] {48153, 54971, 48145, 54961});
        this.clinvarNav.put("8", new int[] {54972, 59084, 54962, 59074});
        this.clinvarNav.put("9", new int[] {59085, 65480, 59075, 65470});
        this.clinvarNav.put("10", new int[] {65481, 70202, 65471, 70192});
        this.clinvarNav.put("11", new int[] {70203, 78559, 70193, 78549});
        this.clinvarNav.put("12", new int[] {78560, 85075, 78550, 85066});
        this.clinvarNav.put("13", new int[] {85076, 91317, 85067, 91305});
        this.clinvarNav.put("14", new int[] {91318, 95086, 91306, 95074});
        this.clinvarNav.put("15", new int[] {95087, 99978, 95075, 99967});
        this.clinvarNav.put("16", new int[] {99979, 108117, 99968, 108107});
        this.clinvarNav.put("17", new int[] {108118, 120455, 108108, 120444});
        this.clinvarNav.put("18", new int[] {120456, 122643, 120445, 122632});
        this.clinvarNav.put("19", new int[] {122644, 129579, 122633, 129548});
        this.clinvarNav.put("20", new int[] {129580, 132279, 129549, 132248});
        this.clinvarNav.put("21", new int[] {132280, 134083, 132249, 134050});
        this.clinvarNav.put("22", new int[] {134084, 136996, 134051, 136963});
        this.clinvarNav.put("X", new int[] {136997, 144165, 136964, 144129});
        this.clinvarNav.put("Y", new int[] {144166, 144168, 144130, 144133});
    }
    public String[] findVariant(int startPos, String chr, boolean onlyPathogenic) throws IOException {
        String chrJustLabel;
        if(chr.startsWith("chr")) {
            chrJustLabel = chr.substring(3);
        } else {
            chrJustLabel = chr;
        }

        this.input = new BufferedReader(new InputStreamReader(getClass().getResourceAsStream(this.clinvarPath)));
        int startLine = this.clinvarNav.get(chrJustLabel)[this.startLineIdx];
        int endLine = this.clinvarNav.get(chrJustLabel)[this.endLineIdx];
        int lineNumber = -1;

        while(lineNumber < startLine) {
            this.currLine = this.input.readLine();
            lineNumber++;
        }

        String[] allFoundVariantInfo = null;

        while(lineNumber < endLine) {
            String[] variantInfo = this.currLine.split("\t");

            String s = variantInfo[this.locIdx].split(" ")[0];
            if(!s.equals("") && Integer.valueOf(s) == startPos) {
                if(allFoundVariantInfo == null) {
                    allFoundVariantInfo = new String[]{variantInfo[0], variantInfo[3], variantInfo[4], variantInfo[this.chrIdx], variantInfo[this.locIdx], variantInfo[13]};
                } else {
                    allFoundVariantInfo[0] = allFoundVariantInfo[0] + "&&nextvariant&&" + variantInfo[0];
                    allFoundVariantInfo[1] = allFoundVariantInfo[1] + "&&nextvariant&&" + variantInfo[3];
                    allFoundVariantInfo[2] = allFoundVariantInfo[2] + "&&nextvariant&&" + variantInfo[4];
                }
            }
            this.currLine = this.input.readLine();
            lineNumber++;
        }

        this.input.close();
        return allFoundVariantInfo;
    }

    public void populateVariantInfo(HashMap<Integer, ArrayList<SubBar>> posMap, String chr) throws IOException {
        ArrayList<Integer> locations = new ArrayList<>(posMap.keySet());

        for(int location : locations) {
            ArrayList<SubBar> bars = posMap.get(location);
            if (bars.size() == 1) {
                    if (bars.get(0).getVal() == 1) {
                        bars.get(0).setVariantInfo(chr, this);
                    }
            }
        }
    }
}