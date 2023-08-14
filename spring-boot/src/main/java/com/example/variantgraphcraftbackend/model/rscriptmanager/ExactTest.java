package com.example.variantgraphcraftbackend.model.rscriptmanager;

import org.renjin.script.RenjinScriptEngine;
import org.renjin.sexp.SEXP;

import javax.script.ScriptException;
import java.util.ArrayList;
import java.util.Arrays;

public class ExactTest {

    private String testResult;

    public ExactTest() {
    }

    public String runFisherExact(String matrix) {
        RenjinScriptEngine engine = new RenjinScriptEngine();

        try {
            String toEval = "vgc_data <- matrix(c(" + matrix + "), nrow=2, " +
                    "dimnames = list(Samples = c(\"Controls\", \"Cases\"), " +
                    "Genotypes = c(\"0/0\", \"0/1\", \"1/1\")))";
            System.out.println(toEval);
            engine.eval(toEval);
            SEXP res = (SEXP)engine.eval("fisher.test(vgc_data, simulate.p.value = TRUE, B = 2e3)");
            System.out.println(res.toString());
            this.testResult = res.toString();
            return res.toString();
        } catch (ScriptException e) {
            System.out.println("ScriptException.");
            e.printStackTrace();
        }
        return null;
    }

    public ArrayList<String> getResult() {
        String innerList = this.testResult.substring(5, this.testResult.length() - 1);
        String[] resultArray = innerList.split(",");
        resultArray[0] = handlePValFormat(resultArray[0]);
        return new ArrayList<String>(Arrays.asList(resultArray));
    }


    private String handlePValFormat(String inputString) {
        String[] parts = inputString.split(" ");
        String valueString = parts[parts.length - 1];
        double value = Double.parseDouble(valueString);
        double roundedValue = roundToSignificantFigures(value, 4);
        String formattedValue = String.format("%.7f", roundedValue);
        return "p.value = " + formattedValue;
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

}
