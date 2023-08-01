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
        System.out.println("Constructor of BarController called.");
        this.handler = handler;
    }

    @GetMapping("view-magnify")
    public BarView getZoomedGraph(String chr, String passFilter) {
        System.out.println("BARCONTROLLER METHOD GETZOOMEDGRAPH CALLED.");
        try {
            if (chr.equals("23")) {
                return this.handler.displayZoomedGraph("X", passFilter);
            } else if (chr.equals("24")) {
                return this.handler.displayZoomedGraph("Y", passFilter);
            }
            return this.handler.displayZoomedGraph(chr, passFilter);
        } catch (IOException e) {
            System.out.println("IOException in getZoomGraph of BarController.");
            e.printStackTrace();
        }
        return null;
    }

    @GetMapping("further-magnify")
    public BarView getFurtherZoom(String chr, String start, String end, String zoomFactor, String passFilter) {
        System.out.println("BARCONTROLLER METHOD FURTHERZOOM CALLED.");
        System.out.println("chrom: " + chr +  ", start: " + start + ", end: " + end + ", Zoomfactor: " + zoomFactor);
        try {
            if (chr.equals("23")) {
                return this.handler.displayFurtherZoom("X", Integer.valueOf(start), Integer.valueOf(end), Integer.valueOf(zoomFactor), passFilter);
            } else if (chr.equals("24")) {
                return this.handler.displayFurtherZoom("Y", Integer.valueOf(start), Integer.valueOf(end), Integer.valueOf(zoomFactor), passFilter);
            }
            return this.handler.displayFurtherZoom(chr, Integer.valueOf(start), Integer.valueOf(end), Integer.valueOf(zoomFactor), passFilter);
        } catch (IOException e) {
            System.out.println("IOException in getZoomGraph of BarController.");
        }
        return null;
    }

    /**
     * Returns BarView on adding a new file.
     * @return
     */
    @GetMapping("view")
    public BarView getVarToChromGraph(String passFilter) {
        System.out.println("BARCONTROLLER METHOD GETVARTOCHROMGRAPH CALLED.");
        return this.handler.displayBarView(passFilter);
    }

    @GetMapping("gene-graph")
    public ResponseEntity<?> getHistogramByGene(String gene, String passFilter) {
        System.out.println("BARCONTROLLER METHOD GETHISTOGRAMBYGENE CALLED.");
        System.out.println("Gene: " + gene);
        try {
            BarView result = this.handler.displayGeneHistogram(gene, passFilter);
            return ResponseEntity.ok(result);
        } catch (IOException e) {
            System.out.println("IOException in getHistogramByGene of BarController.");
            e.printStackTrace();
            ErrorResponse errorResponse = new ErrorResponse("An internal server error occurred.", 500);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        } catch (NullPointerException n) {
            System.out.println("NullPointerException in getHistogramByGene of BarController.");
            n.printStackTrace();
            ErrorResponse errorResponse = new ErrorResponse("Invalid input.", 500);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (GeneNotFoundException ex) {
            System.out.println("GeneNotFoundException in getHistogramByGene of BarController.");
            ex.printStackTrace();
            ErrorResponse errorResponse = new ErrorResponse(ex.getMessage(), ex.getStatusCode());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    @GetMapping("range-graph")
    public ResponseEntity<?> getHistogramByRange(String chr, String start, String end, String passFilter) {
        System.out.println("BARCONTROLLER METHOD GETHISTOGRAMBYRANGE CALLED.");
        System.out.println("chrom: " + chr +  ", start: " + start + ", end: " + end);
        try {
            BarView result = this.handler.displayRangeHistogram(chr, Integer.valueOf(start), Integer.valueOf(end), passFilter);
            return ResponseEntity.ok(result);
        } catch (IOException e) {
            System.out.println("IOException in getHistogramByGene of BarController.");
            e.printStackTrace();
            ErrorResponse errorResponse = new ErrorResponse("An internal server error occurred.", 500);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        } catch (NumberFormatException n) {
            System.out.println("NumberFormatException in getHistogramByGene of BarController.");
            n.printStackTrace();
            ErrorResponse errorResponse = new ErrorResponse("Invalid input.", 500);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (RangeNotFoundException ex) {
            System.out.println("RangeNotFoundException in getHistogramByGene of BarController.");
            ex.printStackTrace();
            ErrorResponse errorResponse = new ErrorResponse(ex.getMessage(), ex.getStatusCode());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    @GetMapping("single-variant-analysis")
    public SingleVariantPathogenicity getSingleVariantAnalysis(String chr, String pos) {
        System.out.println("BARCONTROLLER METHOD getSingleVariantAnalysis CALLED.");
        return null;
    }
}
