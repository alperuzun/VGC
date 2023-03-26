package com.example.variantgraphcraftbackend.controller;

import com.example.variantgraphcraftbackend.model.*;
import com.example.variantgraphcraftbackend.service.ParseHelper;
import com.example.variantgraphcraftbackend.service.ServiceHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/nodeview")
public class NodeController {

    private ServiceHandler handler;

    @Autowired
    public NodeController(ServiceHandler handler) {
        System.out.println("Constructor of NodeController called.");
        this.handler = handler;
    }

    /**
     * File format: 'gene,gene,gene...' OR with multiple lines.
     */
    @GetMapping("get-node-graph-gene-file")
    public NodeViewWrapper getGeneFileNodeGraph(String path, String passFilter, boolean HR, boolean HT, boolean HA) {
        System.out.println("NODECONTROLLER METHOD getGeneFileNodeGraph CALLED");
        System.out.println("Path: " + path);
        System.out.println("FILTER: " + passFilter);

        try {
            ArrayList<String> geneInfo = this.processGeneFile(path);
            NodeViewWrapper wrapper = new NodeViewWrapper(geneInfo.size());
            for (String gene : geneInfo) {
                NodeView nodeView = this.handler.displayGraphByGene(gene, passFilter, HR, HT, HA);
                wrapper.addEntity(gene, nodeView);
            }
            return wrapper;
        } catch (IOException e) {
            System.out.println("IOException in getGeneFileNodeGraph of NodeController.");
            e.printStackTrace();
        }

        return null;
    }

    /**
     * File format:
     * chr:pos,pos,pos...
     * chr:pos,pos,...
     */
    @GetMapping("get-node-graph-pos-file")
    public NodeViewWrapper getPosFileNodeGraph(String path, String passFilter, boolean HR, boolean HT, boolean HA) {
        System.out.println("NODECONTROLLER METHOD getPosFileNodeGraph CALLED");
        System.out.println("Path is: " + path);

        try {
        HashMap<String, Set<Integer>> queryInfo = this.processPosFile(path);
            Set<String> chromosomes = new HashSet<String>(queryInfo.keySet());

            //Count size:
            int size = 0;
            for (String c : chromosomes) {
                Set<Integer> variants = new HashSet<Integer>(queryInfo.get(c));
                for (int var : variants) {
                    size = size + 1;
                }
            }

            NodeViewWrapper wrapper = new NodeViewWrapper(size);
            for (String c : chromosomes) {
                Set<Integer> variants = new HashSet<Integer>(queryInfo.get(c));
                for (int var : variants) {
                    String query = c + ":" + var + "-" + var;
                    NodeView nodeView = this.handler.displayGraphByRange(c, var, var, passFilter, HR, HT, HA);
                    wrapper.addEntity(query, nodeView);
                }
            }
            return wrapper;

        } catch (IOException e) {
            System.out.println("IOException in getHeatMapForPosFile.");
            e.printStackTrace();
        }
        return null;
    }

    @GetMapping("gene-node-graph")
    public NodeView getGeneNodeGraph(String gene, String passFilter, String HR, String HT, String HA) {
        System.out.println("NODECONTROLLER METHOD GETGENENODEGRAPH CALLED");

        System.out.println("Gene is: " + gene);
        System.out.println("BOOLEANS: " + HR + HT + HA);
        System.out.println("BOOLEANS: " + Boolean.parseBoolean(HR));

        try {
            return this.handler.displayGraphByGene(gene, passFilter, Boolean.parseBoolean(HR),
                                                                        Boolean.parseBoolean(HT),
                                                                        Boolean.parseBoolean(HA));
        } catch(IOException e) {
            System.out.println("IOException in getGeneNodeGraph pf NodeController.");
            e.printStackTrace();
        }
        return null;
    }

    @GetMapping("range-node-graph")
    public NodeView getRangeNodeGraph(String range, String passFilter, boolean HR, boolean HT, boolean HA) {
        System.out.println("NODECONTROLLER METHOD GETGENENODEGRAPH CALLED");
        try {
            ParseHelper helper = new ParseHelper();
            range = range.trim();
            String chr = range.substring(0, range.indexOf(":"));
            chr = chr.trim();
            String start = range.substring(range.indexOf(":") + 1, range.indexOf("-"));
            start = start.trim();
            String end = range.substring(range.indexOf("-") + 1);
            end = end.trim();
            if (helper.chrExists(chr) && Integer.valueOf(end) - Integer.valueOf(start) <= 10000) {
                return  this.handler.displayGraphByRange(chr, Integer.valueOf(start), Integer.valueOf(end), passFilter, HR, HT, HA);
            } else {
                return null;
            }
        } catch(IOException e) {
            System.out.println("IOException in getGeneNodeGraph pf NodeController.");
            e.printStackTrace();
            return null;
        } catch (NumberFormatException n) {
            return null;
        }
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
            System.out.println("Line: " + currLine);
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

