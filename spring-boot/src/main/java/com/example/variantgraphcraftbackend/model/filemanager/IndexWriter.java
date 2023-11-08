package com.example.variantgraphcraftbackend.model.filemanager;

import com.example.variantgraphcraftbackend.service.ParseHelper;
import com.example.variantgraphcraftbackend.service.PathogenicParser;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;

public class IndexWriter {

    private File info;
    private BufferedWriter writer;
    private String currChrom;
//    private String prevLine;
    private int chromCounter;
    private HashMap<String, String> indexData;
    private ArrayList<String> chromList;
    private HashMap<String, Integer> numPassVariants;
    private HashMap<String, Integer> numPathVariants;



    public IndexWriter(File info) throws IOException{
        this.currChrom = null;
//        this.prevLine = null;
        this.chromCounter = 0;
        this.chromList = new ArrayList<String>();
        this.indexData = new HashMap<String, String>();
        this.info = info;
        this.writer = new BufferedWriter(new FileWriter(this.info));
        this.numPassVariants = new HashMap<String, Integer>();
        this.numPathVariants = new HashMap<String, Integer>();
    }

    /**
     * Proccesses a given variant in the vcf file.
     */
    public void buildChromData(String prevLine, String currLine, int lineNumber, PathogenicParser pathogenicParser) throws IndexOutOfBoundsException {
        //Handles chromosome number
        String newChrom = currLine.substring(0, currLine.indexOf("\t"));
        newChrom = newChrom.toLowerCase();
        if (newChrom.startsWith("chr")) {
            newChrom = newChrom.substring(3);
        }
        newChrom = newChrom.toUpperCase();
        ParseHelper parseHelper = new ParseHelper();
        if (parseHelper.chrExists(newChrom)) {
            if (this.currChrom == null) {
                this.indexData.put(newChrom, this.getChromStart(currLine, lineNumber));
                this.currChrom = newChrom;
                this.chromCounter++;
            } else if (!newChrom.equals(this.currChrom)) {
                this.indexData.replace(this.currChrom, this.indexData.get(this.currChrom) + this.getChromEnd(prevLine, lineNumber - 1));
                this.indexData.put(newChrom, this.getChromStart(currLine, lineNumber));
                this.currChrom = newChrom;
                this.chromCounter++;
            }
            this.handleFilter(currLine, pathogenicParser);
        } 
    }


    public void addLastChrom(String currLine, int lineNumber) {
        this.indexData.replace(this.currChrom, this.indexData.get(this.currChrom) + this.getChromEnd(currLine, lineNumber));
        this.chromList = new ArrayList<String>(this.indexData.keySet());
        Collections.sort(this.chromList);
    }

    private void handleFilter(String currLine, PathogenicParser pathogenicParser) {
        String[] split = currLine.split("\t");
        String filterVal = split[6];
        String pos = split[1];
        if (filterVal.equals("PASS")) {
            if (this.numPassVariants.containsKey(this.currChrom)) {
                this.numPassVariants.put(this.currChrom, this.numPassVariants.get(this.currChrom) + 1);
            } else {
                this.numPassVariants.put(this.currChrom, 1);
            }
        }
        if (pathogenicParser.isPathogenic(this.currChrom, pos)) {
            if (this.numPathVariants.containsKey(this.currChrom)) {
                this.numPathVariants.put(this.currChrom, this.numPathVariants.get(this.currChrom) + 1);
            } else {
                this.numPathVariants.put(this.currChrom, 1);
            }
        }
    }


    private String getChromStart(String currLine, int startLine) {
        int beginIndex = currLine.indexOf("\t") + 1;
        int endIndex = currLine.indexOf("\t", beginIndex);
        String startPos = currLine.substring(beginIndex, endIndex);

        String hashValue = String.valueOf(startLine) + "\t" + startPos;
        return hashValue;
    }

    private String getChromEnd(String currLine, int endLine) {
        int beginIndex = currLine.indexOf("\t") + 1;
        int endIndex = currLine.indexOf("\t", beginIndex);
        String endPos = currLine.substring(beginIndex, endIndex);

        String hashValue = "\t" + String.valueOf(endLine) + "\t" + endPos;
        return hashValue;
    }

    public void writeIndex() throws IOException{
        for (String key : this.chromList) {
            String line = key + "\t" + this.indexData.get(key) + "\t" + this.numPassVariants.get(key) + "\t" + this.numPathVariants.get(key);
            this.writer.write(line);
            this.writer.newLine();
        }
        this.writer.flush();
        this.writer.close();
    }

    public int getNumChrom() {
        return this.chromCounter;
    }

    public ArrayList<String> getChromList() {
        return this.chromList;
    }
}
