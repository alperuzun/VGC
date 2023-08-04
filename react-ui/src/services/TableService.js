import axios from 'axios';
const VARIANT_VIEW_URL_RANGE = 'http://localhost:8080/gridview/variant-view';
const VARIANT_VIEW_URL_GENE = 'http://localhost:8080/gridview/gene-view';
const VARIANT_VIEW_URL_RANGE_FILE = 'http://localhost:8080/gridview/range-file-view';
const VARIANT_VIEW_URL_GENE_FILE = 'http://localhost:8080/gridview/gene-file-view';

class TableService {

    queryByGene(gene) {
        return axios.get(VARIANT_VIEW_URL_GENE, {params : {
            gene
          }});
    }

    queryByRange(range) {
        return axios.get(VARIANT_VIEW_URL_RANGE, {params : {
            range
          }});
    }

}

export default new TableService();