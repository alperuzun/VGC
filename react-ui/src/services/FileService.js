import axios from 'axios';


// const URL = 'http://10.38.6.141:8080/api';
// const USERS_REST_API_URL = 'http://10.38.6.141:8080/api/view';
// const USERS_REST_API_URL_GETFILES = 'http://10.38.6.141:8080/api/getview';
// const USERS_REST_BARGRAPH_URL = 'http://10.38.6.141:8080/bargraph/view';
// const DP_GRAPH_URL = 'http://10.38.6.141:8080/bargraph/dp';
// const ZOOMED_GRAPH_URL = 'http://10.38.6.141:8080/bargraph/view-magnify';
// const FURTHER_ZOOMED_GRAPH_URL = 'http://10.38.6.141:8080/bargraph/further-magnify';
// const QUERY_GENE_GRAPH_URL = 'http://10.38.6.141:8080/bargraph/gene-graph';
// const QUERY_RANGE_GRAPH_URL = 'http://10.38.6.141:8080/bargraph/range-graph';



const URL = 'http://localhost:8080/api';
const USERS_REST_API_URL = 'http://localhost:8080/api/view';
const USERS_REST_READY_URL = 'http://localhost:8080/api/ready';
// const USERS_REST_API_URL_GETFILES = 'http://localhost:8080/api/getview';
const USERS_REST_BARGRAPH_URL = 'http://localhost:8080/bargraph/view';
// const DP_GRAPH_URL = 'http://localhost:8080/bargraph/dp';
const ZOOMED_GRAPH_URL = 'http://localhost:8080/bargraph/view-magnify';
const FURTHER_ZOOMED_GRAPH_URL = 'http://localhost:8080/bargraph/further-magnify';
const QUERY_GENE_GRAPH_URL = 'http://localhost:8080/bargraph/gene-graph';
const QUERY_RANGE_GRAPH_URL = 'http://localhost:8080/bargraph/range-graph';
// const URL = 'http://localhost:8080/api';
// const USERS_REST_API_URL = 'http://localhost:8080/api/view';
// const USERS_REST_API_URL_GETFILES = 'http://localhost:8080/api/getview';
// const USERS_REST_BARGRAPH_URL = 'http://localhost:8080/bargraph/view';
// const DP_GRAPH_URL = 'http://localhost:8080/bargraph/dp';
// const ZOOMED_GRAPH_URL = 'http://localhost:8080/bargraph/view-magnify';
// const FURTHER_ZOOMED_GRAPH_URL = 'http://localhost:8080/bargraph/further-magnify';
// const QUERY_GENE_GRAPH_URL = 'http://localhost:8080/bargraph/gene-graph';
// const QUERY_RANGE_GRAPH_URL = 'http://localhost:8080/bargraph/range-graph';


class UserService {

    start() {
        return axios.put(USERS_REST_API_URL);
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
        return axios.post(USERS_REST_API_URL, file).catch(
            function (error) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
                    console.log(error.config);
          });
    }

    getVarToChromGraph(passFilter) {
        return axios.get(USERS_REST_BARGRAPH_URL, {params : {
            passFilter
        }});
    }

    updateSelection(file) {
        return axios.post(URL, file);
    }

    getFileInfo() {
        return axios.get(USERS_REST_API_URL);
    }

    getZoomedgraph(chr, passFilter) {
        return axios.get(ZOOMED_GRAPH_URL, {params : {
            chr, passFilter
          }});
    }

    getFurtherZoom(chr, start, end, zoomFactor, passFilter) {
        return axios.get(FURTHER_ZOOMED_GRAPH_URL, {params : {
            chr, start, end, zoomFactor, passFilter
          }}).catch(function (error) {
            if (error.response) {
              // Request made and server responded
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            } else if (error.request) {
              // The request was made but no response was received
              console.log(error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error', error.message);
            }});
    }

    getHistogramByRange(chr, start, end, passFilter) {
        return axios.get(QUERY_RANGE_GRAPH_URL, {params : {
            chr, start, end, passFilter
          }});
    }

    getHistogramByGene(gene, passFilter) {
        return axios.get(QUERY_GENE_GRAPH_URL, {params : {
            gene, passFilter
          }});
    }
}

export default new UserService();


// getDPGraph(chrom) {
//     return axios.get(DP_GRAPH_URL, chrom);
// }