import axios from 'axios';
const MAP_VIEW_GENE_FILE = 'http://localhost:8080/mapview/get-heat-map-gene-file';
const MAP_VIEW_POS_FILE = 'http://localhost:8080/mapview/get-heat-map-pos-file';
const MAP_VIEW_GENE = 'http://localhost:8080/mapview/get-heat-map-gene';
const MAP_VIEW_RANGE = 'http://localhost:8080/mapview/get-heat-map-range';


class TableService {


    // getHeatMapForGeneFile(path, passFilter) {
    //     return axios.get(MAP_VIEW_GENE_FILE, {params : {
    //         path, passFilter
    //     }});
    // }
    getHeatMapForGeneFile(path, passFilter) {
        return axios.get(MAP_VIEW_GENE_FILE, { params: { path, passFilter } })
          .then(response => {
            return response;
          })
          .catch(error => {
            alert("An error occured while processing your data. Please check your file formats before trying again.");
          });
      }
      
      

    getHeatMapForPosFile(path, passFilter) {
        return axios.get(MAP_VIEW_POS_FILE, {params : { path, passFilter }})
          .then(response => {
            return response;
          })
          .catch(error => {
            alert("An error occured while processing your data. Please check your file formats before trying again.");
          });
    }

    getHeatMapForGene(passFilter, gene) {
        return axios.get(MAP_VIEW_GENE, {params : { passFilter, gene}})
          .then(response => {
            return response;
          })
          .catch(error => {
            alert("An error occured while processing your data. Please check your file formats before trying again.");
          });
    }

    getHeatMapForRange(passFilter, range) {
        return axios.get(MAP_VIEW_RANGE, {params : {passFilter, range}})
          .then(response => {
            return response;
          })
          .catch(error => {
            alert("An error occured while processing your data. Please check your file formats before trying again.");
          });
    }

   

}

export default new TableService();