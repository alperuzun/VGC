import axios from 'axios';
const GET_GENE_GRAPH_URL = 'http://localhost:8080/treeview/get-tree-for-gene';
const GET_RANGE_GRAPH_URL = 'http://localhost:8080/treeview/get-tree-for-range';
const GET_GENE_FILE_GRAPH_URL = 'http://localhost:8080/treeview/get-tree-for-gene-file';

class GeneService {

    getTreeForGeneFile(path, passFilter) {
        return axios.get(GET_GENE_FILE_GRAPH_URL, {params : {
            path, passFilter
        }});
    }

    getTreeForGene(passFilter, gene) {
        return axios.get(GET_GENE_GRAPH_URL, {params : {
            passFilter, gene
        }});
    }

    getTreeForRange(passFilter, range) {
        return axios.get(GET_RANGE_GRAPH_URL, {params : {
            passFilter, range
        }});
    }

}

export default new GeneService();