package com.example.variantgraphcraftbackend.service;

import com.example.variantgraphcraftbackend.model.SubBar;

import java.io.*;
import java.util.*;

public class GenelistParser {

    private File genelist;
    private BufferedReader input;
    private String currLine;
    private HashMap<String, int[]> fileNav;

    public GenelistParser(String path) throws FileNotFoundException {
        this.genelist = new File(path);
        this.fileNav = new HashMap<>();
        this.populateMap();
    }

    private void populateMap() {
        //Collections.singletonMap("key", "Value")
        this.fileNav.put("1", new int[] {2, 2132});
        this.fileNav.put("10", new int[] {2133, 2873});
        this.fileNav.put("11", new int[] {2874, 4182});
        this.fileNav.put("12", new int[] {4183, 5115});
        this.fileNav.put("13", new int[] {5116, 5446});
        this.fileNav.put("14", new int[] {5447, 5980});
        this.fileNav.put("15", new int[] {5981, 6622});
        this.fileNav.put("16", new int[] {6623, 7397});
        this.fileNav.put("17", new int[] {7398, 8514});
        this.fileNav.put("18", new int[] {8515, 8790});
        this.fileNav.put("19", new int[] {8791, 10127});
        this.fileNav.put("2", new int[] {10128, 11375});
        this.fileNav.put("20", new int[] {11374, 11873});
        this.fileNav.put("21", new int[] {11874, 12058});
        this.fileNav.put("22", new int[] {12059, 12517});
        this.fileNav.put("3", new int[] {12518, 13573});
        this.fileNav.put("4", new int[] {13572, 14232});
        this.fileNav.put("5", new int[] {14233, 15119});
        this.fileNav.put("6", new int[] {15120, 15977});
        this.fileNav.put("7", new int[] {15978, 16897});
        this.fileNav.put("8", new int[] {16898, 17583});
        this.fileNav.put("9", new int[] {17584, 18346});
        this.fileNav.put("X", new int[] {18347, 19200});
        this.fileNav.put("Y", new int[] {19201, 19301});
    }

//    public ArrayList<String[]> getGenesForRange(String chr, int start, int end) throws IOException {
////        System.out.println("In GenelistParser, getGenesForRange.");
//        this.input = new BufferedReader(new InputStreamReader(getClass().getResourceAsStream("/GenelistSORTED.txt")));
//        this.currLine = this.input.readLine();
//        this.currLine = this.input.readLine();
//
//        while (this.currLine != null) {
//            String[] geneInfo = this.currLine.split("\t");
//            if(geneInfo[12].equals(gene)) {
////                System.out.println("Gene found!");
//                return new String[] {geneInfo[2], geneInfo[4], geneInfo[5]};
//            }
//            this.currLine = this.input.readLine();
//        }
//        this.input.close();
////        System.out.println("Gene does not exist.");
//
//        return null;
//    }

    /**
     * Returns an array with gene location information. Index 0 as the chromosome, Index 1 as
     * the starting position, Index 2 as the ending position (inclusive).
     * @param gene
     * @return
     */
    public String[] getGeneLocation(String gene) throws IOException {
//        System.out.println("In getGeneLocation. ");
        this.input = new BufferedReader(new InputStreamReader(getClass().getResourceAsStream("/genelist_ensemble_updated.txt")));
        this.currLine = this.input.readLine();
        this.currLine = this.input.readLine();

        while (this.currLine != null) {
            String[] geneInfo = this.currLine.split("\t");
            if(geneInfo[12].equals(gene)) {
//                System.out.println("Gene found!");
                return new String[] {geneInfo[2], geneInfo[4], geneInfo[5], geneInfo[16]};
            }
            this.currLine = this.input.readLine();
        }
        this.input.close();
//        System.out.println("Gene does not exist.");

        return null;
    }

