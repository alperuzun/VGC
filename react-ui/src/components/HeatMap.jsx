import React, { useRef, useEffect, useState } from 'react'
import { HeatMapComponent, Inject, Legend, HeatMapTheme, Tooltip, Adaptor } from "@syncfusion/ej2-react-heatmap";
import { useStateContext } from '../contexts/ContextProvider'
import SampleService from '../services/SampleService';
import FileService from '../services/FileService';
import '../css/HeatMap.css';
import { useCompareContext } from '../contexts/CompareContext';
import { useDisplayContext } from '../contexts/DisplayContext';


const HeatMap = () => {
  const { selected, currentlyViewing, setCurrentlyViewing, searchGeneTerm, searchRangeTerm, geneFileUpload, setGeneFileUpload, posFileUpload, setPosFileUpload, toggleRS, toggleGS, refresh, phenotypeList, pathList, handleRemovePath, sizeList } = useStateContext();
  const {isClicked} = useDisplayContext();

  const {mapObj, setMapObj} = useCompareContext();
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
      console.log("Searching gene from heatmap...");
      setProcessing(true);
      try {
        let retrievedData = await SampleService.getHeatMapForGene("PASS", searchGeneTerm);
        console.log(retrievedData);
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
      console.log("Searching range from heatmap...");
      setProcessing(true);
      try {
        let retrievedData = await SampleService.getHeatMapForRange("PASS", searchRangeTerm);
        console.log(retrievedData);
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
      console.log("Searching gene file from heatmap...");
      setProcessing(true);
      try {
        let retrievedData = await SampleService.getHeatMapForGeneFile(geneFileUpload, "PASS");
        console.log(retrievedData);
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
      console.log("Search pos file from heatmap...")
      setProcessing(true);
      try {
        let retrievedData = await SampleService.getHeatMapForPosFile(posFileUpload, "PASS");
        console.log(retrievedData);
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
        size: sizeList[pathList.indexOf(filePath)]  });
      const fileInfo = await FileService.getFileInfo();
      setCurrentlyViewing(fileInfo.data);
    } catch (error) {
      handleRemovePath(filePath);
      alert(error.response.data.message);
    }
  }

  useEffect(() => {
    console.log("In heatmap starting useeffect:");
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
          console.log("On refresh, searching gene FILE...");
          generateGeneFileMap();
        } else if (posFileUpload != null && toggleRS === true) {
          console.log("On refresh, searching pos FILE...");
          generatePosFileMap();
        } else if (searchGeneTerm != '' && searchGeneTerm != null && toggleGS === true) {
          console.log("On refresh, searching gene...");
          generateGeneMap();
        } else if (searchRangeTerm != '' && searchRangeTerm != null && toggleRS === true) {
          console.log("On refresh, searching range...");
          generateRangeMap();
        } 
      }
    }
  }, [refresh, selected, isClicked])

  // useEffect(() => {
  //   console.log("In heatmap starting useeffect:");
  //   if (prevVals.current.selected != selected) {
  //     setMapObj(undefined);
  //     setMapData(undefined);
  //     setHorizontalAxisLabels(undefined);
  //     setHorizontalBrackets([]);
  //     if (selected != null) {
  //       handleFileChosen(selected); 
  //     }
  //     prevVals.current = {selected, refresh, isClicked}

  //   } else {
  //     if (selected != null) {
  //       handleFileChosen(selected); 
  //     }
  //     if (geneFileUpload != null && selected != null && toggleGS === true) {
  //       console.log("On refresh, searching gene FILE...");
  //       generateGeneFileMap();
  //     } else if (posFileUpload != null && selected != null && toggleRS === true) {
  //       console.log("On refresh, searching pos FILE...");
  //       generatePosFileMap();
  //     } else if (searchGeneTerm != '' && searchGeneTerm != null && selected != null && toggleGS === true) {
  //       console.log("On refresh, searching gene...");
  //       generateGeneMap();
  //     } else if (searchRangeTerm != '' && searchRangeTerm != null && selected != null && toggleRS === true) {
  //       console.log("On refresh, searching range...");
  //       generateRangeMap();
  //     } else if (selected != null) {
  //       console.log("On refresh, no existing query.");
  //       setMapObj(undefined);
  //       setMapData(undefined);
  //       setHorizontalAxisLabels(undefined);
  //       setHorizontalBrackets([]);
  //       handleFileChosen(selected);
  //     }
  //   }
  // }, [refresh, selected, isClicked])

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
      )
    } 

    return (
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
    )
  }

  return (
    <div className="flex-1">
      </div>
  )
}

