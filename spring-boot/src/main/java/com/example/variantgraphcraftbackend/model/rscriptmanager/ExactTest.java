package com.example.variantgraphcraftbackend.model.rscriptmanager;

import org.renjin.script.RenjinScriptEngine;
import org.renjin.sexp.SEXP;

import javax.script.ScriptException;
import java.util.ArrayList;
import java.util.Arrays;

public class ExactTest {

    private String testResult;
    private int n;

    public ExactTest(int n) {
        this.n = n;
    }

    public void runFisherExact(String matrix) {
        RenjinScriptEngine engine = new RenjinScriptEngine();

        try {
            String toEval = "vgc_data <- matrix(c(" + matrix + "), nrow=2, byrow = TRUE, " +
                    "dimnames = list(Samples = c(\"Controls\", \"Cases\"), " +
                    "Genotypes = c(\"0/0\", \"0/1\", \"1/1\")))";
            engine.eval(toEval);
            SEXP res = (SEXP)engine.eval("fisher.test(vgc_data, simulate.p.value = TRUE, B = 2e3)");
            this.testResult = res.toString();
        } catch (ScriptException e) {
            this.testResult = "Analysis Error\t ";
        } catch (org.renjin.eval.EvalException e) {
            if (this.checkZeroError(matrix)) {
                this.testResult = "Evaluation Error\t ";
            } else {
                this.testResult = "Analysis Error\t ";
            }
        }
    }

    public ArrayList<String> getResult() {
        if (this.testResult.startsWith("Evaluation Error") || this.testResult.startsWith("Analysis Error")) {
            return new ArrayList<String>(Arrays.asList(this.testResult));
        } else {
            String innerList = this.testResult.substring(5, this.testResult.length() - 1);
            String[] resultArray = innerList.split(",");
            resultArray[0] = handlePValFormat(resultArray[0]);
            return new ArrayList<String>(Arrays.asList(resultArray[0]));

            // return new ArrayList<String>(Arrays.asList(resultArray));
            }
    }

    private String handlePValFormat(String inputString) {
        String[] parts = inputString.split(" ");
        String valueString = parts[parts.length - 1];
        double value = Double.parseDouble(valueString);
        double roundedValue = roundToSignificantFigures(value, 4);
        
        double adjustedValue = value * this.n;
        double roundedAdjustedValue = roundToSignificantFigures(adjustedValue, 4);
        
        String formattedValue = String.format("%.4f", roundedValue);
        String formattedAdjustedValue = String.format("%.4f", roundedAdjustedValue);

        return "Nominal p-value: " + formattedValue +  "\t" + "Adjusted p-value: " + formattedAdjustedValue;
    }

    private double roundToSignificantFigures(double num, int n) {
        if (num == 0) {
            return 0;
        }

        final double d = Math.ceil(Math.log10(num < 0 ? -num : num));
        final int power = n - (int) d;

        final double magnitude = Math.pow(10, power);
        final long shifted = Math.round(num * magnitude);

        return shifted / magnitude;
    }

    private boolean checkZeroError(String matrix) {
        String[] elements = matrix.split(",");
        int numRows = elements.length / 3;
        int[][] matrixAsArr = new int[numRows][3];

        for (int i = 0; i < numRows; i++) {
            for (int j = 0; j < 3; j++) {
                matrixAsArr[i][j] = Integer.parseInt(elements[i * 3 + j]);
            }
        }



        if (Arrays.stream(matrixAsArr).allMatch(row -> row[0] == 0 && row[1] == 0) || 
            Arrays.stream(matrixAsArr).allMatch(row -> row[1] == 0 && row[2] == 0) || 
            Arrays.stream(matrixAsArr).allMatch(row -> row[0] == 0 && row[2] == 0)) {
            return true;
        }

        
        return false;
    }

}
