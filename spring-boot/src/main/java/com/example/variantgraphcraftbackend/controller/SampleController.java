package com.example.variantgraphcraftbackend.controller;


import com.example.variantgraphcraftbackend.model.MapState;
import com.example.variantgraphcraftbackend.model.MapView;
import com.example.variantgraphcraftbackend.model.NodeView;
import com.example.variantgraphcraftbackend.service.ServiceHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.lang.reflect.Array;
import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/mapview")
public class SampleController {

    private ServiceHandler handler;

    @Autowired
    public SampleController(ServiceHandler handler) {
        System.out.println("Constructor of SampleController called.");
        this.handler = handler;
    }

    @GetMapping("get-heat-map-all")
    public MapView getHeatMapAll(String passFilter) {
        System.out.println("SAMPLECONTROLLER METHOD GETHEATMAPALL CALLED");

        System.out.println("Filter is: " + passFilter);

//        try {
//
//        } catch(IOException e) {
//            System.out.println("IOException in getheatmapall pf SampleController.");
//            e.printStackTrace();
//        }
        return null;
    }

    @GetMapping("get-heat-map-chr")
    public MapView getHeatMapForChr(String passFilter, String chr) {
        System.out.println("SAMPLECONTROLLER METHOD GETHEATMAPALL CALLED");

        System.out.println("Filter is: " + passFilter);

//        try {
//
//        } catch(IOException e) {
//            System.out.println("IOException in getheatmapall pf SampleController.");
//            e.printStackTrace();
//        }
        return null;
    }

    /**
     * File format: 'gene,gene,gene...' OR with multiple lines.
     */
    @GetMapping("get-heat-map-gene-file")
    public MapView getHeatMapForGeneFile(String path, String passFilter) {
        System.out.println("SAMPLECONTROLLER METHOD GETHEATMAPFORGENEFILE CALLED");
        System.out.println("Path: " + path);
        System.out.println("FILTER: " + passFilter);

        try {
            ArrayList<String> geneInfo = this.processGeneFile(path);
            System.out.println(geneInfo);
            return this.handler.generateHeatMap(MapState.GENE, passFilter, new ArrayList<String>(), geneInfo, null, null);
        } catch (IOException e) {
            System.out.println("IOException in getHeatMapForGeneFile of SampleController.");
            e.printStackTrace();
        }

        return null;
    }

    /**
     * File format:
     * chr:pos,pos,pos...
     * chr:pos,pos,...
     */
    @GetMapping("get-heat-map-pos-file")
    public MapView getHeatMapForPosFile(String path, String passFilter) {
        System.out.println("SAMPLECONTROLLER METHOD GETHEATMAPFORPOSFILE CALLED");

        try {
            HashMap<String, Set<Integer>> queryInfo = this.processPosFile(path);
            ArrayList<String> chr = new ArrayList<String>();
            ArrayList<Integer> start = new ArrayList<Integer>();
            ArrayList<Integer> end = new ArrayList<Integer>();
            queryInfo.forEach((k, v) -> {
                ArrayList<String> tempChr = new ArrayList<String>(Arrays.asList(new String[v.size()]));
                Collections.fill(tempChr, k);
                chr.addAll(tempChr);
//                chr.add(k);
                start.addAll(new ArrayList<Integer>(v));
                end.addAll(new ArrayList<Integer>(v));
            });
            return this.handler.generateHeatMap(MapState.RANGE, passFilter, chr, null, start, end);

        } catch (IOException e) {
            System.out.println("IOException in getHeatMapForPosFile.");
            e.printStackTrace();
        }
        return null;
    }

    @GetMapping("get-heat-map-range")
    public MapView getHeatMapForRange(String passFilter, String range) {
        System.out.println("SAMPLECONTROLLER METHOD GETHEATMAPALL CALLED");

        System.out.println("Filter is: " + passFilter);
        System.out.println("Range is: " + range);

        try {
            range = range.trim();
            String chr = range.substring(0, range.indexOf(":"));
            chr = chr.trim();
            String start = range.substring(range.indexOf(":") + 1, range.indexOf("-"));
            start = start.trim();
            String end = range.substring(range.indexOf("-") + 1);
            end = end.trim();

            ArrayList<String> chrList = new ArrayList<String>();
            ArrayList<Integer> startList = new ArrayList<Integer>();
            ArrayList<Integer> endList = new ArrayList<Integer>();
            chrList.add(chr);
            startList.add(Integer.valueOf(start));
            endList.add(Integer.valueOf(end));

            return this.handler.generateHeatMap(MapState.RANGE, passFilter, chrList, null, startList, endList);
        } catch(IOException e) {
            System.out.println("IOException in getHeatMapForRange of SampleController.");
            e.printStackTrace();
        } catch (IndexOutOfBoundsException e) {
            System.out.println("IndexOutOfBoundsException in getHeatMapForRange of SampleController");
            e.printStackTrace();
        }
        return null;
    }

    @GetMapping("get-heat-map-gene")
    public MapView getHeatMapForGene(String passFilter, String gene) {
        System.out.println("SAMPLECONTROLLER METHOD GETHEATMAPGENE CALLED");

        gene = gene.trim();
        ArrayList<String> geneList = new ArrayList<String>();
        geneList.add(gene);
        System.out.println("Filter is: " + passFilter);
        System.out.println("Gene is: " + gene);

        try {
            return this.handler.generateHeatMap(MapState.GENE, passFilter, new ArrayList<String>(), geneList, null, null);
        } catch(IOException e) {
            System.out.println("IOException in getheatmapall pf SampleController.");
            e.printStackTrace();
        }
        return null;
    }

    private ArrayList<String> processGeneFile(String path) throws IOException {
        ArrayList<String> processedArray = new ArrayList<String>();
        BufferedReader input = new BufferedReader(new FileReader(path));
        String currLine = input.readLine();
        while (currLine != null) {
            String[] geneArray = currLine.split(",");
            for (String gene : geneArray) {
                processedArray.add(gene.trim());
            }
            currLine = input.readLine();
        }
        return processedArray;
    }

    private HashMap<String, Set<Integer>> processPosFile(String path) throws IOException {
        HashMap<String, Set<Integer>> processedMap = new HashMap<String, Set<Integer>>();
        BufferedReader input = new BufferedReader(new FileReader(path));
        String currLine = input.readLine();
        while (currLine != null) {
            String[] chrPosSeparation = currLine.split(":");
            String chr = chrPosSeparation[0];
            String[] separation = chrPosSeparation[1].split(",");
            Set<Integer> newPosSet = new HashSet<Integer>();
            for (String pos : separation) {
                newPosSet.add(Integer.valueOf(pos.trim()));
            }
            if (processedMap.containsKey(chr)) {
                processedMap.get(chr).addAll(newPosSet);
            } else {
                processedMap.put(chr, newPosSet);
            }
            currLine = input.readLine();
        }
        return processedMap;
    }
}
