import axios from 'axios';
const MAP_VIEW_GENE_FILE = 'http://localhost:8080/mapview/get-heat-map-gene-file';
const MAP_VIEW_POS_FILE = 'http://localhost:8080/mapview/get-heat-map-pos-file';
const MAP_VIEW_GENE = 'http://localhost:8080/mapview/get-heat-map-gene';
const MAP_VIEW_RANGE = 'http://localhost:8080/mapview/get-heat-map-range';


class TableService {


    getHeatMapForGeneFile(path, passFilter) {
        return axios.get(MAP_VIEW_GENE_FILE, {params : {
            path, passFilter
        }});
    }

    getHeatMapForPosFile(path, passFilter) {
        return axios.get(MAP_VIEW_POS_FILE, {params : {
            path, passFilter
        }});
    }

    getHeatMapForGene(passFilter, gene) {
        return axios.get(MAP_VIEW_GENE, {params : {
            passFilter, gene
        }});
    }

    getHeatMapForRange(passFilter, range) {
        return axios.get(MAP_VIEW_RANGE, {params : {
            passFilter, range
        }});
    }

   

}

export default new TableService();