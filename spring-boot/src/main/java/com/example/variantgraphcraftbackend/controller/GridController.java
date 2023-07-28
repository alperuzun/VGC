package com.example.variantgraphcraftbackend.controller;

import com.example.variantgraphcraftbackend.model.*;
import com.example.variantgraphcraftbackend.service.ParseHelper;
import com.example.variantgraphcraftbackend.service.ServiceHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/gridview")
public class GridController {

    private ServiceHandler handler;

    @Autowired
    public GridController(ServiceHandler handler) {
        System.out.println("Constructor of GridController called.");
        this.handler = handler;
    }

    @GetMapping("variant-view")
    public GridView queryByRange(String range) {
        System.out.println("GRIDCONTROLLER METHOD QUERYBYRANGE CALLED");
        try {
            ParseHelper helper = new ParseHelper();
            range = range.trim();
            String chr = range.substring(0, range.indexOf(":"));
            chr = chr.trim();
            String start = range.substring(range.indexOf(":") + 1, range.indexOf("-"));
            start = start.trim();
            String end = range.substring(range.indexOf("-") + 1);
            end = end.trim();
            if (helper.chrExists(chr)) {
                return this.handler.displayGridView(chr, Integer.valueOf(start), Integer.valueOf(end));
            } else {
                return null;
            }
        } catch (IOException e) {
            System.out.println("IOException in queryByRange of GridController.");
            return null;
        } catch (NumberFormatException n) {
            return null;
        }
    }

    @GetMapping("gene-view")
    public GridView queryByGene(String gene) {
        System.out.println("GRIDCONTROLLER METHOD QUERYBYGENE CALLED");
        try {
            return this.handler.displayGeneView(gene);
        } catch (IOException e) {
            System.out.println("IOException in queryByGene of GridController.");
            return null;
        } catch (NumberFormatException n) {
            return null;
        }
    }

    @GetMapping("range-file-view")
    public GridView queryByRangeFile(String path) {
        System.out.println("GRIDCONTROLLER METHOD queryByRangeFile CALLED");
        try {
            ParseHelper helper = new ParseHelper();
            HashMap<String, Set<Integer>> queryInfo = helper.processPosFile(path);
            Set<String> chromosomes = new HashSet<String>(queryInfo.keySet());

            int size = 0;
            for (String c : chromosomes) {
                Set<Integer> variants = new HashSet<Integer>(queryInfo.get(c));
                for (int var : variants) {
                    size = size + 1;
                }
            }

            GridView table = new GridView(path);
            table.setHeader(this.handler.getFileHeader());
            for (String c : chromosomes) {
                Set<Integer> variants = new HashSet<Integer>(queryInfo.get(c));
                for (int var : variants) {
                    table.addRow(this.handler.getLineForPos(c, var, var));
                }
            }
            return table;
        } catch (IOException e) {
            System.out.println("IOException in queryByRange of GridController.");
            return null;
        } catch (NumberFormatException e) {
            return null;
        } catch (IndexOutOfBoundsException e) {
            return null;
        }
    }

    @GetMapping("gene-file-view")
    public GridViewWrapper queryByGeneFile(String path) {
        System.out.println("GRIDCONTROLLER METHOD queryByGeneFile CALLED");
        try {
            ParseHelper helper = new ParseHelper();
            ArrayList<String> geneInfo = helper.processGeneFile(path);
            GridViewWrapper wrapper = new GridViewWrapper(geneInfo.size());
            for (String gene : geneInfo) {
                GridView gridView = this.handler.displayGeneView(gene);
                wrapper.addEntity(gene, gridView);
            }
            return wrapper;
        } catch (IOException e) {
            System.out.println("IOException in queryByGene of GridController.");
            return null;
        } catch (NumberFormatException n) {
            return null;
        }
    }

}
