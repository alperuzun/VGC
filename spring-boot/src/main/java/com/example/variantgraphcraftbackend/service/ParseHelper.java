package com.example.variantgraphcraftbackend.service;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;

public class ParseHelper {

    public ParseHelper() {

    }

    public boolean chrExists(String chr) {
        try {
            int toInteger = Integer.valueOf(chr);
            if (toInteger >= 1 && toInteger <=  22) {
                return true;
            } else {
                return false;
            }
        } catch(NumberFormatException e) {
            if (chr.equals("X") || chr.equals("Y")) {
                return true;
            } else {
                return false;
            }
        }
    }

    public boolean rangeValid(int start, int end, String chrom) {
        return true;
    }


    public ArrayList<String> processGeneFile(String path) throws IOException {
        ArrayList<String> processedArray = new ArrayList<String>();
        BufferedReader input = new BufferedReader(new FileReader(path));
        String currLine = input.readLine();
        while (currLine != null) {
            String[] geneArray = currLine.split(",");
            for (String gene : geneArray) {
                processedArray.add(gene.trim());
            }
            currLine = input.readLine();
        }
        return processedArray;
    }

    public HashMap<String, Set<Integer>> processPosFile(String path) throws IOException {
        HashMap<String, Set<Integer>> processedMap = new HashMap<String, Set<Integer>>();
        BufferedReader input = new BufferedReader(new FileReader(path));
        String currLine = input.readLine();
        while (currLine != null) {
            //System.out.println("Line: " + currLine);
            String[] chrPosSeparation = currLine.split(":");
            String chr = chrPosSeparation[0];
            String[] separation = chrPosSeparation[1].split(",");
            Set<Integer> newPosSet = new HashSet<Integer>();
            for (String pos : separation) {
                newPosSet.add(Integer.valueOf(pos.trim()));
            }
            if (processedMap.containsKey(chr)) {
                processedMap.get(chr).addAll(newPosSet);
            } else {
                processedMap.put(chr, newPosSet);
            }
            currLine = input.readLine();
        }
        return processedMap;
    }
}
