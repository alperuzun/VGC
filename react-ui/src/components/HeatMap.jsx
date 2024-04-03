import React, { useRef, useEffect, useState } from 'react'
import { HeatMapComponent, Inject, Legend, HeatMapTheme, Tooltip, Adaptor } from "@syncfusion/ej2-react-heatmap";
import { useStateContext } from '../contexts/ContextProvider'
import SampleService from '../services/SampleService';
import FileService from '../services/FileService';
import '../css/HeatMap.css';
import { useCompareContext } from '../contexts/CompareContext';
import { useDisplayContext } from '../contexts/DisplayContext';


const HeatMap = () => {
  const { selected, currentlyViewing, setCurrentlyViewing, searchGeneTerm, searchRangeTerm, geneFileUpload, setGeneFileUpload, posFileUpload, setPosFileUpload, toggleRS, toggleGS, refresh, phenotypeList, pathList, handleRemovePath, sizeList, refList } = useStateContext();
  const {isClicked} = useDisplayContext();

  const {mapObj, setMapObj, replicates} = useCompareContext();
  const [mapData, setMapData] = useState(undefined);
  const [horizontalAxisLabels, setHorizontalAxisLabels] = useState(undefined);
  const [verticalAxisLabels, setVerticalAxisLabels] = useState(undefined);
  const [horizontalBrackets, setHorizontalBrackets] = useState([]);
  const [processing, setProcessing] = useState(false);

  const prevVals = useRef({selected, refresh, isClicked});


  const processBrackets = (nameList, startList, endList) => {
    var multiLevelLabels = [];
    for (var i = 0; i < nameList.length; i++) {
      multiLevelLabels.push({ start: Number(startList[i]), end: Number(endList[i]), text: "Sample Group " + nameList[i] });
    }
    if (multiLevelLabels.length > 0) {
      setHorizontalBrackets(multiLevelLabels);
    }
    return multiLevelLabels;
  }

  const processData = (colsList) => {
    const dataArr = []
    const sampleList = []
    for (var i = 0; i < colsList.length; i++) {
      dataArr[i] = colsList[i].compareTo;
      sampleList[i] = colsList[i].sampleName;
    }
    setHorizontalAxisLabels(sampleList);
    setMapData(undefined);
    setMapData(dataArr);
  }

  const generateGeneMap = async () => {
    if (searchGeneTerm !== undefined && searchGeneTerm != "") {
      setProcessing(true);
      try {
        let retrievedData = await SampleService.getHeatMapForGene("PASS", searchGeneTerm);
        processBrackets(retrievedData.data.nameList, retrievedData.data.startList, retrievedData.data.endList);
        processData(retrievedData.data.mapData);
        setVerticalAxisLabels(retrievedData.data.yAxisLabels);
        setMapObj(retrievedData);
      } catch (error) {
        alert(error.response.data.message);
      } finally {
        setProcessing(false);
      }
    }
  }

  const generateRangeMap = async () => {
    if (searchRangeTerm !== undefined && searchRangeTerm != "") {
      setProcessing(true);
      try {
        let retrievedData = await SampleService.getHeatMapForRange("PASS", searchRangeTerm);
        processBrackets(retrievedData.data.nameList, retrievedData.data.startList, retrievedData.data.endList);
        processData(retrievedData.data.mapData);
        setVerticalAxisLabels(retrievedData.data.yAxisLabels);
        setMapObj(retrievedData);
      } catch (error) {
        alert(error.response.data.message);
      } finally {
        setProcessing(false);
      }
    }
  }

  const generateGeneFileMap = async () => {
    if (geneFileUpload !== undefined) {
      setProcessing(true);
      try {
        let retrievedData = await SampleService.getHeatMapForGeneFile(geneFileUpload, "PASS");
        processBrackets(retrievedData.data.nameList, retrievedData.data.startList, retrievedData.data.endList);
        processData(retrievedData.data.mapData);
        setVerticalAxisLabels(retrievedData.data.yAxisLabels);
        setMapObj(retrievedData);
      } catch (error) {
        alert(error.response.data.message);
      } finally {
        setProcessing(false);
      }
    }
  }

  const generatePosFileMap = async () => {
    if (posFileUpload !== undefined) {
      setProcessing(true);
      try {
        let retrievedData = await SampleService.getHeatMapForPosFile(posFileUpload, "PASS");
        processBrackets(retrievedData.data.nameList, retrievedData.data.startList, retrievedData.data.endList);
        processData(retrievedData.data.mapData);
        setVerticalAxisLabels(retrievedData.data.yAxisLabels);
        setMapObj(retrievedData);
      } catch (error) {
        alert(error.response.data.message);
      } finally {
        setProcessing(false);
      }
    }
  }

  const handleFileChosen = async (filePath) => {
    try {
      await FileService.addFile({ path: filePath, 
        phenotypePath: phenotypeList[pathList.indexOf(filePath)], 
        size: sizeList[pathList.indexOf(filePath)],
        refGenome: refList[pathList.indexOf(filePath)]  });
      const fileInfo = await FileService.getFileInfo();
      setCurrentlyViewing(fileInfo.data);
    } catch (error) {
      handleRemovePath(filePath);
      alert(error.response.data.message);
    }
  }

  useEffect(() => {
    if (prevVals.current.selected != selected) {
      setMapObj(undefined);
      setMapData(undefined);
      setHorizontalAxisLabels(undefined);
      setHorizontalBrackets([]);
      handleFileChosen(selected); 
      prevVals.current = {selected, refresh, isClicked}
    } else {
      if (selected !== null && selected !== undefined) {
        handleFileChosen(selected); 
        if (geneFileUpload != null && toggleGS === true) {
          generateGeneFileMap();
        } else if (posFileUpload != null && toggleRS === true) {
          generatePosFileMap();
        } else if (searchGeneTerm != '' && searchGeneTerm != null && toggleGS === true) {
          generateGeneMap();
        } else if (searchRangeTerm != '' && searchRangeTerm != null && toggleRS === true) {
          generateRangeMap();
        } else {
          setMapObj(undefined);
          setMapData(undefined);
          setHorizontalAxisLabels(undefined);
          setHorizontalBrackets([]);
        }
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
        fontFamily: "Open Sans",
      },
      categories: horizontalBrackets
    }]
  }

  if (mapData != null && mapObj != null) {
    if (horizontalBrackets.length < 1) {
      return (
        <div className="flex">
        {processing && 
        <div className="absolute inset-0 bg-slate-200 bg-opacity-60 flex flex-col z-[70]">
          <div className="bg-slate-300 py-0.5 px-6 text-xs">Loading, please wait...</div>
        </div>
        }
        <HeatMapComponent
              id="container"
              fontFamily="Open Sans"
              height={'100%'}
              width={'100%'}
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
            >
              <Inject services={[Legend]} />

            </HeatMapComponent>
            </div>
      )
    } 

    return (
      <div className="flex">
        {processing && 
        <div className="absolute inset-0 bg-slate-200 bg-opacity-60 flex flex-col z-[70]">
          <div className="bg-slate-300 py-0.5 px-6 text-xs">Loading, please wait...</div>
        </div>
        }
      <HeatMapComponent
              id="container"
              fontFamily="Open Sans"
              height={'100%'}
              width={'100%'}
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
            </HeatMapComponent>
            </div>
    )
  }

  return (
    <div className="flex-1">
      </div>
  )
}

export default HeatMap