    public HashMap<Integer, ArrayList<SubBar>> getGeneInfoForVariants(HashMap<Integer, ArrayList<String[]>> keyToVarMap, String chr) throws IOException {
//        System.out.println("In GenelistParser, getting gene info for list of variants...");
        ArrayList<Integer> xMarks = new ArrayList<>(keyToVarMap.keySet());
        Collections.sort(xMarks);
        HashMap<Integer, ArrayList<SubBar>> geneMap = new HashMap<Integer, ArrayList<SubBar>>();

        for (int xKey : xMarks) {
////            System.out.println("THIS XKEY: " + xKey);
            ArrayList<SubBar> subs = new ArrayList<SubBar>();
            SubBar currSub = null;
//            ArrayList<Integer> varInThisRange = new ArrayList<Integer>(keyToVarMap.get(xKey));
            ArrayList<String[]> varInThisRange = new ArrayList<String[]>(keyToVarMap.get(xKey));

//            Collections.sort(varInThisRange);
////            System.out.println("KEY: " + xKey + ", Total variants: " + varInThisRange.size());
            String[] info = {"none", "0", "none", "0"};
            for (String[] var : varInThisRange) {
//                System.out.println("This var: " + var[1]);
                int pos = Integer.valueOf(var[1]);
                //Checks if var is less than the endVal of the exon/intron for the current subbar
                if (pos < Integer.valueOf(info[3])) {
                    currSub.setVal(currSub.getVal() + 1);
                } else {
                    info = this.findInfoByPos(pos, chr);
                    if (currSub == null) {
                        currSub = new SubBar(info[0], Integer.valueOf(info[1]), 1, info[2], pos);
                        currSub.setLocation(pos);
                    } else if (currSub.getType().equals(info[0]) &&
                            currSub.getNum() == Integer.valueOf(info[1]) &&
                            currSub.getGene().equals(info[2])) {
                        currSub.setVal(currSub.getVal() + 1);
                    } else {
//                        System.out.println("Printing currSub: " + currSub.getType() + currSub.getNum() + ", Value: " + currSub.getVal());
                        subs.add(new SubBar(currSub.getType(), currSub.getNum(), currSub.getVal(), currSub.getGene(), currSub.getLocation()));
                        currSub = new SubBar(info[0], Integer.valueOf(info[1]), 1, info[2], pos);
                    }
                }

            }
            if (currSub != null) {
                subs.add(new SubBar(currSub.getType(), currSub.getNum(), currSub.getVal(), currSub.getGene(), currSub.getLocation()));
//                System.out.println("Printing currSub: " + currSub.getType() + currSub.getNum() + ", Value: " + currSub.getVal());
//                System.out.println("Printing subs length: " + subs.size());
            }
            geneMap.put(xKey, subs);
        }
        return geneMap;
    }

    public String[] findInfoByPos(int varPos, String chr) throws IOException {
//        System.out.println("Parsing genelist...");
        this.input = new BufferedReader(new InputStreamReader(getClass().getResourceAsStream("/genelist_ensemble_updated.txt")));

        this.currLine = this.input.readLine();
        this.currLine = this.input.readLine();

        int startRead = this.fileNav.get(chr)[0];
        int endRead = this.fileNav.get(chr)[1];
//        System.out.println("startRead: " + startRead + ",endRead: " + endRead);

        int lineCounter = 2;
        while (this.currLine != null) {
            if (lineCounter >= startRead) {
                if (lineCounter > endRead) {
                    String[] info = { "none", "0", "none", "0"};
//                    System.out.println("Returned early.");
                    return info;
                }
                String[] geneInfo = this.currLine.split("\t");
//                System.out.println("Transcription Start: " + geneInfo[4] + ", Transcription End: " + geneInfo[5]);
                if (Integer.valueOf(geneInfo[4]) < varPos && Integer.valueOf(geneInfo[5]) > varPos) {
                    String[] exonStarts = geneInfo[9].split(",");
                    String[] exonEnds = geneInfo[10].split(",");
                    for (int i = 0; i < exonStarts.length; i++) {
                        if (this.inRange(varPos, Integer.valueOf(exonStarts[i]), Integer.valueOf(exonEnds[i]))) {
                            int exonNum = i + 1;
                            String[] info = { "exon", String.valueOf(exonNum), geneInfo[12], exonEnds[i]};
                            this.input.close();
                            return info;
                        } else {
                            if (i < exonStarts.length - 1) {
                                if (this.inRange(varPos, Integer.valueOf(exonEnds[i]), Integer.valueOf(exonStarts[i + 1]))) {
                                    int exon1 = i + 1;
                                    int exon2 = i + 2;
                                    String[] info = { "intron", String.valueOf(exon1), geneInfo[12], exonStarts[i + 1]};
                                    this.input.close();
                                    return info;
                                }
                            }
                        }
                    }
                }
            }
            lineCounter++;
            this.currLine = this.input.readLine();
        }
        this.input.close();
        String[] info = { "none", "0", "none", "0"};
        return info;
    }

