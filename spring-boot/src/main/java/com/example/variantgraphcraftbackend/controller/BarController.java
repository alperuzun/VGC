package com.example.variantgraphcraftbackend.controller;

import com.example.variantgraphcraftbackend.controller.exceptions.GeneNotFoundException;
import com.example.variantgraphcraftbackend.controller.exceptions.RangeNotFoundException;
import com.example.variantgraphcraftbackend.model.BarView;
import com.example.variantgraphcraftbackend.model.ErrorResponse;
import com.example.variantgraphcraftbackend.model.SingleVariantPathogenicity;
import com.example.variantgraphcraftbackend.service.ServiceHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/bargraph")
public class BarController {

    private ServiceHandler handler;

    @Autowired
    public BarController(ServiceHandler handler) {
        this.handler = handler;
    }

    @GetMapping("view-magnify")
    public BarView getZoomedGraph(String chr, String passFilter) {
        try {
            if (chr.equals("23")) {
                return this.handler.displayZoomedGraph("X", passFilter);
            } else if (chr.equals("24")) {
                return this.handler.displayZoomedGraph("Y", passFilter);
            }
            return this.handler.displayZoomedGraph(chr, passFilter);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    @GetMapping("further-magnify")
    public BarView getFurtherZoom(String chr, String start, String end, String zoomFactor, String passFilter) {
        try {
            if (chr.equals("23")) {
                return this.handler.displayFurtherZoom("X", Integer.valueOf(start), Integer.valueOf(end), Integer.valueOf(zoomFactor), passFilter);
            } else if (chr.equals("24")) {
                return this.handler.displayFurtherZoom("Y", Integer.valueOf(start), Integer.valueOf(end), Integer.valueOf(zoomFactor), passFilter);
            }
            return this.handler.displayFurtherZoom(chr, Integer.valueOf(start), Integer.valueOf(end), Integer.valueOf(zoomFactor), passFilter);
        } catch (IOException e) {
        }
        return null;
    }

    /**
     * Returns BarView on adding a new file.
     * @return
     */
    @GetMapping("view")
    public BarView getVarToChromGraph(String passFilter) {
        return this.handler.displayBarView(passFilter);
    }

    @GetMapping("gene-graph")
    public ResponseEntity<?> getHistogramByGene(String gene, String passFilter) {
        try {
            BarView result = this.handler.displayGeneHistogram(gene, passFilter);
            return ResponseEntity.ok(result);
        } catch (IOException e) {
            e.printStackTrace();
            ErrorResponse errorResponse = new ErrorResponse("An internal server error occurred.", 500);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        } catch (NullPointerException n) {
            n.printStackTrace();
            ErrorResponse errorResponse = new ErrorResponse("Invalid input.", 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (GeneNotFoundException ex) {
            ex.printStackTrace();
            ErrorResponse errorResponse = new ErrorResponse(ex.getMessage(), ex.getStatusCode());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    @GetMapping("range-graph")
    public ResponseEntity<?> getHistogramByRange(String chr, String start, String end, String passFilter) {
        try {
            BarView result = this.handler.displayRangeHistogram(chr, Integer.valueOf(start), Integer.valueOf(end), passFilter);
            return ResponseEntity.ok(result);
        } catch (IOException e) {
            e.printStackTrace();
            ErrorResponse errorResponse = new ErrorResponse("An internal server error occurred.", 500);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        } catch (NumberFormatException n) {
            n.printStackTrace();
            ErrorResponse errorResponse = new ErrorResponse("Invalid input.", 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (RangeNotFoundException ex) {
            ex.printStackTrace();
            ErrorResponse errorResponse = new ErrorResponse(ex.getMessage(), ex.getStatusCode());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

}
