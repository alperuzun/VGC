package com.example.variantgraphcraftbackend.model;

import javax.persistence.*;
import java.util.*;

@Entity
public class IndexFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String currChrom;
    private int chromCounter;
    @ElementCollection
    private Map<String, String> indexData;
    @ElementCollection
    private List<String> chromList;

    @ElementCollection
    private Map<String, Integer> chromToVarMap;
    @ElementCollection
    private List<String> tempRow;

    public IndexFile() {

    }

    public IndexFile(String parentPath) {
        this.currChrom = null;
        this.chromCounter = 0;
        this.chromList = new ArrayList<String>();
        this.indexData = new HashMap<String, String>();

        this.tempRow = new ArrayList<String>();
        this.chromToVarMap = new HashMap<String, Integer>();
    }

    public void buildChromData(String currLine, int lineNumber) {
        //Gives the chrom number of the current line.
        String newChrom = currLine.substring(0, currLine.indexOf("\t"));
        //Handles the first chromosome in the vcf; updates this.currChrom
        if (this.currChrom == null) {
            this.tempRow.add(newChrom);
            this.indexData.put(newChrom, this.getChromStart(currLine, lineNumber));
            this.currChrom = newChrom;
            this.chromCounter++;
        } else if (!newChrom.equals(this.currChrom)) {
            this.indexData.replace(this.currChrom, this.indexData.get(currChrom) + this.getChromEnd(currLine, lineNumber));
            this.tempRow.add(newChrom);
            this.indexData.put(newChrom, this.getChromStart(currLine, lineNumber));
            this.currChrom = newChrom;
            this.chromCounter++;
        }
    }

    public void addLastChrom(String currLine, int lineNumber) {
        this.indexData.replace(this.currChrom, this.indexData.get(currChrom) + this.getChromEnd(currLine, lineNumber));
        this.chromList = new ArrayList<String>(this.indexData.keySet());
        Collections.sort(this.chromList);
    }


    private String getChromStart(String currLine, int startLine) {
        int beginIndex = currLine.indexOf("\t") + 1;
        int endIndex = currLine.indexOf("\t", beginIndex);
        String startPos = currLine.substring(beginIndex, endIndex);

        this.tempRow.add(String.valueOf(startLine));
        // this.tempRow.add(startPos);

        String hashValue = String.valueOf(startLine) + "\t" + startPos;
        return hashValue;
    }

    private String getChromEnd(String currLine, int endLine) {
        int beginIndex = currLine.indexOf("\t") + 1;
        int endIndex = currLine.indexOf("\t", beginIndex);
        String endPos = currLine.substring(beginIndex, endIndex);

        this.tempRow.add(String.valueOf(endLine));
        this.chromToVarMap.put(this.tempRow.get(0),
                Integer.valueOf(this.tempRow.get(2)) - Integer.valueOf(this.tempRow.get(1)) + 1);
        this.tempRow = new ArrayList<String>();
        // this.tempRow.add(endPos);

        String hashValue = "\t" + String.valueOf(endLine) + "\t" + endPos;
        return hashValue;
    }

    public int getNumChrom() {
        return this.chromCounter;
    }

    public List<String> getChromList() {
        return this.chromList;
    }

    public HashMap<String, Integer> getChromToVarMap() {
        HashMap<String, Integer> shallowCopy = new HashMap<String, Integer>(this.chromToVarMap);
        return shallowCopy;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }
}