    /**
     * Gets gene information for compareSamples range query.
     */
    public void getRangeToGeneInfo(Map<String, Map<String, List<String[]>>> helperMap,
                                   String chr, List<String[]> variants) throws IOException {
        Map<String, List<String[]>> varForGene = this.findGeneByVariants(chr, variants);
        List<String> geneList = new ArrayList<String>(varForGene.keySet());
        if (!helperMap.containsKey(chr)) {
            helperMap.put(chr, new HashMap<String, List<String[]>>());
        }
        for (String gene : geneList) {
            if (helperMap.get(chr).containsKey(gene)) {
                helperMap.get(chr).get(gene).addAll(varForGene.get(gene));
            } else {
                helperMap.get(chr).put(gene, new ArrayList<String[]>(varForGene.get(gene)));
            }
        }
//        System.out.println("DONE");
//        System.out.println(helperMap);
    }

    private Map<String, List<String[]>> findGeneByVariants(String chr, List<String[]> variants) throws IOException {
        Map<String, List<String[]>> varForGene = new HashMap<String, List<String[]>>();
        int startRead = this.fileNav.get(chr)[0];
        int endRead = this.fileNav.get(chr)[1];

        for (int i = 0; i < variants.size(); i++) {
//            System.out.println("Parsing genelist...");
//            System.out.println("This variant: " + variants.get(i));
            int currPos = Integer.valueOf(variants.get(i)[1]);
            this.input = new BufferedReader(new InputStreamReader(getClass().getResourceAsStream("/genelist_ensemble_updated.txt")));

            this.currLine = this.input.readLine();
            this.currLine = this.input.readLine();

            int lineCounter = 2;
            while (this.currLine != null) {
                if (lineCounter >= startRead) {
                    if (lineCounter > endRead) {
                        varForGene.put("No gene found for :" + currPos, new ArrayList<String[]>());
                        varForGene.get("No gene found for :" + currPos).add(variants.get(i));
//                        System.out.println("Breaking............");
                        break;
                    }
                    String[] geneInfo = this.currLine.split("\t");
                    if (Integer.valueOf(geneInfo[4]) < currPos && Integer.valueOf(geneInfo[5]) > currPos) {
//                        System.out.println("New gene added: " + geneInfo[12]);
                        varForGene.put(geneInfo[12] + ":" + geneInfo[16], new ArrayList<String[]>());
                        while(i < variants.size() && Integer.valueOf(geneInfo[5]) > Integer.valueOf(variants.get(i)[1])) {
//                            System.out.println("In while loop. The end value: " + geneInfo[5] + ", greater than variant: " + variants.get(i)[1]);
                            varForGene.get(geneInfo[12] + ":" + geneInfo[16]).add(variants.get(i));
////                            System.out.println("VarForGene is now: " );
////                            System.out.println(varForGene);
                            i++;
                        }
                        i--;
//                        System.out.println("Breaking............");
                        break;
                    }
                }
                lineCounter++;
                this.currLine = this.input.readLine();
            }
            this.input.close();
        }
//        System.out.println("DONE PROCESSING, varForGene is: ") ;
//        System.out.println(varForGene);
        return varForGene;
    }

//    private Map<String, Set<String>> findGeneByVariants(String chr, List<String[]> variants) throws IOException {
//        Map<String, Set<String>> varForGene = new HashMap<String, Set<String>>();
//        int startRead = this.fileNav.get(chr)[0];
//        int endRead = this.fileNav.get(chr)[1];
//
//        for (int i = 0; i < variants.size(); i++) {
////            System.out.println("Parsing genelist...");
////            System.out.println("This variant: " + variants.get(i));
//            int currPos = Integer.valueOf(variants.get(i)[1]);
//            this.input = new BufferedReader(new InputStreamReader(getClass().getResourceAsStream("/genelist_sorted_emsemble.txt")));
//
//            this.currLine = this.input.readLine();
//            this.currLine = this.input.readLine();
//
//            int lineCounter = 2;
//            while (this.currLine != null) {
//                if (lineCounter >= startRead) {
//                    if (lineCounter > endRead) {
//                        varForGene.put("No gene found for " + currPos, new HashSet<String>());
//                        varForGene.get("No gene found for " + currPos).add(variants.get(i)[1]);
////                        System.out.println("Breaking............");
//                        break;
//                    }
//                    String[] geneInfo = this.currLine.split("\t");
//                    if (Integer.valueOf(geneInfo[4]) < currPos && Integer.valueOf(geneInfo[5]) > currPos) {
////                        System.out.println("New gene added: " + geneInfo[12]);
//                        varForGene.put(geneInfo[12], new HashSet<String>());
//                        while(i < variants.size() && Integer.valueOf(geneInfo[5]) > Integer.valueOf(variants.get(i)[1])) {
////                            System.out.println("In while loop. The end value: " + geneInfo[5] + ", greater than variant: " + variants.get(i)[1]);
//                            varForGene.get(geneInfo[12]).add(variants.get(i)[1]);
////                            System.out.println("VarForGene is now: " );
////                            System.out.println(varForGene);
//                            i++;
//                        }
//                        i--;
////                        System.out.println("Breaking............");
//                        break;
//                    }
//                }
//                lineCounter++;
//                this.currLine = this.input.readLine();
//            }
//            this.input.close();
//        }
////        System.out.println("DONE PROCESSING, varForGene is: ") ;
////        System.out.println(varForGene);
//        return varForGene;
//    }

