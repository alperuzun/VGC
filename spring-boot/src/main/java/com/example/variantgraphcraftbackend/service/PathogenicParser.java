package com.example.variantgraphcraftbackend.service;

// import org.apache.hadoop.yarn.webapp.hamlet.Hamlet;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.*;

public class PathogenicParser {

    private BufferedReader input;
    private Map<String, Set<String>> loadMap; //chr -> map(pos)
    private Map<String, HashMap<String, HashSet<String>>> mutMap; //chr -> hashmap( pos -> name )
    private int chrIdx;
    private int locIdx;
    private String clinvarPath;


    public PathogenicParser(String refGenome) {
        this.loadMap = new HashMap<String, Set<String>>();
        this.mutMap = new HashMap<String, HashMap<String, HashSet<String>>>();
        if (refGenome.equals("GRCh37")) {
            this.chrIdx = 7;
            this.locIdx = 8;
            this.clinvarPath = "/clinvar_pathogenic_sorted_grch37.txt";
        } else {
            this.chrIdx = 9;
            this.locIdx = 10;
            this.clinvarPath = "/clinvar_pathogenic_sorted_grch38.txt";
        }
    }

    public void loadAll() throws IOException {
        ParseHelper helper = new ParseHelper();
        this.input = new BufferedReader(new InputStreamReader(getClass().getResourceAsStream(this.clinvarPath)));
        String currLine = this.input.readLine();
        while (currLine != null) {
            String[] split = currLine.split("\t");
            String chr = split[this.chrIdx];
            if (helper.chrExists(chr)) {
                String[] variants = split[this.locIdx].split(" ");
                if (!this.loadMap.containsKey(chr)) {
                    this.loadMap.put(chr, new HashSet<String>());
                    this.mutMap.put(chr, new HashMap<String, HashSet<String>>());
                }
                this.loadMap.get(chr).add(variants[0]);
                if (!this.mutMap.get(chr).containsKey(variants[0])) {
                    this.mutMap.get(chr).put(variants[0], new HashSet<String>());
                }
                if (split.length > 14) {
                    this.mutMap.get(chr).get(variants[0]).add(split[14]);
                }
            }
            currLine = this.input.readLine();
        }
        this.input.close();
    }

    public void loadMapping() throws IOException {
        ParseHelper helper = new ParseHelper();
        this.input = new BufferedReader(new InputStreamReader(getClass().getResourceAsStream(this.clinvarPath)));
        String currLine = this.input.readLine();
        while (currLine != null) {
            String[] split = currLine.split("\t");
            String chr = split[this.chrIdx];
            if (helper.chrExists(chr)) {
                String[] variants = split[this.locIdx].split(" ");
                if (!this.loadMap.containsKey(chr)) {
                    this.loadMap.put(chr, new HashSet<String>());
                }
                this.loadMap.get(chr).add(variants[0]);
            }
            currLine = this.input.readLine();
        }
        this.input.close();
    }

    public boolean isPathogenic(String chr, String var) {
        try {
            if (this.loadMap.get(chr).contains(var)) {
                return true;
            }
            return false;
        } catch (NullPointerException e) { 
            return false;
        }
    }

    public ArrayList<String[]> getMutationInfo(String chr, String var) {
        ArrayList<String[]> mutInfo = new ArrayList<String[]>();
        ArrayList<String> stringMuts = new ArrayList<String>(this.mutMap.get(chr).get(var));
        for (String mut : stringMuts) {
            String[] tempMut = mut.split(":");
            if (tempMut.length < 4) {
                String[] newMut = new String[4];
                for (int i = 0; i < 3; i++) {
                    newMut[i] = tempMut[i];
                }
                newMut[3] = "";
                mutInfo.add(newMut);
            } else {
                mutInfo.add(mut.split(":"));
            }
        }
        return mutInfo;
    }
}

