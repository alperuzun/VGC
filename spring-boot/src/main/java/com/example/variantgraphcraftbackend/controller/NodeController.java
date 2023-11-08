package com.example.variantgraphcraftbackend.controller;

import com.example.variantgraphcraftbackend.controller.exceptions.GeneNotFoundException;
import com.example.variantgraphcraftbackend.controller.exceptions.InvalidFileException;
import com.example.variantgraphcraftbackend.controller.exceptions.NodeRangeOverflowException;
import com.example.variantgraphcraftbackend.controller.exceptions.RangeNotFoundException;
import com.example.variantgraphcraftbackend.model.*;
import com.example.variantgraphcraftbackend.service.ParseHelper;
import com.example.variantgraphcraftbackend.service.ServiceHandler;

import org.apache.catalina.connector.Response;
import org.renjin.repackaged.guava.collect.Range;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
        this.handler = handler;
    }

    @GetMapping("get-node-graph-gene-file")
    public ResponseEntity<?> getGeneFileNodeGraph(String path, String passFilter, boolean HR, boolean HT, boolean HA) {

        try {
            ArrayList<String> geneInfo = this.processGeneFile(path);
            NodeViewWrapper wrapper = new NodeViewWrapper(geneInfo.size());
            for (String gene : geneInfo) {
                NodeView nodeView = this.handler.displayGraphByGene(gene, passFilter, HR, HT, HA);
                wrapper.addEntity(gene, nodeView);
            }
            return ResponseEntity.ok(wrapper);
        } catch (IOException e) {
            ErrorResponse errorResponse = new ErrorResponse("An internal server error occurred.", 500);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        } catch (GeneNotFoundException ex) {
            ErrorResponse errorResponse = new ErrorResponse("One or more invalid genes in file upload.", ex.getStatusCode());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);         
        } catch (InvalidFileException fx) {
            ErrorResponse errorResponse = new ErrorResponse(fx.getMessage(), fx.getStatusCode());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }


    @GetMapping("get-node-graph-pos-file")
    public ResponseEntity<?> getPosFileNodeGraph(String path, String passFilter, boolean HR, boolean HT, boolean HA) {

        try {
            HashMap<String, Set<Integer>> queryInfo = this.processPosFile(path);
            Set<String> chromosomes = new HashSet<String>(queryInfo.keySet());

            int size = chromosomes.stream()
                     .mapToInt(c -> queryInfo.get(c).size())
                     .sum();

            NodeViewWrapper wrapper = new NodeViewWrapper(size);
            for (String c : chromosomes) {
                Set<Integer> variants = new HashSet<Integer>(queryInfo.get(c));
                for (int var : variants) {
                    String query = c + ":" + var + "-" + var;
                    NodeView nodeView = this.handler.displayGraphByRange(c, var, var, passFilter, HR, HT, HA);
                    wrapper.addEntity(query, nodeView);
                }
            }
            return ResponseEntity.ok(wrapper);

        } catch (IOException e) {
            ErrorResponse errorResponse = new ErrorResponse("An internal server error occurred.", 500);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        } catch (NumberFormatException n) {
            ErrorResponse errorResponse = new ErrorResponse("One or more invalid positions in file upload.", 400);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        } catch (ArrayIndexOutOfBoundsException ax) {
            ErrorResponse errorResponse = new ErrorResponse("One or more invalid positions in file upload.", 400);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        } catch (RangeNotFoundException rx) {
            ErrorResponse errorResponse = new ErrorResponse("One or more invalid positions in file upload.", rx.getStatusCode());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (NodeRangeOverflowException ox) {
            ErrorResponse errorResponse = new ErrorResponse("One or more invalid positions in file upload.", ox.getStatusCode());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (InvalidFileException fx) {
            ErrorResponse errorResponse = new ErrorResponse(fx.getMessage(), fx.getStatusCode());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @GetMapping("gene-node-graph")
    public ResponseEntity<?> getGeneNodeGraph(String gene, String passFilter, String HR, String HT, String HA) {


        gene = gene.trim();

        try {
            NodeView nodeView = this.handler.displayGraphByGene(gene, passFilter, Boolean.parseBoolean(HR), Boolean.parseBoolean(HT), Boolean.parseBoolean(HA));
            return ResponseEntity.ok(nodeView);
        } catch(IOException e) {
            ErrorResponse errorResponse = new ErrorResponse("An internal server error occurred.", 500);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        } catch (NullPointerException n) {
            ErrorResponse errorResponse = new ErrorResponse("Invalid input.", 500);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (GeneNotFoundException ex) {
            ErrorResponse errorResponse = new ErrorResponse(ex.getMessage(), ex.getStatusCode());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    @GetMapping("range-node-graph")
    public ResponseEntity<?> getRangeNodeGraph(String range, String passFilter, boolean HR, boolean HT, boolean HA) {
        try {
            range = range.trim();
            String chr = range.substring(0, range.indexOf(":"));
            chr = chr.trim();
            String start = range.substring(range.indexOf(":") + 1, range.indexOf("-"));
            start = start.trim();
            String end = range.substring(range.indexOf("-") + 1);
            end = end.trim();
            NodeView nodeView = this.handler.displayGraphByRange(chr, Integer.valueOf(start), Integer.valueOf(end), passFilter, HR, HT, HA);
            return ResponseEntity.ok(nodeView);
        } catch(IOException e) {
            ErrorResponse errorResponse = new ErrorResponse("An internal server error occurred.", 500);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        } catch (NumberFormatException n) {
            ErrorResponse errorResponse = new ErrorResponse("Invalid input.", 500);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);   
        } catch (IndexOutOfBoundsException in) {
            ErrorResponse errorResponse = new ErrorResponse("Invalid input.", 500);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse); 
        } catch (RangeNotFoundException rx) {
            ErrorResponse errorResponse = new ErrorResponse(rx.getMessage(), rx.getStatusCode());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (NodeRangeOverflowException ox) {
            ErrorResponse errorResponse = new ErrorResponse(ox.getMessage(), ox.getStatusCode());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    private ArrayList<String> processGeneFile(String path) throws IOException, InvalidFileException {
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
        input.close();
        if (processedArray.size() < 1) {
            throw new InvalidFileException("Invalid gene file upload.", 400);
        }
        return processedArray;
    }

    private HashMap<String, Set<Integer>> processPosFile(String path) throws IOException, NumberFormatException, ArrayIndexOutOfBoundsException, InvalidFileException {
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
        input.close();
        if (processedMap.isEmpty()) {
            throw new InvalidFileException("Invalid range file upload.", 400);
        }
        return processedMap;
    }
}

