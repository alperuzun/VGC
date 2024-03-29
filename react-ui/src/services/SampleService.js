import axios from 'axios';
const MAP_VIEW_GENE_FILE = 'http://localhost:8080/mapview/get-heat-map-gene-file';
const MAP_VIEW_POS_FILE = 'http://localhost:8080/mapview/get-heat-map-pos-file';
const MAP_VIEW_GENE = 'http://localhost:8080/mapview/get-heat-map-gene';
const MAP_VIEW_RANGE = 'http://localhost:8080/mapview/get-heat-map-range';


class SampleService {
    getHeatMapForGeneFile(path, passFilter) {
        return axios.get(MAP_VIEW_GENE_FILE, { params: { path, passFilter } })
          .then(response => {
            return response;
          })
          .catch(error => {
            throw error
          });
      }
      
    getHeatMapForPosFile(path, passFilter) {
        return axios.get(MAP_VIEW_POS_FILE, {params : { path, passFilter }})
          .then(response => {
            return response;
          })
          .catch(error => {
            throw error;
          });
    }

    getHeatMapForGene(passFilter, gene) {
        return axios.get(MAP_VIEW_GENE, {params : { passFilter, gene}})
          .then(response => {
            return response;
          })
          .catch(error => {
            throw error;
          });
    }

    getHeatMapForRange(passFilter, range) {
        return axios.get(MAP_VIEW_RANGE, {params : {passFilter, range}})
          .then(response => {
            return response;
          })
          .catch(error => {
            throw error;
          });
    }

   

}

export default new SampleService();