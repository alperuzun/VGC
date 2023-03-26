package com.example.variantgraphcraftbackend.model.filemanager;

import java.io.*;
import java.util.ArrayList;

public class InfoReader {

    private String path;
    private BufferedReader input;
    private File info;
    private String currLine;
    private ArrayList<String> infoData;


    /**
     * Instantiates all instance variables.
     * @param path the path of the info file
     * @throws FileNotFoundException
     */
    public InfoReader(String path) throws FileNotFoundException {
        System.out.println("Info created. Path is: " + path);
        this.path = path;
        this.currLine = "";
        this.info = new File(path);
        this.input = new BufferedReader(new FileReader(this.info));
        this.infoData = new ArrayList<>();
    }

    /**
     * Reads the info file and stores the lines in infoData.
     * @return
     * @throws IOException
     */
    public ArrayList<String> readInfo() throws IOException {
        this.currLine = this.input.readLine();
        while (this.currLine != null) {
            this.infoData.add(this.currLine);
            this.currLine = this.input.readLine();
        }
        this.input.close();
        System.out.println("Info read. InfoData:");
        System.out.println(this.infoData);
        return this.infoData; //check this
    }

    /**
     * Returns the VCF file version.
     * @return
     */
    public String getVersion() {
        System.out.println("InfoData: ");
        System.out.println(this.infoData);
        return this.infoData.get(0);
    }

    public String getFieldVals() {
        return this.infoData.get(1);
    }

    public String getAllPatients() {
        return this.infoData.get(2);
    }

    public String getFullHeader() {
        return this.infoData.get(1).concat(this.infoData.get(2));
    }

    /**
     * Returns the total number of patients/samples.
     * @return
     */
    public String getPatients() {
        return this.infoData.get(3);
    }

    /**
     * Returns the total number of chromosomes.
     * @return
     */
    public int getNumChrom() {
        return Integer.valueOf(this.infoData.get(4));
    }

    /**
     * Returns an ArrayList of chromosomes.
     * @return
     */
    public ArrayList<String> getChromosomes() {
        ArrayList<String> chromosomes = new ArrayList<String>();
        for (int i = 5; i < this.infoData.size(); i++) {
            chromosomes.add(this.infoData.get(i));
        }
        return chromosomes;
    }

}
