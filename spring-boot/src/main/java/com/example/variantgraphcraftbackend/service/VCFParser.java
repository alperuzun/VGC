package com.example.variantgraphcraftbackend.service;
import com.example.variantgraphcraftbackend.model.UploadedFile;
import com.example.variantgraphcraftbackend.model.filemanager.*;

import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class VCFParser {

    private HashMap<UploadedFile, InfoReader> infoMap;
    private HashMap<UploadedFile, IndexReader> indexMap;

    public VCFParser(HashMap<UploadedFile, InfoReader> infoMap,
                     HashMap<UploadedFile, IndexReader> indexMap) throws FileNotFoundException {
        this.infoMap = infoMap;
        this.indexMap = indexMap;
    }

    public void processSelectedFile(UploadedFile file) throws IOException {
        String storePath = this.makeGeneratedFilesDirectory();

        File vcf = new File(file.getPath());
        String name = vcf.getName();
        name = name.substring(0, name.length() - 4);

        String directoryPath = storePath + "/VGC_" + name;
        File info = new File(directoryPath + "/info_" + name + ".txt");
        File index = new File(directoryPath + "/index_" + name + ".txt");

        if(!info.exists() && !index.exists()) {
            File directory = new File(directoryPath);

            if (!directory.exists()) {
                directory.mkdir();
            }

            InfoWriter infoWriter = new InfoWriter(info);
            IndexWriter indexWriter = new IndexWriter(index);
            this.read(file, infoWriter, indexWriter);
            infoWriter.addChrom(indexWriter.getNumChrom(), indexWriter.getChromList());
            infoWriter.writeInfo();
            indexWriter.writeIndex();
        }

        InfoReader infoReader = new InfoReader(info.getAbsolutePath());
        IndexReader indexReader= new IndexReader(index.getAbsolutePath());
        infoReader.readInfo();
        indexReader.readIndex();
        this.infoMap.put(file, infoReader);
        this.indexMap.put(file, indexReader);
    }

    private String makeGeneratedFilesDirectory() {
        String userHome = System.getProperty("user.home");
        String directoryName = "VGCGeneratedFiles";
        String directoryPath = userHome + File.separator + directoryName;

        File directory = new File(directoryPath);
        if (!directory.exists()) {
            if (directory.mkdirs()) {
                System.out.println("Directory created successfully: " + directoryPath);
            } else {
                System.out.println("Failed to create the directory: " + directoryPath);
            }
        } else {
            System.out.println("Directory already exists: " + directoryPath);
        }
        return directoryPath;
    }


    /**
     * Initial read of an added vcf file. Called once a new
     * UploadedFile is saved to the FileRepository.
     */
    private void read(UploadedFile file, InfoWriter infoWriter, IndexWriter indexWriter) throws IOException {
        String currLine = "";
        String prevLine = "";
        int lineNumber = 0;
        String path = file.getPath();
        File vcf = new File(path);
        BufferedReader input = new BufferedReader(new FileReader(vcf));
        PathogenicParser pathogenicParser = new PathogenicParser();
        pathogenicParser.loadMapping();

        // Updates version in InfoFile through UploadedFile.
        currLine = input.readLine();
        infoWriter.addVersion(currLine);

        // Reads rest of file + updates info/index accordingly.
        while(currLine != null) {
            lineNumber++;
            if (currLine.startsWith("##")) {
                // Is metadata
            } else if (currLine.startsWith("#CHROM")) {
                infoWriter.addHeader(currLine);
            } else {
                indexWriter.buildChromData(prevLine, currLine, lineNumber, pathogenicParser);
            }
            prevLine = currLine;
            currLine = input.readLine();
        }
        input.close();
        indexWriter.addLastChrom(prevLine, lineNumber);
    }

    public List<String[]> getLinesByTotal(int total, int startLine, int endLine, String vcf) throws IOException{
        List<String[]> varList = new ArrayList<String[]>();
        int counter = 0;
        BufferedReader input = new BufferedReader(new FileReader(vcf));
        String currLine = input.readLine();
        counter++;
        while(currLine != null) {
            if(counter >= startLine) {
                if(counter > endLine || counter >= (startLine + total)) {
                    input.close();
                    return varList;
                }
                String[] split = currLine.split("\t");
                varList.add(split);

            }
            currLine = input.readLine();
            counter++;
        }
        input.close();
        return varList;
    }

    public List<String[]> getLines(int startLine, int endLine, String passFilter, String vcf) throws IOException {
        List<String[]> varList = new ArrayList<String[]>();

        BufferedReader input = new BufferedReader(new FileReader(vcf));
        String currLine = input.readLine();
        int counter = 1;
        if (passFilter.equals("ALL")) {
            while(currLine != null) {
                if(counter >= startLine) {
                    if(counter > endLine) {
                        input.close();
                        return varList;
                    }
                    String[] split = currLine.split("\t");
                    varList.add(split);
                }
                currLine = input.readLine();
                counter++;
            }
        } else {
            while(currLine != null) {
                if(counter >= startLine) {
                    if(counter > endLine) {
                        input.close();
                        return varList;
                    }
                    String[] split = currLine.split("\t");
                    if (split[6].equals(passFilter)) {
                        varList.add(split);
                    }
                }
                currLine = input.readLine();
                counter++;
            }
        }
        input.close();
        return varList;
    }

    public List<String[]> getLinesByPos(String chr, int startLine, int endLine, int startPos, int endPos, String passFilter, String vcf) throws IOException {
        List<String[]> varList = new ArrayList<String[]>();
        int counter = 0;
        BufferedReader input = new BufferedReader(new FileReader(vcf));
        String currLine = input.readLine();
        counter++;
        if (passFilter.equals("ALL")) {
            while(currLine != null) {
                if(counter >= startLine) {
                    if(counter > endLine) {
                        input.close();
                        return varList;
                    }
                    String[] split = currLine.split("\t");
                    int currPos = Integer.valueOf(split[1]);
                    if (currPos >= startPos && currPos <= endPos) {
                        varList.add(split);
                    }
                }
                currLine = input.readLine();
                counter++;
            }
        } else if (passFilter.equals("PASS")){
            while(currLine != null) {
                if(counter >= startLine) {
                    if(counter > endLine) {
                        input.close();
                        return varList;
                    }
                    String[] split = currLine.split("\t");
                    int currPos = Integer.valueOf(split[1]);
                    if (currPos >= startPos && currPos <= endPos && split[6].equals(passFilter)) {
                        varList.add(split);
                    }
                }
                currLine = input.readLine();
                counter++;
            }
        } else {
            PathogenicParser pathogenicParser = new PathogenicParser();
            pathogenicParser.loadMapping();
            while(currLine != null) {
                if(counter >= startLine) {
                    if(counter > endLine) {
                        input.close();
                        return varList;
                    }
                    String[] split = currLine.split("\t");
                    int currPos = Integer.valueOf(split[1]);
                    if (currPos >= startPos && currPos <= endPos && pathogenicParser.isPathogenic(chr, split[1])) {
                        varList.add(split);
                    }
                }
                currLine = input.readLine();
                counter++;
            }
        }
        input.close();
        return varList;
    }

    private int getPos(String varLine) {
        String pos = varLine.split("\t")[1];
        return Integer.valueOf(pos);
    }


    public HashMap<Integer, ArrayList<String[]>> getChromHistrogramData(String chr, int range, HashMap<Integer, Integer> histogramData,
                                                                       HashMap<Integer, ArrayList<String[]>> posMap,
                                                                       int startLine, int endLine, int start, int end,
                                                                       String passFilter, String vcf) throws IOException {
        int counter = 0;
        BufferedReader input = new BufferedReader(new FileReader(vcf));
        String currLine = input.readLine();
        counter++;
        if (passFilter.equals("ALL")) {
            while(currLine != null) {
                if(counter >= startLine) {
                    if(counter > endLine) {
                        input.close();
                        return posMap;
                    }
                    String[] variantArray = currLine.split("\t");
                    int pos = Integer.valueOf(variantArray[1]);
                    if (pos >= start && pos <= end) {
                        int rounded = pos / range;
                        rounded = rounded * range;
                        histogramData.put(rounded, histogramData.get(rounded) + 1);
                        posMap.get(rounded).add(variantArray);
                    }
                }
                currLine = input.readLine();
                counter++;
            }
        } else if (passFilter.equals("PASS")){
            while(currLine != null) {
                if(counter >= startLine) {
                    if(counter > endLine) {
                        input.close();
                        return posMap;
                    }
                    String[] variantArray = currLine.split("\t");
                    int pos = Integer.valueOf(variantArray[1]);
                    String filter = variantArray[6];
                    if (pos >= start && pos <= end && filter.equals(passFilter)) {
                        int rounded = pos / range;
                        rounded = rounded * range;
                        histogramData.put(rounded, histogramData.get(rounded) + 1);
                        posMap.get(rounded).add(variantArray);
                    }
                }
                currLine = input.readLine();
                counter++;
            }
        } else {
            PathogenicParser pathogenicParser = new PathogenicParser();
            pathogenicParser.loadMapping();
            while(currLine != null) {
                if(counter >= startLine) {
                    if(counter > endLine) {
                        input.close();
                        return posMap;
                    }
                    String[] variantArray = currLine.split("\t");
                    int pos = Integer.valueOf(variantArray[1]);
                    if (pos >= start && pos <= end && pathogenicParser.isPathogenic(chr, variantArray[1])) {
                        int rounded = pos / range;
                        rounded = rounded * range;
                        histogramData.put(rounded, histogramData.get(rounded) + 1);
                        posMap.get(rounded).add(variantArray);
                    }
                }
                currLine = input.readLine();
                counter++;
            }
        }
        input.close();
        return posMap;
    }

    public HashMap<Integer, Integer> getChromHistrogramData(String chr, int range, HashMap<Integer, Integer> histogramData,
                                                            int startLine, int endLine, String passFilter, String vcf) throws IOException {
        PathogenicParser pathogenicParser = new PathogenicParser();
        pathogenicParser.loadMapping();
        int counter = 0;
        BufferedReader input = new BufferedReader(new FileReader(vcf));
        String currLine = input.readLine();
        counter++;
        while(currLine != null) {
            if(counter >= startLine) {
                if(counter > endLine) {
                    input.close();
                    return histogramData;
                }
                String[] variantArray = currLine.split("\t");
                int pos = Integer.valueOf(variantArray[1]);
                if (passFilter.equals("ALL")) {
                    int rounded = pos / range;
                    rounded = rounded * range;
                    histogramData.put(rounded, histogramData.get(rounded) + 1);
                } else if (passFilter.equals("PASS")){
                    String filter = variantArray[6];
                    if (filter.equals(passFilter)) {
                        int rounded = pos / range;
                        rounded = rounded * range;
                        histogramData.put(rounded, histogramData.get(rounded) + 1);
                    }
                } else {
                    if (pathogenicParser.isPathogenic(chr, variantArray[1])) {
                        int rounded = pos / range;
                        rounded = rounded * range;
                        histogramData.put(rounded, histogramData.get(rounded) + 1);
                    }
                }
            }
            currLine = input.readLine();
            counter++;
        }
        input.close();
        return histogramData;
    }

    public void saveToMap(HashMap<String, String[]> saveMap, String[] var, String chr) {
        saveMap.put(chr, var);
    }

    public String getVersion(UploadedFile file) {
        return this.infoMap.get(file).getVersion();
    }

    public String getNumPatients(UploadedFile file) {
        return this.infoMap.get(file).getPatients();
    }

    public int getChromosomes(UploadedFile file) {
        return this.infoMap.get(file).getNumChrom();
    }
}
