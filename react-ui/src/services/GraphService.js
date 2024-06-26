import axios from 'axios';
const GET_GENE_GRAPH_URL = 'http://localhost:8080/nodeview/gene-node-graph';
const GET_RANGE_GRAPH_URL = 'http://localhost:8080/nodeview/range-node-graph';
const GET_GENE_FILE_GRAPH_URL = 'http://localhost:8080/nodeview/get-node-graph-gene-file';
const GET_POS_FILE_GRAPH_URL = 'http://localhost:8080/nodeview/get-node-graph-pos-file';


class GraphService {

    getGeneFileNodeGraph(path, passFilter, HR, HT, HA) {
        return axios.get(GET_GENE_FILE_GRAPH_URL, {params : { path, passFilter, HR, HT, HA }})          
          .then(response => {
            return response;
          })
          .catch(error => {
            throw error;
          });
    }

    getPosFileNodeGraph(path, passFilter, HR, HT, HA) {
        return axios.get(GET_POS_FILE_GRAPH_URL, {params : { path, passFilter, HR, HT, HA }})
          .then(response => {
            return response;
          })
          .catch(error => {
            throw error;
          });
    }

    getGeneNodeGraph(gene, passFilter, HR, HT, HA) {
        return axios.get(GET_GENE_GRAPH_URL, {params : { gene, passFilter, HR, HT, HA }})
          .then(response => {
            return response;
          })
          .catch(error => {
            throw error;
          });
    }

    getRangeNodeGraph(range, passFilter, HR, HT, HA) {
        return axios.get(GET_RANGE_GRAPH_URL, {params : { range, passFilter, HR, HT, HA }})
          .then(response => {
            return response;
          })
          .catch(error => {
            throw error;
          });
    }

}

export default new GraphService();