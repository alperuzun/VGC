package com.example.variantgraphcraftbackend.service;

import com.example.variantgraphcraftbackend.model.SubBar;

import java.io.*;
import java.util.*;

public class ClinvarParser {

    private BufferedReader input;
    private String currLine;
    private HashMap<String, int[]> clinvarNav;
    private Map<String, Set<String>> loadMap;

    public ClinvarParser() {
        this.clinvarNav = new HashMap<String, int[]>();
        this.populateClinvarNav();
        this.loadMap = new HashMap<String, Set<String>>();
    }

    private void populateClinvarNav() {
        this.clinvarNav.put("1", new int[] {1, 7712});
        this.clinvarNav.put("2", new int[] {7713, 16227});
        this.clinvarNav.put("3", new int[] {16228, 21018});
        this.clinvarNav.put("4", new int[] {21019, 23758});
        this.clinvarNav.put("5", new int[] {23759, 28052});
        this.clinvarNav.put("6", new int[] {28053, 31978});
        this.clinvarNav.put("7", new int[] {31979, 36393});
        this.clinvarNav.put("8", new int[] {36394, 39125});
        this.clinvarNav.put("9", new int[] {39126, 43558});
        this.clinvarNav.put("10", new int[] {43559, 46703});
        this.clinvarNav.put("11", new int[] {46704, 52407});
        this.clinvarNav.put("12", new int[] {52408, 57019});
        this.clinvarNav.put("13", new int[] {57020, 62300});
        this.clinvarNav.put("14", new int[] {62301, 65499});
        this.clinvarNav.put("15", new int[] {65000, 68197});
        this.clinvarNav.put("16", new int[] {68198, 73772});
        this.clinvarNav.put("17", new int[] {73773, 82726});
        this.clinvarNav.put("18", new int[] {82727, 84236});
        this.clinvarNav.put("19", new int[] {84237, 89026});
        this.clinvarNav.put("20", new int[] {89027, 90836});
        this.clinvarNav.put("21", new int[] {90837, 92121});
        this.clinvarNav.put("22", new int[] {92122, 93988});
        this.clinvarNav.put("X", new int[] {93989, 98660});
        this.clinvarNav.put("Y", new int[] {98661, 98663});
        this.clinvarNav.put("", new int[] {98664, 98778});
        this.clinvarNav.put("MT", new int[] {98779, 98897});
    }
    public String[] findVariant(int startPos, String chr, boolean onlyPathogenic) throws IOException {
        String chrJustLabel;
        if(chr.startsWith("chr")) {
            chrJustLabel = chr.substring(3);
        } else {
            chrJustLabel = chr;
        }

        //System.out.println("In findVariant. Startpos is: ");
        //System.out.println(startPos);
        this.input = new BufferedReader(new InputStreamReader(getClass().getResourceAsStream("/clinvarSORTED.txt")));
        int startLine = this.clinvarNav.get(chrJustLabel)[0];
        int endLine = this.clinvarNav.get(chrJustLabel)[1];
        int lineNumber = 0;

        while(lineNumber < startLine) {
            this.currLine = this.input.readLine();
            lineNumber++;
        }

        int numberOfVariantsFound = 0;
        String[] allFoundVariantInfo = null;

        while(lineNumber < endLine) {
            String[] variantInfo = this.currLine.split("\t");
            if(Integer.valueOf(variantInfo[8].split(" ")[0]) == startPos) {
                //System.out.println("Variant found!");
                //System.out.println(this.currLine);
                numberOfVariantsFound++;
                if(allFoundVariantInfo == null) {
                    allFoundVariantInfo = new String[]{variantInfo[0], variantInfo[3], variantInfo[4], variantInfo[7], variantInfo[8], variantInfo[13]};
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
        //System.out.println("Found " + numberOfVariantsFound + " variants. ");
        return allFoundVariantInfo;
    }

    public void populateVariantInfo(HashMap<Integer, ArrayList<SubBar>> posMap, String chr) throws IOException {
        ArrayList<Integer> locations = new ArrayList<>(posMap.keySet());
        for(int location : locations) {
           // System.out.println(location);
        }
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