package com.example.variantgraphcraftbackend.controller;


import com.example.variantgraphcraftbackend.controller.exceptions.GeneNotFoundException;
import com.example.variantgraphcraftbackend.controller.exceptions.InvalidFileException;
import com.example.variantgraphcraftbackend.controller.exceptions.RangeNotFoundException;
import com.example.variantgraphcraftbackend.model.ErrorResponse;
import com.example.variantgraphcraftbackend.model.MapState;
import com.example.variantgraphcraftbackend.model.MapView;
import com.example.variantgraphcraftbackend.model.NodeView;
import com.example.variantgraphcraftbackend.service.ServiceHandler;

import org.apache.catalina.connector.Response;
import org.omg.CORBA.DynAnyPackage.Invalid;
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

    /**
     * File format: 'gene,gene,gene...' OR with multiple lines.
     */
    @GetMapping("get-heat-map-gene-file")
    public ResponseEntity<?> getHeatMapForGeneFile(String path, String passFilter) {
        System.out.println("SAMPLECONTROLLER METHOD GETHEATMAPFORGENEFILE CALLED");
        System.out.println("Path: " + path);
        System.out.println("FILTER: " + passFilter);

        try {
            ArrayList<String> geneInfo = this.processGeneFile(path);
            System.out.println(geneInfo);
            MapView mapView = this.handler.generateHeatMap(MapState.GENE, passFilter, new ArrayList<String>(), geneInfo, null, null);
            return ResponseEntity.ok(mapView);
        } catch (IOException e) {
            ErrorResponse errorResponse = new ErrorResponse("An internal server error occurred.", 500);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        } catch (GeneNotFoundException ex) {
            ErrorResponse errorResponse = new ErrorResponse("One or more invalid genes in file upload.", ex.getStatusCode());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse); 
        } catch (InvalidFileException fx) {
            ErrorResponse errorResponse = new ErrorResponse(fx.getMessage(), fx.getStatusCode());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (RangeNotFoundException rx) {
            ErrorResponse errorResponse = new ErrorResponse("One or more invalid genes in file upload.", rx.getStatusCode());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse); 
        }
    }

    /**
     * File format:
     * chr:pos,pos,pos...
     * chr:pos,pos,...
     */
    @GetMapping("get-heat-map-pos-file")
    public ResponseEntity<?> getHeatMapForPosFile(String path, String passFilter) {
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
                start.addAll(new ArrayList<Integer>(v));
                end.addAll(new ArrayList<Integer>(v));
            });
            MapView mapView = this.handler.generateHeatMap(MapState.RANGE, passFilter, chr, null, start, end);
            return ResponseEntity.ok(mapView);
        } catch (IOException e) {
            ErrorResponse errorResponse = new ErrorResponse("An internal server error occurred.", 500);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        } catch (GeneNotFoundException ex) {
            ErrorResponse errorResponse = new ErrorResponse("One or more invalid positions in file upload.", ex.getStatusCode());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (NumberFormatException n) {
            ErrorResponse errorResponse = new ErrorResponse("One or more invalid positions in file upload.", 400);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        } catch (ArrayIndexOutOfBoundsException ax) {
            ErrorResponse errorResponse = new ErrorResponse("One or more invalid positions in file upload.", 400);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        } catch (InvalidFileException fx) {
            ErrorResponse errorResponse = new ErrorResponse(fx.getMessage(), fx.getStatusCode());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (RangeNotFoundException rx) {
            ErrorResponse errorResponse = new ErrorResponse("One or more invalid positions in file upload.", 400);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("get-heat-map-range")
    public ResponseEntity<?> getHeatMapForRange(String passFilter, String range) {
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

            MapView mapView = this.handler.generateHeatMap(MapState.RANGE, passFilter, chrList, null, startList, endList);
            return ResponseEntity.ok(mapView);
        } catch(IOException e) {
            ErrorResponse errorResponse = new ErrorResponse("An internal server error occurred.", 500);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        } catch (IndexOutOfBoundsException in) {
            ErrorResponse errorResponse = new ErrorResponse("Invalid input.", 500);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse); 
        } catch (GeneNotFoundException ex) {
            ErrorResponse errorResponse = new ErrorResponse(ex.getMessage(), ex.getStatusCode());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        } catch (NullPointerException n) {
            ErrorResponse errorResponse = new ErrorResponse("Invalid input.", 500);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (RangeNotFoundException rx) {
            ErrorResponse errorResponse = new ErrorResponse(rx.getMessage(), rx.getStatusCode());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (NumberFormatException n) {
            ErrorResponse errorResponse = new ErrorResponse("Invalid input.", 500);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);   
        }
    }

    @GetMapping("get-heat-map-gene")
    public ResponseEntity<?> getHeatMapForGene(String passFilter, String gene) {
        System.out.println("SAMPLECONTROLLER METHOD GETHEATMAPGENE CALLED");

        gene = gene.trim();
        ArrayList<String> geneList = new ArrayList<String>();
        geneList.add(gene);
        System.out.println("Filter is: " + passFilter);
        System.out.println("Gene is: " + gene);

        try {
            MapView mapView = this.handler.generateHeatMap(MapState.GENE, passFilter, new ArrayList<String>(), geneList, null, null);
            return ResponseEntity.ok(mapView);
        } catch(IOException e) {
            ErrorResponse errorResponse = new ErrorResponse("An internal server error occurred.", 500);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        } catch (NullPointerException n) {
            ErrorResponse errorResponse = new ErrorResponse("Invalid input.", 500);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (GeneNotFoundException ex) {
            ErrorResponse errorResponse = new ErrorResponse(ex.getMessage(), ex.getStatusCode());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        } catch (RangeNotFoundException rx) {
            ErrorResponse errorResponse = new ErrorResponse(rx.getMessage(), rx.getStatusCode());
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
