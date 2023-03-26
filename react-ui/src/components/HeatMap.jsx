import React, { useRef, useEffect, useState } from 'react'
import { HeatMapComponent, Inject, Legend, HeatMapTheme, Tooltip, Adaptor } from "@syncfusion/ej2-react-heatmap";
import { useStateContext } from '../contexts/ContextProvider'
import SampleService from '../services/SampleService';
import FileService from '../services/FileService';
import '../css/HeatMap.css';
import { useCompareContext } from '../contexts/CompareContext';
import { useDisplayContext } from '../contexts/DisplayContext';


const HeatMap = () => {
  const { selected, searchGeneTerm, searchRangeTerm, geneFileUpload, setGeneFileUpload,
    posFileUpload, setPosFileUpload, toggleRS, toggleGS, refresh, phenotypeList, pathList, sizeList } = useStateContext();
  const {isClicked} = useDisplayContext();

  const {mapObj, setMapObj} = useCompareContext();
  const [mapData, setMapData] = useState(undefined);
  const [horizontalAxisLabels, setHorizontalAxisLabels] = useState(undefined);
  const [verticalAxisLabels, setVerticalAxisLabels] = useState(undefined);
  const [horizontalBrackets, setHorizontalBrackets] = useState([]);
  const prevVals = useRef({selected, refresh, isClicked});


  const processBrackets = (nameList, startList, endList) => {
    var multiLevelLabels = [];
    for (var i = 0; i < nameList.length; i++) {
      multiLevelLabels.push({ start: Number(startList[i]), end: Number(endList[i]), text: "Sample Group " + nameList[i] });
    }
    if (multiLevelLabels.length > 0) {
      setHorizontalBrackets(multiLevelLabels);
      console.log("MLLabels: ");
      console.log(multiLevelLabels);
    }
    return multiLevelLabels;
  }

  const processData = (colsList) => {
    var dataArr = []
    var sampleList = []
    for (var i = 0; i < colsList.length; i++) {
      dataArr[i] = colsList[i].compareTo;
      sampleList[i] = colsList[i].sampleName;
    }
    console.log(dataArr);
    console.log(sampleList);
    setHorizontalAxisLabels(sampleList);
    setMapData(dataArr);
  }

  const generateGeneMap = async () => {
    if (searchGeneTerm !== undefined && searchGeneTerm != "") {
      let retrievedData = await SampleService.getHeatMapForGene("PASS", searchGeneTerm);
      console.log(retrievedData);
      processBrackets(retrievedData.data.nameList, retrievedData.data.startList, retrievedData.data.endList);
      processData(retrievedData.data.mapData);
      setVerticalAxisLabels(retrievedData.data.yAxisLabels);
      setMapObj(retrievedData);
    }
  }

  const generateRangeMap = async () => {
    if (searchRangeTerm !== undefined && searchRangeTerm != "") {
      let retrievedData = await SampleService.getHeatMapForRange("PASS", searchRangeTerm);
      console.log(retrievedData);
      processBrackets(retrievedData.data.nameList, retrievedData.data.startList, retrievedData.data.endList);
      processData(retrievedData.data.mapData);
      setVerticalAxisLabels(retrievedData.data.yAxisLabels);
      setMapObj(retrievedData);
    }
  }

  const generateGeneFileMap = async () => {
    if (geneFileUpload !== undefined) {
      let retrievedData = await SampleService.getHeatMapForGeneFile(geneFileUpload, "PASS");
      console.log(retrievedData);
      processBrackets(retrievedData.data.nameList, retrievedData.data.startList, retrievedData.data.endList);
      processData(retrievedData.data.mapData);
      setVerticalAxisLabels(retrievedData.data.yAxisLabels);
      setMapObj(retrievedData);
    }
  }

  const generatePosFileMap = async () => {
    if (posFileUpload !== undefined) {
      let retrievedData = await SampleService.getHeatMapForPosFile(posFileUpload, "PASS");
      console.log(retrievedData);
      processBrackets(retrievedData.data.nameList, retrievedData.data.startList, retrievedData.data.endList);
      processData(retrievedData.data.mapData);
      setVerticalAxisLabels(retrievedData.data.yAxisLabels);
      setMapObj(retrievedData);
    }
  }

  const handleFileChosen = async (filePath) => {
    // console.log({ filePath });
    // const phenPath = phenotypeList[pathList.indexOf(filePath)];
    // console.log(phenPath);
    await FileService.addFile({ path: filePath, 
      phenotypePath: phenotypeList[pathList.indexOf(filePath)], 
      size: sizeList[pathList.indexOf(filePath)]  });
  }

  useEffect(() => {
    console.log("In heatmap starting useeffect:");
    if (prevVals.current.selected != selected) {
      setMapObj(undefined);
      setMapData(undefined);
      setHorizontalAxisLabels(undefined);
      setHorizontalBrackets([]);
      if (selected != null) {
        handleFileChosen(selected); 
      }
      prevVals.current = {selected, refresh, isClicked}

    } else {
      if (selected != null) {
        handleFileChosen(selected); 
      }
      if (geneFileUpload != null && selected != null && toggleGS === true) {
        console.log("On refresh, searching gene FILE...");
        generateGeneFileMap();
      } else if (posFileUpload != null && selected != null && toggleRS === true) {
        console.log("On refresh, searching pos FILE...");
        generatePosFileMap();
      } else if (searchGeneTerm != '' && searchGeneTerm != null && selected != null && toggleGS === true) {
        console.log("On refresh, searching gene...");
        generateGeneMap();
      } else if (searchRangeTerm != '' && searchRangeTerm != null && selected != null && toggleRS === true) {
        console.log("On refresh, searching range...");
        generateRangeMap();
      } else if (selected != null) {
        console.log("On refresh, no existing query.");
        setMapObj(undefined);
        setMapData(undefined);
        setHorizontalAxisLabels(undefined);
        setHorizontalBrackets([]);
        handleFileChosen(selected);
      }
    }
  }, [refresh, selected, isClicked])

  const plainAxisLabelHorizontal = {
    labels: horizontalAxisLabels,
    textStyle: { size: "10px", fontStyle: "Normal", fontFamily: "Open Sans" }
  }

  const plainAxisLabelVertical = {
    labels: verticalAxisLabels,
    textStyle: { size: "12px", fontStyle: "Normal", fontFamily: "Open Sans" }
  }

  const phenotypeLabelsHorizontal = {
    labels: horizontalAxisLabels,
    textStyle: { size: "8px", fontStyle: "Normal", fontFamily: "Open Sans" },
    multiLevelLabels: [{
      border: { type: 'Brace', color: '#a19d9d' },
      textStyle: {
        color: 'black',
        // fontWeight: 'Bold',
        fontFamily: "Open Sans",
      },
      categories: horizontalBrackets
    }]
  }

  return (
    <div>
      {mapData != null && mapObj != null ?
        <div>
          {(horizontalBrackets.length < 1) ?
            (<HeatMapComponent
              id="container"
              fontFamily="Open Sans"
              height='660'
              titleSettings={{
                text: mapObj.data.title,
                textStyle: { size: "15px", fontStyle: "Normal", fontFamily: "Open Sans" }
              }}
              xAxis={plainAxisLabelHorizontal}
              yAxis={plainAxisLabelVertical}
              cellSettings={{
                border: {
                  width: 0,
                }
              }}
              dataSource={mapData}
              legendSettings={{ position: 'Right' }}
              renderingMode={'Auto'}
            //   paletteSettings={{
            //     palette: [
            //         { color: '#C06C84', label: 'Low', value: 50 },
            //         { color: '#6C5B7B', label: 'Moderate', value: 80 },
            //         { color: '#355C7D', label: 'High', value: 100 }
            //     ],
            //     type: "Gradient"
            // }} 
            >
              <Inject services={[Legend]} />

            </HeatMapComponent>)
            :
            (<HeatMapComponent
              id="container"
              fontFamily="Open Sans"
              height='660'
              titleSettings={{
                text: mapObj.data.title,
                textStyle: { size: "15px", fontStyle: "Normal", fontFamily: "Open Sans" }
              }}
              xAxis={phenotypeLabelsHorizontal}
              yAxis={plainAxisLabelVertical}
              dataSource={mapData}
              cellSettings={{
                border: {
                  width: 0,
                }
              }}
              legendSettings={{ position: 'Right' }}
              renderingMode={'Auto'}
            >
              <Inject services={[Legend]} />
            </HeatMapComponent>)
          }
        </div>
      :
      <div className="flex h-[42rem]">
      </div>}
    </div>
  )
}