    private boolean inRange(int pos, int bound1, int bound2) {
        if ((pos <= bound1 && pos >= bound2) || (pos >= bound1 && pos <= bound2)) {
            return true;
        }
        return false;
    }
}

//    public ArrayList<SubBar> getGeneInfoForVariants(HashMap<Integer, ArrayList<Integer>> variantPositions, String chr, int increment) throws IOException{
////        System.out.println("Getting gene info for list of variants... ");
//        ArrayList<Integer> xMarks = new ArrayList<>(variantPositions.keySet());
////        System.out.println("xMarks in order: " + xMarks);
//
//        for (int i = 0; i < xMarks.size(); i++) {
//            int key = xMarks.get(i);
//            ArrayList<SubBar> subs = new ArrayList<SubBar>();
//            this.input = new BufferedReader(new FileReader("src/GenelistSORTED.txt"));
//            this.currLine = this.input.readLine();
//            this.currLine = this.input.readLine();
//
//            int startRead = this.fileNav.get(chr).getKey();
//            int endRead = this.fileNav.get(chr).getValue();
//
//            int lineCounter = 2;
//            int pointer = 0;
//            while (this.currLine != null) {
//                if (lineCounter >= startRead) {
//                    if (lineCounter > endRead) {
//                        return subs;
//                    }
//                    String[] geneInfo = this.currLine.split("\t");
//                    //If the pointer variant is between transcription start and transcription end...
//                    if(Integer.valueOf(geneInfo[4]) < variantPositions.get(pointer) && Integer.valueOf(geneInfo[5]) > variantPositions.get(pointer)) {
//
////                        System.out.println("The variant " + variantPositions.get(0) + " is on gene " + geneInfo[12]);
//                    }
//                }
//                this.currLine = this.input.readLine();
//                lineCounter++;
//
//            }
//            this.input.close();
//
//        }
//
//        return subs;
//    }
//
//    public ArrayList<SubBar> getGeneInfoForPosList(HashMap<Integer, ArrayList<Integer>> varMap, ArrayList<Integer> allVars, String chr, int increment) throws IOException{
////        System.out.println("Getting gene info for list of variants... ");
////        ArrayList<SubBar> subs = new ArrayList<SubBar>();
//        ArrayList<Integer> xMarks = new ArrayList<>(varMap.keySet());
//        HashMap<Integer, ArrayList<SubBar>> subMap = new HashMap<Integer, ArrayList<SubBar>>();
//
//        this.input = new BufferedReader(new FileReader("src/GenelistSORTED.txt"));
//        this.currLine = this.input.readLine();
//        this.currLine = this.input.readLine();
//
//        int startRead = this.fileNav.get(chr).getKey();
//        int endRead = this.fileNav.get(chr).getValue();
//
//        int lineCounter = 2;
//        //navigates allVars
//        int pointer = 0;
//        //navigates xMarks
//        int incrementPointer = 0;
//        while (this.currLine != null) {
//            if (lineCounter >= startRead) {
//                if (lineCounter > endRead) {
//                    return subs;
//                }
//                String[] geneInfo = this.currLine.split("\t");
//                //If the pointer variant is between transcription start and transcription end...
//                if(Integer.valueOf(geneInfo[4]) < allVars.get(pointer) && Integer.valueOf(geneInfo[5]) > allVars.get(pointer)) {
//                    ArrayList<SubBar> subs = new ArrayList<SubBar>();
//                    Set<Integer> exons = new HashSet<>();
//                    Set<Integer> introns = new HashSet<>();
//
//                    String[] exonStarts = geneInfo[9].split(",");
//                    String[] exonEnds = geneInfo[10].split(",");
//                    for (int i = 0; i < exonStarts.length; i++) {
//                        int eStart = Integer.valueOf(exonStarts[i]);
//                        int eEnd = Integer.valueOf(exonEnds[i]);
//                        if (this.inRange(allVars.get(pointer), eStart, eEnd)) {
//                            if (this.inRange(allVars.get(pointer), xMarks.get(incrementPointer), xMarks.get(incrementPointer + 1))) {
//                                int exonNum = i + 1;
//                                int varCount = 1;
//                                pointer++;
//                                while (this.inRange(allVars.get(pointer), eStart, eEnd)) {
//                                    if (this.inRange(allVars.get(pointer), xMarks.get(incrementPointer), xMarks.get(incrementPointer + 1))) {
//                                        varCount++;
//                                        pointer++;
//                                    } else {
//                                        subs.add(new SubBar("exon", exonNum, varCount, geneInfo[12]));
//                                        subMap.put(incrementPointer, subs);
//                                        subs = new ArrayList<SubBar>();
//                                        varCount = 1;
//                                        pointer++;
//                                        incrementPointer++;
//                                    }
//                                }
//                                subs.add(new SubBar("exon", exonNum, varCount, geneInfo[12]));
//                            } else {
//                                incrementPointer++;
//
//                            }
//                            int exonNum = i + 1;
//                            int varCount = 1;
//                            pointer++;
//                            while (this.inRange(allVars.get(pointer), eStart, eEnd)) {
//                                varCount++;
//                                pointer++;
//                            }
//                            subs.add(new SubBar("exon", exonNum, varCount, geneInfo[12]));
//                        } else {
//                            if (i < exonStarts.length - 1) {
//                                if (this.inRange(allVars.get(pointer), eEnd, eStart)) {
//                                    int exon1 = i + 1;
//                                    int exon2 = i + 2;
//
//                                    int varCount = 1;
//                                    pointer++;
//                                    while (this.inRange(allVars.get(pointer), eEnd, eStart)) {
//                                        varCount++;
//                                        pointer++;
//                                    }
//                                    subs.add(new SubBar("intron", exon1, varCount, geneInfo[12]));
//                                } else {
////                                    System.out.println("This shouldn't happen.");
//                                }
//                            }
//                        }
////                        System.out.println("Pointer:" + pointer);
//                    }
//                }
//            }
//            this.currLine = this.input.readLine();
//            lineCounter++;
//        }
//        this.input.close();
//        return subs;
//    }
//
//    public boolean queryGeneInfo(int genomicPos, String chrom) {
//
//        try {
//            this.input = new BufferedReader(new FileReader(this.genelist));
//            this.currLine = this.input.readLine();
//            this.currLine = this.input.readLine();
//
//            while (this.currLine != null) {
//                String[] geneInfo = this.currLine.split("\t");
//                int txStart = Integer.valueOf(geneInfo[4]);
//                int txEnd = Integer.valueOf(geneInfo[5]);
//                if (geneInfo[2].equals("chr".concat(chrom))) {
//                    if (this.inRange(genomicPos, txStart, txEnd)) {
////                        System.out.println("Variant found on gene: " + geneInfo[12]);
//                        String[] exonStarts = geneInfo[9].split(",");
//                        String[] exonEnds = geneInfo[10].split(",");
//                        for (int i = 0; i < exonStarts.length; i++) {
//                            if (this.inRange(genomicPos, Integer.valueOf(exonStarts[i]), Integer.valueOf(exonEnds[i]))) {
//                                int exonNum = i + 1;
////                                System.out.println("Variant found on exon #" + exonNum);
//                            } else {
//                                if (i < exonStarts.length - 1) {
//                                    if (this.inRange(genomicPos, Integer.valueOf(exonEnds[i]), Integer.valueOf(exonStarts[i + 1]))) {
//                                        int exon1 = i + 1;
//                                        int exon2 = i + 2;
////                                        System.out.println("Variant in intronic region between exon #" + exon1 + " and exon #" + exon2);
//                                    }
//                                }
//                            }
//                        }
//                        return true;
//                    }
//                }
//                this.currLine = this.input.readLine();
//            }
//            this.input.close();
//        } catch (IOException e) {
////            System.out.println("IOException");
//        }
//
//        return false;
//    }
//
//    public int[] queryVariantsByGene(String geneName, String chrom) {
//        chrom = "chr".concat(chrom);
//        try {
//            this.input = new BufferedReader(new FileReader(this.genelist));
//            this.currLine = this.input.readLine();
//            this.currLine = this.input.readLine();
//
//            while (this.currLine != null) {
//                String[] geneInfo = this.currLine.split("\t");
//                if(geneInfo[2].equals(chrom)) {
//                    if(geneInfo[12].equals(geneName)) {
//                        int txStart = Integer.valueOf(geneInfo[4]);
//                        int txEnd = Integer.valueOf(geneInfo[5]);
//                        return new int[] {txStart, txEnd};
//                    }
//                }
//                this.currLine = this.input.readLine();
//            }
//            this.input.close();
//        } catch (IOException e) {
////            System.out.println("IOException");
//        }
//
//        return null;
//    }
//        this.fileNav.put("1", new int[] {2, 2226});
//                this.fileNav.put("10", new int[] {2227, 3050});
//                this.fileNav.put("11", new int[] {3051, 4440});
//                this.fileNav.put("12", new int[] {4441, 5464});
//                this.fileNav.put("13", new int[] {5465, 5831});
//                this.fileNav.put("14", new int[] {5832, 6430});
//                this.fileNav.put("15", new int[] {6431, 7116});
//                this.fileNav.put("16", new int[] {7117, 7956});
//                this.fileNav.put("17", new int[] {7957, 9139});
//                this.fileNav.put("18", new int[] {9140, 9463});
//                this.fileNav.put("19", new int[] {9464, 10844});
//                this.fileNav.put("2", new int[] {10845, 12172});
//                this.fileNav.put("20", new int[] {12173, 12718});
//                this.fileNav.put("21", new int[] {12719, 12920});
//                this.fileNav.put("22", new int[] {12921, 13402});
//                this.fileNav.put("3", new int[] {13403, 14532});
//                this.fileNav.put("4", new int[] {14533, 15254});
//                this.fileNav.put("5", new int[] {15255, 16265});
//                this.fileNav.put("6", new int[] {16266, 17198});
//                this.fileNav.put("7", new int[] {17199, 18162});
//                this.fileNav.put("8", new int[] {18163, 18910});
//                this.fileNav.put("9", new int[] {18911, 19726});
//                this.fileNav.put("X", new int[] {19727, 20608});
//                this.fileNav.put("Y", new int[] {20609, 20710});