export default HeatMap


// return (
//   <div className="flex overflow-hidden">
//     {mapData != null && mapObj != null ?
//       <div className="flex overflow-hidden">
//         {(horizontalBrackets.length < 1) ?
//           (<HeatMapComponent
//             id="container"
//             fontFamily="Open Sans"
//             height={'100%'}
//             width={'100%'}
//             titleSettings={{
//               text: mapObj.data.title,
//               textStyle: { size: "15px", fontStyle: "Normal", fontFamily: "Open Sans" }
//             }}
//             xAxis={plainAxisLabelHorizontal}
//             yAxis={plainAxisLabelVertical}
//             cellSettings={{
//               border: {
//                 width: 0,
//               }
//             }}
//             dataSource={mapData}
//             legendSettings={{ position: 'Right' }}
//             renderingMode={'Auto'}
//           >
//             <Inject services={[Legend]} />

//           </HeatMapComponent>)
//           :
//           (<HeatMapComponent
//             id="container"
//             fontFamily="Open Sans"
//             height='660'
//             titleSettings={{
//               text: mapObj.data.title,
//               textStyle: { size: "15px", fontStyle: "Normal", fontFamily: "Open Sans" }
//             }}
//             xAxis={phenotypeLabelsHorizontal}
//             yAxis={plainAxisLabelVertical}
//             dataSource={mapData}
//             cellSettings={{
//               border: {
//                 width: 0,
//               }
//             }}
//             legendSettings={{ position: 'Right' }}
//             renderingMode={'Auto'}
//           >
//             <Inject services={[Legend]} />
//           </HeatMapComponent>)
//         }
//       </div>
//     :
//     <div className="flex h-[42rem]">
//     </div>}
//   </div>
// )

// import React, { useRef, useEffect, useState } from 'react'
// import { HeatMapComponent, Inject, Legend, HeatMapTheme, Tooltip, Adaptor } from "@syncfusion/ej2-react-heatmap";
// import { useStateContext } from '../contexts/ContextProvider'
// import SampleService from '../services/SampleService';
// import FileService from '../services/FileService';
// import '../css/HeatMap.css';
// import { useCompareContext } from '../contexts/CompareContext';
// import { useDisplayContext } from '../contexts/DisplayContext';


// const HeatMap = () => {
//   const { selected, currentlyViewing, setCurrentlyViewing, searchGeneTerm, searchRangeTerm, geneFileUpload, setGeneFileUpload,
//     posFileUpload, setPosFileUpload, toggleRS, toggleGS, refresh, phenotypeList, pathList, sizeList } = useStateContext();
//   const {isClicked} = useDisplayContext();

//   const {mapObj, setMapObj} = useCompareContext();
//   const [mapData, setMapData] = useState(undefined);
//   const [horizontalAxisLabels, setHorizontalAxisLabels] = useState(undefined);
//   const [verticalAxisLabels, setVerticalAxisLabels] = useState(undefined);
//   const [horizontalBrackets, setHorizontalBrackets] = useState([]);
//   const prevVals = useRef({selected, refresh, isClicked});


//   const processBrackets = (nameList, startList, endList) => {
//     var multiLevelLabels = [];
//     for (var i = 0; i < nameList.length; i++) {
//       multiLevelLabels.push({ start: Number(startList[i]), end: Number(endList[i]), text: "Sample Group " + nameList[i] });
//     }
//     if (multiLevelLabels.length > 0) {
//       setHorizontalBrackets(multiLevelLabels);
//       console.log("MLLabels: ");
//       console.log(multiLevelLabels);
//     }
//     return multiLevelLabels;
//   }

//   const processData = (colsList) => {
//     var dataArr = []
//     var sampleList = []
//     for (var i = 0; i < colsList.length; i++) {
//       dataArr[i] = colsList[i].compareTo;
//       sampleList[i] = colsList[i].sampleName;
//     }
//     console.log(dataArr);
//     console.log(sampleList);
//     setHorizontalAxisLabels(sampleList);
//     setMapData(dataArr);
//   }