export default HeatMap


// xAxis={{
//   labels: [
//     'China',
//     'India',
//     'Australia',
//     'Mexico',
//     'Canada',
//     'Brazil',
//     'USA',
//     'UK',
//     'Germany',
//     'Russia',
//     'France',
//     'Japan'
//   ],
// }}
// yAxis={{
//   labels: [
//     '2008',
//     '2009',
//     '2010',
//     '2011',
//     '2012',
//     '2013',
//     '2014',
//     '2015',
//     '2016',
//     '2017'
//   ]
// }}

// const heatMapData = [
//   [9.5, 2.2, 4.2, 8.2, -0.5, 3.2, 5.4, 7.4, 6.2, 1.4],
//   [4.3, 8.9, 10.8, 6.5, 5.1, 6.2, 7.6, 7.5, 6.1, 7.6],
//   [3.9, 2.7, 2.5, 3.7, 2.6, 5.1, 5.8, 2.9, 4.5, 5.1],
//   [2.4, -3.7, 4.1, 6.0, 5.0, 2.4, 3.3, 4.6, 4.3, 2.7],
//   [2.0, 7.0, -4.1, 8.9, 2.7, 5.9, 5.6, 1.9, -1.7, 2.9],
//   [5.4, 1.1, 6.9, 4.5, 2.9, 3.4, 1.5, -2.8, -4.6, 1.2],
//   [-1.3, 3.9, 3.5, 6.6, 5.2, 7.7, 1.4, -3.6, 6.6, 4.3],
//   [-1.6, 2.3, 2.9, -2.5, 1.3, 4.9, 10.1, 3.2, 4.8, 2.0],
//   [10.8, -1.6, 4.0, 6.0, 7.7, 2.6, 5.6, -2.5, 3.8, -1.9],
//   [6.2, 9.8, -1.5, 2.0, -1.5, 4.3, 6.7, 3.8, -1.2, 2.4],
//   [1.2, 10.9, 4.0, -1.4, 2.2, 1.6, -2.6, 2.3, 1.7, 2.4],
//   [5.1, -2.4, 8.2, -1.1, 3.5, 6.0, -1.3, 7.2, 9.0, 4.2]
// ];