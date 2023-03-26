package com.example.variantgraphcraftbackend.model.filemanager;

import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;

public class IndexReader {

    private String path;
    private BufferedReader input;
    private File index;
    private String currLine;
    private ArrayList<String[]> indexArr;
    private HashMap<String, Integer> chromMap;
    private HashMap<String, Integer> passFilterMap;
    private HashMap<String, Integer> pathFilterMap;
    private HashMap<String, String[]> indexMap;

    public IndexReader(String path) throws FileNotFoundException {
        this.path = path;
        this.currLine = "";
        this.index = new File(path);
        this.input = new BufferedReader(new FileReader(this.index));
        this.indexArr = new ArrayList<String[]>();
        this.chromMap = new HashMap<String, Integer>();
        this.passFilterMap = new HashMap<String, Integer>();
        this.pathFilterMap = new HashMap<String, Integer>();
        this.indexMap = new HashMap<String, String[]>();
    }



    public ArrayList<String[]> readIndex() throws IOException {
        this.currLine = this.input.readLine();
        while(this.currLine != null) {
            String[] lineArr = this.currLine.split("\t");
            String[] indexMapVals = new String[4];
            for (int i = 1; i < 4; i++) {
                indexMapVals[i - 1] = lineArr[i];
            }
            this.indexArr.add(lineArr);
            this.chromMap.put(lineArr[0], Integer.valueOf(lineArr[3]) - Integer.valueOf(lineArr[1]) + 1);
            // this.passFilterMap.put(lineArr[0], Integer.valueOf(lineArr[5]));
            if (!lineArr[5].equals("null")) {
                this.pathFilterMap.put(lineArr[0], Integer.valueOf(lineArr[5]));
            } else {
                this.pathFilterMap.put(lineArr[0], 0);
            }
            if (!lineArr[6].equals("null")) {
                this.pathFilterMap.put(lineArr[0], Integer.valueOf(lineArr[6]));
            } else {
                this.pathFilterMap.put(lineArr[0], 0);
            }
            this.indexMap.put(lineArr[0], indexMapVals);
            this.currLine = this.input.readLine();
        }
        this.input.close();
        System.out.println("Index retrieved and read.");
        return this.indexArr;
    }

    public int getTotalVariants() {
        int lastVar = Integer.valueOf(this.indexArr.get(this.indexArr.size() - 1)[3]);
        int firstVar = Integer.valueOf(this.indexArr.get(0)[1]);
        return lastVar - firstVar + 1;
    }

    public int getVariants(String chrom) {
        return this.chromMap.get(chrom);
    }

    public HashMap<String, Integer> getChromMap() {
        return this.chromMap;
    }

    public HashMap<String, Integer> getPassMap() {
        return this.passFilterMap;
    }

    public HashMap<String, Integer> getPathMap() {
        return this.pathFilterMap;
    }

    public int getStartLine(String chromosome) {
        System.out.println(this.indexMap.keySet());
        System.out.println("Chromosome is: " + chromosome);
        return Integer.valueOf(this.indexMap.get(chromosome)[0]);
    }

    public int getEndLine(String chromosome) {
        return Integer.valueOf(this.indexMap.get(chromosome)[2]);
    }

    public int getFileStart() {
        return Integer.valueOf(this.indexArr.get(0)[1]);
    }

    public int getFileEnd() {
        return Integer.valueOf(this.indexArr.get(this.indexArr.size() - 1)[3]);
    }
}
