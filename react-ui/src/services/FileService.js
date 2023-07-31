import axios from 'axios';
const URL = 'http://localhost:8080/api';
const USERS_REST_API_URL = 'http://localhost:8080/api/view';
const USERS_REST_READY_URL = 'http://localhost:8080/api/ready';
const USERS_REST_BARGRAPH_URL = 'http://localhost:8080/bargraph/view';
const ZOOMED_GRAPH_URL = 'http://localhost:8080/bargraph/view-magnify';
const FURTHER_ZOOMED_GRAPH_URL = 'http://localhost:8080/bargraph/further-magnify';
const QUERY_GENE_GRAPH_URL = 'http://localhost:8080/bargraph/gene-graph';
const QUERY_RANGE_GRAPH_URL = 'http://localhost:8080/bargraph/range-graph';

class UserService {

    start() {
        return axios.put(USERS_REST_API_URL)
          .then(response => {
            return response;
          })
          .catch(error => {
            alert("An error occured while starting the application. Please quit and try again.");
          });
    }

    ready() {
        return axios.get(USERS_REST_READY_URL).catch(
            function (error) {
                return false;
            }
        );
    }

    getFiles() {
        return axios.get(URL);
    }

    addFile(file) {
        return axios.post(USERS_REST_API_URL, file)          
          .then(response => {
            return response;
          })
          .catch(error => {
            throw error;
          });
          // .catch(error => {
          //   alert("An error occured while processing your file. Please check your file formats before trying again.");
          // });
    }

    getVarToChromGraph(passFilter) {
        return axios.get(USERS_REST_BARGRAPH_URL, {params : { passFilter }})
          .then(response => {
            return response;
          })

          // .catch(error => {
          //   alert("An error occured while processing your file. Please check your file formats before trying again.");
          // });
    }

    updateSelection(file) {
        return axios.post(URL, file)
          .then(response => {
            return response;
          })
          .catch(error => {
            throw error;
          });
          // .catch(error => {
          //   alert("An error occured while retrieving your file data.");
          // });
    }

    getFileInfo() {
        return axios.get(USERS_REST_API_URL)
          .then(response => {
            return response;
          })

          // .catch(error => {
          //   alert("An error occured while retrieving your file data.");
          // });
    }

    getZoomedgraph(chr, passFilter) {
        return axios.get(ZOOMED_GRAPH_URL, {params : { chr, passFilter }})
          .then(response => {
            return response;
          })
          .catch(error => {
            throw error;
          });
          // .catch(error => {
          //   alert("An error occured while retrieving the zoomed graph.");
          // });
    }

    getFurtherZoom(chr, start, end, zoomFactor, passFilter) {
        return axios.get(FURTHER_ZOOMED_GRAPH_URL, {params : { chr, start, end, zoomFactor, passFilter }})
          .then(response => {
            return response;
          })
          .catch(error => {
            throw error;
          });
          // .catch(error => {
          //   alert("An error occured while retrieving the zoomed graph.");
          // });
    }

    getHistogramByRange(chr, start, end, passFilter) {
        return axios.get(QUERY_RANGE_GRAPH_URL, {params : { chr, start, end, passFilter }})
          .then(response => {
            return response;
          })
          .catch(error => {
            throw error;
          });
          // .catch(error => {
          //   alert("An error occured with your range query. Please check your file formats before trying again. ");
          // });
    }

    getHistogramByGene(gene, passFilter) {
        return axios.get(QUERY_GENE_GRAPH_URL, {params : { gene, passFilter }})
          .then(response => {
            return response;
          })
          .catch(error => {
            throw error;
          });
    }
}

export default new UserService();