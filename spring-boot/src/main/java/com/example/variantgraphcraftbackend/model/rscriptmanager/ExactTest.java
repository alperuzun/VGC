package com.example.variantgraphcraftbackend.model.rscriptmanager;

import org.apache.hadoop.yarn.webapp.hamlet.Hamlet;
import org.apache.spark.api.r.RUtils;
import org.renjin.script.RenjinScriptEngine;
import org.renjin.sexp.AttributeMap;
import org.renjin.sexp.DoubleArrayVector;
import org.renjin.sexp.ListVector;
import org.renjin.sexp.SEXP;

import javax.script.ScriptException;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Vector;
import java.util.stream.Collectors;

public class ExactTest {

    private String testResult;

    public ExactTest() {
    }

    public String runFisherExact(String matrix) {
        RenjinScriptEngine engine = new RenjinScriptEngine();

        try {
//            engine.eval("vgc_data <- matrix(c(2,0,57,54,0,7), nrow=2, " +
//                    "dimnames = list(Samples = c(\"Controls\", \"Cases\"), " +
//                    "Genotypes = c(\"0/0\", \"0/1\", \"1/1\")))");
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

//    private String getScriptContent() {
//        try {
//            System.out.println(RUtils.class.getClassLoader().getResource("vgc_script.R"));
//
//            URI rScriptUri = RUtils.class.getClassLoader().getResource("vgc_script.R").toURI();
//            Path inputScript = Paths.get(rScriptUri);
//            return Files.lines(inputScript).collect(Collectors.joining());
//        } catch (URISyntaxException e) {
//            System.out.println("URI exception");
//            e.printStackTrace();
//        } catch (IOException e) {
//            System.out.println("IO Exception");
//            e.printStackTrace();
//        }
//        return null;
//    }


//            String scriptContent = this.getScriptContent();
//            System.out.println(scriptContent);
//            engine.put("matrix_array", new int[] {2,0,57,54,0,7});
//            engine.put("num_row", 2);
//            engine.put("sample_list", new String[] {"Controls", "Cases"});
//            engine.put("gt_list", new String[] {"0/0", "0/1", "1/1"});
//            engine.eval(scriptContent);
//            ListVector result = (ListVector) engine.eval("vgc_fisher_test_script(matrix_array, num_row, sample_list, gt_list)");
//            System.out.println(result.asReal());
}
