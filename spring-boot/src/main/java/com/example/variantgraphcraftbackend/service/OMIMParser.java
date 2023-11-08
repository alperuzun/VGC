package com.example.variantgraphcraftbackend.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class OMIMParser {

    public OMIMParser() {

    }

    public void getOMIMInfo(String gene) {

    }

    public String getGeneAssociation(String gene) throws IOException {
        String mim = this.getMIMNumber(gene);
        return this.getDiseaseAssociation(mim);
    }

    private String getMIMNumber(String gene) throws IOException {
        BufferedReader input = new BufferedReader(new InputStreamReader(getClass().getResourceAsStream("/mim2gene_filtered.txt")));

        String currLine;
        currLine = input.readLine();
        currLine = input.readLine();

        while (currLine != null) {
            String[] arr = currLine.split("\t");
            if (arr.length > 2) {

                if (gene.equals(arr[2])) {
                    return arr[0];
                }
            }
            currLine = input.readLine();
        }
        return "Not Found";
    }

    private String getDiseaseAssociation(String MIMNumber) throws IOException {
        BufferedReader input = new BufferedReader(new InputStreamReader(getClass().getResourceAsStream("/mimTitles.txt")));

        String currLine;
        currLine = input.readLine();
        currLine = input.readLine();
        currLine = input.readLine();


        while (currLine != null) {
            String[] arr = currLine.split("\t");
//            System.out.println(arr);
            if (arr.length > 2) {
                if (MIMNumber.equals(arr[1])) {
                    return arr[2].split(";")[0];
                }
            }
            currLine = input.readLine();
        }
        return "Not Found";
    }
}
