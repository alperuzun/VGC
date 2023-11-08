package com.example.variantgraphcraftbackend.controller;

import com.example.variantgraphcraftbackend.controller.exceptions.GeneNotFoundException;
import com.example.variantgraphcraftbackend.controller.exceptions.RangeNotFoundException;
import com.example.variantgraphcraftbackend.model.*;
import com.example.variantgraphcraftbackend.service.ParseHelper;
import com.example.variantgraphcraftbackend.service.ServiceHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
        this.handler = handler;
    }

    @GetMapping("variant-view")
    public ResponseEntity<?> queryByRange(String range) {
        try {
            range = range.trim();
            String chr = range.substring(0, range.indexOf(":"));
            chr = chr.trim();
            String start = range.substring(range.indexOf(":") + 1, range.indexOf("-"));
            start = start.trim();
            String end = range.substring(range.indexOf("-") + 1);
            end = end.trim();
            GridView girdView = this.handler.displayGridView(chr, Integer.valueOf(start), Integer.valueOf(end));
            return ResponseEntity.ok(girdView);
        } catch (IOException e) {
            ErrorResponse errorResponse = new ErrorResponse("An internal server error occurred.", 500);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        } catch (NumberFormatException n) {
            ErrorResponse errorResponse = new ErrorResponse("Invalid input.", 500);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);        
        } catch (IndexOutOfBoundsException in) {
            ErrorResponse errorResponse = new ErrorResponse("Invalid input.", 500);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse); 
        } catch (RangeNotFoundException ex) {
            ex.printStackTrace();
            ErrorResponse errorResponse = new ErrorResponse(ex.getMessage(), ex.getStatusCode());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }


    @GetMapping("gene-view")
    public ResponseEntity<?> queryByGene(String gene) {
        try {
            GridView gridView = this.handler.displayGeneView(gene);
            return ResponseEntity.ok(gridView);
        } catch (IOException e) {
            ErrorResponse errorResponse = new ErrorResponse("An internal server error occurred.", 500);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        } catch (NumberFormatException n) {
            ErrorResponse errorResponse = new ErrorResponse("Invalid input.", 500);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (GeneNotFoundException ex) {
            ex.printStackTrace();
            ErrorResponse errorResponse = new ErrorResponse(ex.getMessage(), ex.getStatusCode());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);        
        }
    }

}
