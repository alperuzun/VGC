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
            alert("An error occured while processing your data. Please check your file formats before trying again.");
          });
    }

    getPosFileNodeGraph(path, passFilter, HR, HT, HA) {
        return axios.get(GET_POS_FILE_GRAPH_URL, {params : { path, passFilter, HR, HT, HA }})
          .then(response => {
            return response;
          })
          .catch(error => {
            alert("An error occured while processing your data. Please check your file formats before trying again.");
          });
    }

    getGeneNodeGraph(gene, passFilter, HR, HT, HA) {
        return axios.get(GET_GENE_GRAPH_URL, {params : { gene, passFilter, HR, HT, HA }})
          .then(response => {
            return response;
          })
          .catch(error => {
            alert("An error occured while processing your data. Please check your file formats before trying again.");
          });
    }

    getRangeNodeGraph(range, passFilter, HR, HT, HA) {
        return axios.get(GET_RANGE_GRAPH_URL, {params : { range, passFilter, HR, HT, HA }})
          .then(response => {
            return response;
          })
          .catch(error => {
            alert("An error occured while processing your data. Please check your file formats before trying again.");
          });
    }

}

export default new GraphService();

// const GET_POS_GRAPH_URL = 'http://localhost:8080/nodeview/pos-node-graph';
// getPosNodeGraph(chr, varPos, passFilter, HR, HT, HA) {
//     return axios.get(GET_POS_GRAPH_URL, {params : {
//         chr, varPos, passFilter, HR, HT, HA
//       }});
// }