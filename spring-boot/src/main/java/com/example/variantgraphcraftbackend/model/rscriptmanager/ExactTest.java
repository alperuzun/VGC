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
        return new ArrayList<String>(Arrays.asList(resultArray));
    }

}
