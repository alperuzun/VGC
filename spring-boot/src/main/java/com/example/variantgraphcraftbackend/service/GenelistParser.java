package com.example.variantgraphcraftbackend.service;

import com.example.variantgraphcraftbackend.controller.exceptions.GeneNotFoundException;
import com.example.variantgraphcraftbackend.model.SubBar;

import java.io.*;
import java.util.*;

public class GenelistParser {

    // private File genelist;
    private BufferedReader input;
    private String currLine;
    private HashMap<String, int[]> fileNav;

    public GenelistParser() throws FileNotFoundException {
        // this.genelist = new File(path);
        this.fileNav = new HashMap<>();
        this.populateMap();
    }

    private void populateMap() {
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

    /**
     * Returns an array with gene location information. Index 0 as the chromosome, Index 1 as
     * the starting position, Index 2 as the ending position (inclusive).
     * @param gene
     * @return
     */
    public String[] getGeneLocation(String gene, String ref) throws IOException, GeneNotFoundException {

        this.input = new BufferedReader(new InputStreamReader(getClass().getResourceAsStream("/genelist_ensembl_" + ref + ".txt")));

        this.currLine = this.input.readLine();
        this.currLine = this.input.readLine();

        while (this.currLine != null) {
            String[] geneInfo = this.currLine.split("\t");
            if(geneInfo[12].equals(gene)) {
                return new String[] {geneInfo[2], geneInfo[4], geneInfo[5], geneInfo[16]};
            }
            this.currLine = this.input.readLine();
        }
        this.input.close();
        throw new GeneNotFoundException("Unrecognized gene: " + gene, 404);
    }

    public HashMap<Integer, ArrayList<SubBar>> getGeneInfoForVariants(HashMap<Integer, ArrayList<String[]>> keyToVarMap, String chr, String ref) throws IOException {
        ArrayList<Integer> xMarks = new ArrayList<>(keyToVarMap.keySet());
        Collections.sort(xMarks);
        HashMap<Integer, ArrayList<SubBar>> geneMap = new HashMap<Integer, ArrayList<SubBar>>();

        for (int xKey : xMarks) {
            ArrayList<SubBar> subs = new ArrayList<SubBar>();
            SubBar currSub = null;
            ArrayList<String[]> varInThisRange = new ArrayList<String[]>(keyToVarMap.get(xKey));

            String[] info = {"none", "0", "none", "0"};
            for (String[] var : varInThisRange) {
                int pos = Integer.valueOf(var[1]);
                //Checks if var is less than the endVal of the exon/intron for the current subbar
                if (pos < Integer.valueOf(info[3])) {
                    currSub.setVal(currSub.getVal() + 1);
                } else {
                    info = this.findInfoByPos(pos, chr, ref);
                    if (currSub == null) {
                        currSub = new SubBar(info[0], Integer.valueOf(info[1]), 1, info[2], pos);
                        currSub.setLocation(pos);
                    } else if (currSub.getType().equals(info[0]) &&
                            currSub.getNum() == Integer.valueOf(info[1]) &&
                            currSub.getGene().equals(info[2])) {
                        currSub.setVal(currSub.getVal() + 1);
                    } else {
                        subs.add(new SubBar(currSub.getType(), currSub.getNum(), currSub.getVal(), currSub.getGene(), currSub.getLocation()));
                        currSub = new SubBar(info[0], Integer.valueOf(info[1]), 1, info[2], pos);
                    }
                }

            }
            if (currSub != null) {
                subs.add(new SubBar(currSub.getType(), currSub.getNum(), currSub.getVal(), currSub.getGene(), currSub.getLocation()));
            }
            geneMap.put(xKey, subs);
        }
        return geneMap;
    }

    public String[] findInfoByPos(int varPos, String chr, String ref) throws IOException {
        this.input = new BufferedReader(new InputStreamReader(getClass().getResourceAsStream("/genelist_ensembl_" + ref + ".txt")));
        this.currLine = this.input.readLine();
        this.currLine = this.input.readLine();

        int startRead = this.fileNav.get(chr)[0];
        int endRead = this.fileNav.get(chr)[1];

        int lineCounter = 2;
        while (this.currLine != null) {
            if (lineCounter >= startRead) {
                if (lineCounter > endRead) {
                    String[] info = { "none", "0", "none", "0"};
                    return info;
                }
                String[] geneInfo = this.currLine.split("\t");
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
                                   String chr, List<String[]> variants, String ref) throws IOException {
        Map<String, List<String[]>> varForGene = this.findGeneByVariants(chr, variants, ref);
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
    }

    private Map<String, List<String[]>> findGeneByVariants(String chr, List<String[]> variants, String ref) throws IOException {
        Map<String, List<String[]>> varForGene = new HashMap<String, List<String[]>>();
        int startRead = this.fileNav.get(chr)[0];
        int endRead = this.fileNav.get(chr)[1];

        for (int i = 0; i < variants.size(); i++) {
            int currPos = Integer.valueOf(variants.get(i)[1]);
            // this.input = new BufferedReader(new InputStreamReader(getClass().getResourceAsStream("/genelist_ensemble_updated.txt")));

            this.input = new BufferedReader(new InputStreamReader(getClass().getResourceAsStream("/genelist_ensembl_" + ref + ".txt")));

            this.currLine = this.input.readLine();
            this.currLine = this.input.readLine();

            int lineCounter = 2;
            while (this.currLine != null) {
                if (lineCounter >= startRead) {
                    if (lineCounter > endRead) {
                        varForGene.put("No gene found for :" + currPos, new ArrayList<String[]>());
                        varForGene.get("No gene found for :" + currPos).add(variants.get(i));
                        break;
                    }
                    String[] geneInfo = this.currLine.split("\t");
                    if (Integer.valueOf(geneInfo[4]) < currPos && Integer.valueOf(geneInfo[5]) > currPos) {
                        varForGene.put(geneInfo[12] + ":" + geneInfo[16], new ArrayList<String[]>());
                        while(i < variants.size() && Integer.valueOf(geneInfo[5]) > Integer.valueOf(variants.get(i)[1])) {
                            varForGene.get(geneInfo[12] + ":" + geneInfo[16]).add(variants.get(i));
                            i++;
                        }
                        i--;
                        break;
                    }
                }
                lineCounter++;
                this.currLine = this.input.readLine();
            }
            this.input.close();
        }
        return varForGene;
    }

    private boolean inRange(int pos, int bound1, int bound2) {
        if ((pos <= bound1 && pos >= bound2) || (pos >= bound1 && pos <= bound2)) {
            return true;
        }
        return false;
    }
}
