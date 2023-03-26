package com.example.variantgraphcraftbackend.controller;

import com.example.variantgraphcraftbackend.model.*;
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
@RequestMapping("/treeview")
public class TreeController {

    private ServiceHandler handler;

    @Autowired
    public TreeController(ServiceHandler handler) {
        System.out.println("Constructor of TreeController called.");
        this.handler = handler;
    }

    @GetMapping("get-tree-for-gene-file")
    public TreeViewWrapper getTreeForGeneFile(String path, String passFilter) {
        try {
            ArrayList<String> geneInfo = this.processGeneFile(path);
            TreeViewWrapper wrapper = new TreeViewWrapper(geneInfo.size());
            for (String gene : geneInfo) {
                TreeView treeView = this.handler.generateTree(MapState.GENE, passFilter, null, gene, null, null);
                wrapper.addEntity(gene, treeView);
            }
            return wrapper;
        } catch (IOException e) {
            System.out.println("IOException in getTreeForGeneFile of TreeController.");
            e.printStackTrace();
        }
        return null;
    }

    @GetMapping("get-tree-for-gene")
    public TreeView getTreeForGene(String passFilter, String gene) {
        System.out.println("TREECONTROLLER METHOD GETTREEFORGENE CALLED");

        gene = gene.trim();
//        ArrayList<String> geneList = new ArrayList<String>();
//        geneList.add(gene);
        System.out.println("Filter is: " + passFilter);
        System.out.println("Gene is: " + gene);

        try {
            return this.handler.generateTree(MapState.GENE, passFilter, null, gene, null, null);
        } catch(IOException e) {
            System.out.println("IOException in getheatmapall pf SampleController.");
            e.printStackTrace();
        }
        return null;
    }


    @GetMapping("get-tree-for-range")
    public TreeView getTreeForRange(String passFilter, String range) {
        System.out.println("TREECONTROLLER METHOD GETTREEFORRANGE CALLED");

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

            return this.handler.generateTree(MapState.RANGE, passFilter, chr, null, start, end);
        } catch(IOException e) {
            System.out.println("IOException in getHeatMapForRange of SampleController.");
            e.printStackTrace();
        } catch (IndexOutOfBoundsException e) {
            System.out.println("IndexOutOfBoundsException in getHeatMapForRange of SampleController");
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


}

