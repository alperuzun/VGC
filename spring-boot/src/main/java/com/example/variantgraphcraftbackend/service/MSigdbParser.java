package com.example.variantgraphcraftbackend.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.lang.reflect.Array;
import java.util.*;

public class MSigdbParser {

    public MSigdbParser() {

    }

    public Map<String, String> getGOTermsBP(String gene) throws IOException {
        BufferedReader input = new BufferedReader(new InputStreamReader(getClass().getResourceAsStream("/c5.go.bp.v7.5.1.symbols.txt")));
        Map<String, String> bpList = new HashMap<String, String>();

        String currLine = input.readLine();
        while (currLine != null) {
            if (currLine.contains(gene)) {
                String[] arr = currLine.split("\t");
                bpList.put(arr[0], arr[1]);
            }
            currLine = input.readLine();
        }
        return bpList;
    }

    public Map<String, String> getGOTermsCC(String gene) throws IOException {
        BufferedReader input = new BufferedReader(new InputStreamReader(getClass().getResourceAsStream("/c5.go.cc.v7.5.1.symbols.txt")));
        Map<String, String> ccList = new HashMap<String, String>();

        String currLine = input.readLine();
        while (currLine != null) {
            if (currLine.contains(gene)) {
                String[] arr = currLine.split("\t");
                ccList.put(arr[0], arr[1]);
            }
            currLine = input.readLine();
        }
        return ccList;
    }

    public Map<String, String> getGOTermsMF(String gene) throws IOException {
        BufferedReader input = new BufferedReader(new InputStreamReader(getClass().getResourceAsStream("/c5.go.mf.v7.5.1.symbols.txt")));
        Map<String, String> mfList = new HashMap<String, String>();

        String currLine = input.readLine();
        while (currLine != null) {
            if (currLine.contains(gene)) {
                String[] arr = currLine.split("\t");
                mfList.put(arr[0], arr[1]);
            }
            currLine = input.readLine();
        }
        return mfList;
    }

    public Map<String, String> getBiocarta(String gene) throws IOException {
        BufferedReader input = new BufferedReader(new InputStreamReader(getClass().getResourceAsStream("/c2.cp.biocarta.v7.5.1.symbols.txt")));
        Map<String, String> biocartaMap = new HashMap<String, String>();

        String currLine = input.readLine();
        while (currLine != null) {
            if (currLine.contains(gene)) {
                String[] arr = currLine.split("\t");
                biocartaMap.put(arr[0], arr[1]);
            }
            currLine = input.readLine();
        }
        return biocartaMap;
    }

    public Map<String, String> getKegg(String gene) throws IOException {
        BufferedReader input = new BufferedReader(new InputStreamReader(getClass().getResourceAsStream("/c2.cp.kegg.v7.5.1.symbols.txt")));
        Map<String, String> keggMap = new HashMap<String, String>();

        String currLine = input.readLine();
        while (currLine != null) {
            if (currLine.contains(gene)) {
                String[] arr = currLine.split("\t");
                keggMap.put(arr[0], arr[1]);
            }
            currLine = input.readLine();
        }
        return keggMap;
    }

    public Map<String, String> getPid(String gene) throws IOException {
        BufferedReader input = new BufferedReader(new InputStreamReader(getClass().getResourceAsStream("/c2.cp.pid.v7.5.1.symbols.txt")));
        Map<String, String> pidMap = new HashMap<String, String>();

        String currLine = input.readLine();
        while (currLine != null) {
            if (currLine.contains(gene)) {
                String[] arr = currLine.split("\t");
                pidMap.put(arr[0], arr[1]);
            }
            currLine = input.readLine();
        }
        return pidMap;
    }

    public Map<String, String> getReactome(String gene) throws IOException {
        BufferedReader input = new BufferedReader(new InputStreamReader(getClass().getResourceAsStream("/c2.cp.reactome.v7.5.1.symbols.txt")));
        Map<String, String> reactomeMap = new HashMap<String, String>();

        String currLine = input.readLine();
        while (currLine != null) {
            if (currLine.contains(gene)) {
                String[] arr = currLine.split("\t");
                reactomeMap.put(arr[0], arr[1]);
            }
            currLine = input.readLine();
        }
        return reactomeMap;
    }
}