//   const generateGeneMap = async () => {
//     if (searchGeneTerm !== undefined && searchGeneTerm != "") {
//       let retrievedData = await SampleService.getHeatMapForGene("PASS", searchGeneTerm);
//       console.log(retrievedData);
//       if (retrievedData !== undefined) {
//         processBrackets(retrievedData.data.nameList, retrievedData.data.startList, retrievedData.data.endList);
//         processData(retrievedData.data.mapData);
//         setVerticalAxisLabels(retrievedData.data.yAxisLabels);
//         setMapObj(retrievedData);
//       }
//     }
//   }

//   const generateRangeMap = async () => {
//     if (searchRangeTerm !== undefined && searchRangeTerm != "") {
//       let retrievedData = await SampleService.getHeatMapForRange("PASS", searchRangeTerm);
//       console.log(retrievedData);
//       if (retrievedData !== undefined) {
//         processBrackets(retrievedData.data.nameList, retrievedData.data.startList, retrievedData.data.endList);
//         processData(retrievedData.data.mapData);
//         setVerticalAxisLabels(retrievedData.data.yAxisLabels);
//         setMapObj(retrievedData);
//       }
//     }
//   }

//   const generateGeneFileMap = async () => {
//     if (geneFileUpload !== undefined) {
//       let retrievedData = await SampleService.getHeatMapForGeneFile(geneFileUpload, "PASS");
//       console.log(retrievedData);
//       if (retrievedData !== undefined) {
//         processBrackets(retrievedData.data.nameList, retrievedData.data.startList, retrievedData.data.endList);
//         processData(retrievedData.data.mapData);
//         setVerticalAxisLabels(retrievedData.data.yAxisLabels);
//         setMapObj(retrievedData);
//       }
//     }
//   }

//   const generatePosFileMap = async () => {
//     if (posFileUpload !== undefined) {
//       let retrievedData = await SampleService.getHeatMapForPosFile(posFileUpload, "PASS");
//       console.log(retrievedData);
//       if (retrievedData !== undefined) {
//         processBrackets(retrievedData.data.nameList, retrievedData.data.startList, retrievedData.data.endList);
//         processData(retrievedData.data.mapData);
//         setVerticalAxisLabels(retrievedData.data.yAxisLabels);
//         setMapObj(retrievedData);
//       }
//     }
//   }

//   const handleFileChosen = async (filePath) => {
//     await FileService.addFile({ path: filePath, 
//       phenotypePath: phenotypeList[pathList.indexOf(filePath)], 
//       size: sizeList[pathList.indexOf(filePath)]  });
//     const fileInfo = await FileService.getFileInfo();
//     setCurrentlyViewing(fileInfo.data);
//   }

//   useEffect(() => {
//     console.log("In heatmap starting useeffect:");
//     if (prevVals.current.selected != selected) {
//       setMapObj(undefined);
//       setMapData(undefined);
//       setHorizontalAxisLabels(undefined);
//       setHorizontalBrackets([]);
//       if (selected != null) {
//         handleFileChosen(selected); 
//       }
//       prevVals.current = {selected, refresh, isClicked}

//     } else {
//       if (selected != null) {
//         handleFileChosen(selected); 
//       }
//       if (geneFileUpload != null && selected != null && toggleGS === true) {
//         console.log("On refresh, searching gene FILE...");
//         generateGeneFileMap();
//       } else if (posFileUpload != null && selected != null && toggleRS === true) {
//         console.log("On refresh, searching pos FILE...");
//         generatePosFileMap();
//       } else if (searchGeneTerm != '' && searchGeneTerm != null && selected != null && toggleGS === true) {
//         console.log("On refresh, searching gene...");
//         generateGeneMap();
//       } else if (searchRangeTerm != '' && searchRangeTerm != null && selected != null && toggleRS === true) {
//         console.log("On refresh, searching range...");
//         generateRangeMap();
//       } else if (selected != null) {
//         console.log("On refresh, no existing query.");
//         setMapObj(undefined);
//         setMapData(undefined);
//         setHorizontalAxisLabels(undefined);
//         setHorizontalBrackets([]);
//         handleFileChosen(selected);
//       }
//     }
//   }, [refresh, selected, isClicked])

