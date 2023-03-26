package com.example.variantgraphcraftbackend.model.filemanager;

import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;

public class PhenotypeReader {

    private String path;
    private String currLine;
    private File phenotype;
    private BufferedReader input;
    private ArrayList<String[]> fileArr;
    private HashMap<String, String> patientToGroupMap;
    private HashMap<String, ArrayList<String>> groupToPatientsMap;

    public PhenotypeReader(String path) throws FileNotFoundException {
        this.path = path;
        this.currLine= "";
        this.phenotype = new File(path);
        this.input = new BufferedReader(new FileReader(this.phenotype));
        this.fileArr = new ArrayList<String[]>();
        this.patientToGroupMap = new HashMap<String, String>();
        this.groupToPatientsMap = new HashMap<String, ArrayList<String>>();
    }

    public ArrayList<String[]> readPhenotype() throws IOException {
        this.currLine = this.input.readLine();
        while(this.currLine != null) {
            String[] newLine = this.currLine.split("\t");
            this.fileArr.add(newLine);
            this.patientToGroupMap.put(newLine[0], newLine[1]);
            this.updateMap(newLine[0], newLine[1]);
            this.currLine = this.input.readLine();
        }
        this.input.close();
        System.out.println("Phenotype file retrieved and read.");
        System.out.println("Groups to patients map: ");
        System.out.println(this.groupToPatientsMap);
        return this.fileArr;
    }

    private void updateMap(String patient, String group) {
        if (this.groupToPatientsMap.containsKey(group)) {
            this.groupToPatientsMap.get(group).add(patient);
        } else {
            ArrayList<String> newGroup = new ArrayList<String>();
            newGroup.add(patient);
            this.groupToPatientsMap.put(group, newGroup);
        }
    }

    public HashMap<String, ArrayList<String>> getGroupToPatientsMap() {
        return this.groupToPatientsMap;
    }

    public String getGroup(String patient) {
        return this.patientToGroupMap.get(patient);
    }

    public HashSet getGroupList() {
        return new HashSet(this.patientToGroupMap.values());
    }
}
