package com.example.variantgraphcraftbackend.model.filemanager;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;

public class InfoWriter {

    private BufferedWriter writer;
    private File index;
    private ArrayList<String> infoList;

    /**
     * The BufferedWriter, index File, and infoList are all initialized
     * here.
     * @param index the file to be written to.
     */
    public InfoWriter(File index) throws IOException{
        this.infoList = new ArrayList<String>();
        this.index = index;
        this.writer = new BufferedWriter(new FileWriter(this.index));
    }

    /**
     * Adds the VCF file version to the infoList.
     * @param currLine
     */
    public void addVersion(String currLine) {
        String version = currLine.substring(17);
        this.infoList.add(version);
    }

    /**
     * Adds the header fields & number of patients to the infoList.
     * @param currLine
     */
    public void addHeader(String currLine) {
        String fieldVal = currLine.substring(0, currLine.indexOf("FORMAT") + 7);
        this.infoList.add(fieldVal);

        String sampleString = currLine.substring(currLine.indexOf("FORMAT") + 7);
        String[] sampleData = sampleString.split("\t");
        System.out.println(sampleData);
        this.infoList.add(sampleString);
        this.infoList.add(String.valueOf(sampleData.length));
    }

    /**
     * Adds the total number of chromosomes & list of individual chromosomes to the
     * infoList as Strings. The individual chromosome numbers are sorted by their
     * String value.
     * @param chromNumber
     * @param chromList
     */
    public void addChrom(int chromNumber, ArrayList<String> chromList) {
        this.infoList.add(String.valueOf(chromNumber));
        Collections.sort(chromList);

        for (String key : chromList) {
            this.infoList.add(key);
        }
    }


    /**
     * Writes the contents of infoList.
     */
    public void writeInfo() throws IOException{
        for (String s : this.infoList) {
            this.writer.write(s);
            this.writer.newLine();
        }
        this.writer.flush();
        this.writer.close();
    }
}