//   const plainAxisLabelHorizontal = {
//     labels: horizontalAxisLabels,
//     textStyle: { size: "10px", fontStyle: "Normal", fontFamily: "Open Sans" }
//   }

//   const plainAxisLabelVertical = {
//     labels: verticalAxisLabels,
//     textStyle: { size: "12px", fontStyle: "Normal", fontFamily: "Open Sans" }
//   }

//   const phenotypeLabelsHorizontal = {
//     labels: horizontalAxisLabels,
//     textStyle: { size: "8px", fontStyle: "Normal", fontFamily: "Open Sans" },
//     multiLevelLabels: [{
//       border: { type: 'Brace', color: '#a19d9d' },
//       textStyle: {
//         color: 'black',
//         fontFamily: "Open Sans",
//       },
//       categories: horizontalBrackets
//     }]
//   }

//   if (mapData != null && mapObj != null) {
//     if (horizontalBrackets.length < 1) {
//       return (
//         <HeatMapComponent
//               id="container"
//               fontFamily="Open Sans"
//               height={'100%'}
//               width={'100%'}
//               titleSettings={{
//                 text: mapObj.data.title,
//                 textStyle: { size: "15px", fontStyle: "Normal", fontFamily: "Open Sans" }
//               }}
//               xAxis={plainAxisLabelHorizontal}
//               yAxis={plainAxisLabelVertical}
//               cellSettings={{
//                 border: {
//                   width: 0,
//                 }
//               }}
//               dataSource={mapData}
//               legendSettings={{ position: 'Right' }}
//               renderingMode={'Auto'}
//             >
//               <Inject services={[Legend]} />

//             </HeatMapComponent>
//       )
//     } 
//     return (
    
//       <HeatMapComponent
//               id="container"
//               fontFamily="Open Sans"
//               height={'100%'}
//               width={'100%'}
//               titleSettings={{
//                 text: mapObj.data.title,
//                 textStyle: { size: "15px", fontStyle: "Normal", fontFamily: "Open Sans" }
//               }}
//               xAxis={phenotypeLabelsHorizontal}
//               yAxis={plainAxisLabelVertical}
//               dataSource={mapData}
//               cellSettings={{
//                 border: {
//                   width: 0,
//                 }
//               }}
//               legendSettings={{ position: 'Right' }}
//               renderingMode={'Auto'}
//             >
//               <Inject services={[Legend]} />
//             </HeatMapComponent>

//     )
//   }

//   return (
//     <div className="flex-1">
//       </div>
//   )
// }

// export default HeatMap


// // return (
// //   <div className="flex overflow-hidden">
// //     {mapData != null && mapObj != null ?
// //       <div className="flex overflow-hidden">
// //         {(horizontalBrackets.length < 1) ?
// //           (<HeatMapComponent
// //             id="container"
// //             fontFamily="Open Sans"
// //             height={'100%'}
// //             width={'100%'}
// //             titleSettings={{
// //               text: mapObj.data.title,
// //               textStyle: { size: "15px", fontStyle: "Normal", fontFamily: "Open Sans" }
// //             }}
// //             xAxis={plainAxisLabelHorizontal}
// //             yAxis={plainAxisLabelVertical}
// //             cellSettings={{
// //               border: {
// //                 width: 0,
// //               }
// //             }}
// //             dataSource={mapData}
// //             legendSettings={{ position: 'Right' }}
// //             renderingMode={'Auto'}
// //           >
// //             <Inject services={[Legend]} />

// //           </HeatMapComponent>)
// //           :
// //           (<HeatMapComponent
// //             id="container"
// //             fontFamily="Open Sans"
// //             height='660'
// //             titleSettings={{
// //               text: mapObj.data.title,
// //               textStyle: { size: "15px", fontStyle: "Normal", fontFamily: "Open Sans" }
// //             }}
// //             xAxis={phenotypeLabelsHorizontal}
// //             yAxis={plainAxisLabelVertical}
// //             dataSource={mapData}
// //             cellSettings={{
// //               border: {
// //                 width: 0,
// //               }
// //             }}
// //             legendSettings={{ position: 'Right' }}
// //             renderingMode={'Auto'}
// //           >
// //             <Inject services={[Legend]} />
// //           </HeatMapComponent>)
// //         }
// //       </div>
// //     :
// //     <div className="flex h-[42rem]">
// //     </div>}
// //   </div>
// // )