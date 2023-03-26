import React, { useRef, useState, useEffect } from 'react'
import { SpreadsheetComponent, SheetsDirective, SheetDirective, RangesDirective } from '@syncfusion/ej2-react-spreadsheet';
import { RangeDirective, ColumnsDirective, ColumnDirective } from '@syncfusion/ej2-react-spreadsheet';
import { DropDownButtonComponent } from '@syncfusion/ej2-react-splitbuttons';
import { ContextProvider, useStateContext } from '../contexts/ContextProvider'
import { SimplePane } from './Panes'
import TableService from '../services/TableService'
import FileService from '../services/FileService';
import { getComponent } from '@syncfusion/ej2-base';


import { useDisplayContext } from '../contexts/DisplayContext';

const Table = () => {
  const { selected, setSelected, phenotypeList, pathList, sizeList, searchRangeTerm, setSearchRangeTerm, searchGeneTerm, setSearchGeneTerm,toggleRS, setToggleRS, toggleGS, setToggleGS, refresh, setRefresh } = useStateContext();
  const {isClicked} = useDisplayContext();
  const [label, setlabel] = useState(undefined);

  const [testJsonData, setTestJsonData] = useState(undefined);
  const [spreadSheetObj, setSpreadSheetObj] = useState(undefined);
  const speadsheetRef = useRef(null)
  const prevVals = useRef({selected, refresh, isClicked});
  // const saveItems = [
  //   {
  //     text: "Save As xlsx"
  //   },
  //   {
  //     text: "Save As xls"
  //   },
  //   {
  //     text: "Save As csv"
  //   },
  //   {
  //     text: "Save As pdf"
  //   }
  // ];

  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { label: "Save As xlsx", value: "xlsx" },
    { label: "Save As xls", value: "xls" },
    { label: "Save As csv", value: "csv" },
    { label: "Save As pdf", value: "pdf" },
  ];
  const handleSave = (type) => {
    if (spreadSheetObj != undefined) {
      console.log("UHUSDHFUHSIUDHF")
      console.log(type)
      spreadSheetObj.save({ url: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/save', fileName: "Sample", saveType: type});

    }
    setIsOpen(false)
  
  }

  // const save = () => {
  //   spreadSheetObj.current.saveAsJason().then(json => {
  //     console.log("here alksjdhf")
  //     // setResponse(json);
  //   })
  // }


  const generateJSON = (header, rowData) => {
    var allData = [];
    var varPos = header.indexOf("POS");
    var qual = header.indexOf("QUAL");
    for (var i = 0; i < rowData.length; i++) {
      var newRow = {};
      for (var j = 0; j < header.length; j++) {
        if (j === varPos || j === qual) {
          newRow[header[j]] = Number(rowData[i].row[j]);
        } else {
          newRow[header[j]] = rowData[i].row[j];
        }
      }
      allData.push(newRow);
    }
    console.log(allData);
    if (testJsonData != undefined) {
      const oldEnd = testJsonData.length;
      const newEnd = allData.length;
      console.log("Old end: ")
      console.log(oldEnd);
      console.log("New end: ")
      console.log(newEnd);
      if (oldEnd > newEnd) {
        spreadSheetObj.delete(newEnd + 1, oldEnd, 'Row', 0);
      }
    }
    setTestJsonData(allData);
    // setTestJsonData([...testJsonData, allData]);
  }

  const searchRange = async () => {
    if (searchRangeTerm != null && searchRangeTerm != "") {
      var dataObj = await TableService.queryByRange(searchRangeTerm)
      if (dataObj.data === "") {
        setlabel("No variants found.");
      } else {
        console.log(dataObj);
        setlabel(dataObj.data.queryName);
        generateJSON(dataObj.data.header, dataObj.data.rowData);
      }
    }
  }

  const searchGene = async () => {
    if (searchGeneTerm != null && searchGeneTerm != "") {
        console.log("In searchGene.")
        console.log(searchGeneTerm);
        let test = searchGeneTerm
        var dataObj = await TableService.queryByGene(test)
        if (dataObj.data === "") {
          setlabel("No variants found.");
        } else {
          setlabel(dataObj.data.queryName);
          generateJSON(dataObj.data.header, dataObj.data.rowData);
        }
    }
  }

  const handleFileChosen = async (filePath) => {
    await FileService.addFile({ path: filePath, 
      phenotypePath: phenotypeList[pathList.indexOf(filePath)], 
      size: sizeList[sizeList.indexOf(filePath)]});
  }



  useEffect(() => {
    if (prevVals.current.selected != selected) {
      setTestJsonData(undefined);
      setSpreadSheetObj(undefined);
      setlabel("Enter a search term above.");
      handleFileChosen(selected);
      prevVals.current = {selected, refresh, isClicked}
    } else {
      console.log("In table starting useeffect:");
      handleFileChosen(selected);
      if (searchGeneTerm != '' && searchGeneTerm != null && selected != null && toggleGS === true) {
        console.log("On refresh, searching gene...");
        searchGene();
      } else if (searchRangeTerm != '' && searchRangeTerm != null && selected != null && toggleRS === true) {
        console.log("On refresh, searching range...");
        searchRange();
      } else if (selected != null) {
        console.log("On refresh, no existing query.");
        setlabel("Enter a search term above.");
        handleFileChosen(selected);
      }
    }

  }, [refresh, selected, isClicked])

  const Dropdown = () => {
    return (
      <div className="relative inline-block text-left">
        <div>
          <button type="button" className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500" id="dropdown-button" onClick={() => setIsOpen(!isOpen)} aria-expanded="true" aria-haspopup="true">
            Save
            <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 14l-5-5h10l-5 5z" />
            </svg>
          </button>
        </div>
  
        {isOpen && (
          <div className="origin-top-right z-50 absolute right-0 mt-2 inline-flex  w-full items-stretch rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            
            <div className="py-1 w-full" role="menu" aria-orientation="vertical" aria-labelledby="dropdown-button">
              <button className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" onClick={() => handleSave("Xlsx")}>Save As xlsx</button>
              <button className="block  w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" onClick={() => handleSave("Xls")}>Save As xls</button>
              <button className="block  w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" onClick={() => handleSave("Csv")}>Save As csv</button>
              <button className="block  w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" onClick={() => handleSave("Pdf")}>Save As pdf</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
              {/* <DropDownButtonComponent > Save </DropDownButtonComponent> */}


<div className="px-2 py-1.5">
    <div className={`flex bg-slate-100 w-full drop-shadow-md `}>
      <div className="w-full h-min">
      <div className="flex p-2 ">
      {label != undefined && label}

        </div>
        </div>
        </div>
        </div>
        {/* <DropDownButtonComponent id="element" items={saveItems} select={itemSelect()}> Save </DropDownButtonComponent> */}
        <Dropdown/>

    {/* <button onClick={save}>save</button> */}
    <div className="flex grow px-2 py-1.5 h-full w-full">
      <div className={`flex bg-slate-100 w-full h-full drop-shadow-md `}>
          { testJsonData != undefined &&
            <SpreadsheetComponent showRibbon={false} allowSave={true} saveUrl='http://localhost:8080/gridview' ref={(ssObj) => { setSpreadSheetObj(ssObj); } } height="100%" width="100%" allowFiltering={true}>
            {/* <SpreadsheetComponent  allowSave={true} saveUrl='http://localhost:8080/gridview' ref={(ssObj) => { setSpreadSheetObj(ssObj); } } height="100%" width="100%" allowFiltering={true}> */}
            {/* <SpreadsheetComponent showRibbon={false} allowSave={true} saveUrl='http://localhost:8080/gridview' ref={speadsheetRef} height="100%" width="100%" allowFiltering={true}> */}
            <SheetsDirective>
              <SheetDirective>
                <RangesDirective>
                  <RangeDirective dataSource={testJsonData}></RangeDirective>
                </RangesDirective>
              </SheetDirective>
            </SheetsDirective>
          </SpreadsheetComponent>

          }


      </div>
    </div>
  </div>
  )
}

export default Table


//saving 2/2
// import React, { useRef, useState, useEffect } from 'react'
// import { SpreadsheetComponent, SheetsDirective, SheetDirective, RangesDirective } from '@syncfusion/ej2-react-spreadsheet';
// import { RangeDirective, ColumnsDirective, ColumnDirective } from '@syncfusion/ej2-react-spreadsheet';
// import { ContextProvider, useStateContext } from '../contexts/ContextProvider'
// import { SimplePane } from './Panes'
// import TableService from '../services/TableService'
// import FileService from '../services/FileService';
// import { useDisplayContext } from '../contexts/DisplayContext';

// const Table = () => {
//   const { selected, setSelected, phenotypeList, pathList, sizeList, searchRangeTerm, setSearchRangeTerm, searchGeneTerm, setSearchGeneTerm,toggleRS, setToggleRS, toggleGS, setToggleGS, refresh, setRefresh } = useStateContext();
//   const {isClicked} = useDisplayContext();
//   const [label, setlabel] = useState(undefined);

//   const [testJsonData, setTestJsonData] = useState(undefined);
//   const [spreadSheetObj, setSpreadSheetObj] = useState(undefined);
//   const prevVals = useRef({selected, refresh, isClicked});


//   const generateJSON = (header, rowData) => {
//     var allData = [];
//     var varPos = header.indexOf("POS");
//     var qual = header.indexOf("QUAL");
//     for (var i = 0; i < rowData.length; i++) {
//       var newRow = {};
//       for (var j = 0; j < header.length; j++) {
//         if (j === varPos || j === qual) {
//           newRow[header[j]] = Number(rowData[i].row[j]);
//         } else {
//           newRow[header[j]] = rowData[i].row[j];
//         }
//       }
//       allData.push(newRow);
//     }
//     console.log(allData);
//     if (testJsonData != undefined) {
//       const oldEnd = testJsonData.length;
//       const newEnd = allData.length;
//       console.log("Old end: ")
//       console.log(oldEnd);
//       console.log("New end: ")
//       console.log(newEnd);
//       if (oldEnd > newEnd) {
//         spreadSheetObj.delete(newEnd + 1, oldEnd, 'Row', 0);
//       }
//     }
//     setTestJsonData(allData);
//     // setTestJsonData([...testJsonData, allData]);
//   }

//   const searchRange = async () => {
//     if (searchRangeTerm != null && searchRangeTerm != "") {
//       var dataObj = await TableService.queryByRange(searchRangeTerm)
//       if (dataObj.data === "") {
//         setlabel("No variants found.");
//       } else {
//         console.log(dataObj);
//         setlabel(dataObj.data.queryName);
//         generateJSON(dataObj.data.header, dataObj.data.rowData);
//       }
//     }
//   }

//   const searchGene = async () => {
//     if (searchGeneTerm != null && searchGeneTerm != "") {
//         console.log("In searchGene.")
//         console.log(searchGeneTerm);
//         let test = searchGeneTerm
//         var dataObj = await TableService.queryByGene(test)
//         if (dataObj.data === "") {
//           setlabel("No variants found.");
//         } else {
//           setlabel(dataObj.data.queryName);
//           generateJSON(dataObj.data.header, dataObj.data.rowData);
//         }
//     }
//   }

//   const handleFileChosen = async (filePath) => {
//     // console.log({ filePath });
//     // const phenPath = phenotypeList[pathList.indexOf(filePath)];
//     // console.log(phenPath);
//     await FileService.addFile({ path: filePath, 
//       phenotypePath: phenotypeList[pathList.indexOf(filePath)], 
//       size: sizeList[sizeList.indexOf(filePath)]});
//   }

//   // useEffect(() => {
//   //   if (searchRangeTerm != null && searchRangeTerm != '') {
//   //     searchRange();
//   //   } else if (searchGeneTerm != null && searchGeneTerm != '') {
//   //     searchGene();
//   //   } else {
//   //     setlabel("Enter a search term above.");
//   //   }
//   // }, [])

//   useEffect(() => {
//     if (prevVals.current.selected != selected) {
//       setTestJsonData(undefined);
//       setSpreadSheetObj(undefined);
//       setlabel("Enter a search term above.");
//       handleFileChosen(selected);
//       prevVals.current = {selected, refresh, isClicked}
//     } else {
//       console.log("In table starting useeffect:");
//       handleFileChosen(selected);
//       if (searchGeneTerm != '' && searchGeneTerm != null && selected != null && toggleGS === true) {
//         console.log("On refresh, searching gene...");
//         searchGene();
//       } else if (searchRangeTerm != '' && searchRangeTerm != null && selected != null && toggleRS === true) {
//         console.log("On refresh, searching range...");
//         searchRange();
//       } else if (selected != null) {
//         console.log("On refresh, no existing query.");
//         setlabel("Enter a search term above.");
//         handleFileChosen(selected);
//       }
//     }

//   }, [refresh, selected, isClicked])

//   return (
//     <div className="flex flex-col h-auto w-auto ">
//     <SimplePane>
//       <div className="flex p-2 ">
//         {label != undefined && label}
//       </div>
//     </SimplePane>


    
//     <div className="flex grow px-2 py-1.5 ">
//       <div className={`flex bg-slate-100 w-full h-full drop-shadow-md `}>
//         {/* <div className="w-full h-full"> */}
//     {/* ref={(ssObj) => { this.spreadsheet = ssObj; }} dataBound={this.onDataBound.bind(this)} */}
//     {/* https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/save */}

//     {/* <SpreadsheetComponent allowSave={true} saveUrl='http://localhost:8080/gridview' ref={(ssObj) => { setSpreadSheetObj(ssObj); } } height="590" allowFiltering={true}> */}

//           { testJsonData != undefined && 
//             <SpreadsheetComponent showRibbon={false} allowSave={true} saveUrl='http://localhost:8080/gridview' ref={(ssObj) => { setSpreadSheetObj(ssObj); } } height="100%" allowFiltering={true}>

//             <SheetsDirective>
//               <SheetDirective>
//                 <RangesDirective>
//                   <RangeDirective dataSource={testJsonData}></RangeDirective>
//                 </RangesDirective>
//               </SheetDirective>
//             </SheetsDirective>
//           </SpreadsheetComponent>
//           }

//         {/* </div> */}
//       </div>
//     </div>
//   </div>
//   )
// }

// export default Table



//FILE HANDLING IN PROGRESS
// import React, { useState, useEffect } from 'react'
// import { SpreadsheetComponent, SheetsDirective, SheetDirective, RangesDirective } from '@syncfusion/ej2-react-spreadsheet';
// import { RangeDirective, ColumnsDirective, ColumnDirective } from '@syncfusion/ej2-react-spreadsheet';
// import { ContextProvider, useStateContext } from '../contexts/ContextProvider'
// import { SimplePane } from './Panes'
// import { TableContext, useTableContext } from '../contexts/TableContext';

// import TableService from '../services/TableService'
// import FileService from '../services/FileService';

// const Table = () => {
//   const { selected, phenotypeList, pathList, searchRangeTerm, searchGeneTerm, geneFileUpload, posFileUpload, toggleRS, toggleGS, refresh } = useStateContext();

//   const [label, setlabel] = useState(undefined);
//   const [jsonData, setJsonData] = useState([undefined]);
//   // const {testJsonData, setTestJsonData} = useTableContext();

//   const [spreadSheetObj, setSpreadSheetObj] = useState(undefined);
//   var testJsonData = [];

//   const generateJSON = (header, rowData, index) => {

//     var allData = [];
//     var varPos = header.indexOf("POS");
//     var qual = header.indexOf("QUAL");
//     for (var i = 0; i < rowData.length; i++) {
//       var newRow = {};
//       for (var j = 0; j < header.length; j++) {
//         if (j === varPos || j === qual) {
//           newRow[header[j]] = Number(rowData[i].row[j]);
//         } else {
//           newRow[header[j]] = rowData[i].row[j];
//         }
//       }
//       allData.push(newRow);
//     }

//     console.log("logging...");
//     console.log(testJsonData);
//     console.log("INDEX...");
//     console.log(index);
//     const dataCopy = [...testJsonData];
//     if (testJsonData.length > index && testJsonData[index] != undefined) {
//       const oldEnd = testJsonData[index].length;
//       const newEnd = allData.length;
//       console.log("Old end: ")
//       console.log(oldEnd);
//       console.log("New end: ")
//       console.log(newEnd);
//       if (oldEnd > newEnd) {
//         spreadSheetObj.delete(newEnd + 1, oldEnd, 'Row', 0);
//       }
//       // dataCopy[index] = allData
//       // setTestJsonData(dataCopy);
//     } 
//     dataCopy[index] = allData;
//     console.log("logging copy");
//     console.log(dataCopy);

//     testJsonData = [...dataCopy];
//     // setTestJsonData(dataCopy);

//   }

//   const searchPosFile = async () => {
//     console.log("Searching pos file from GridView...");
//     let retrievedData = await TableService.queryByRangeFile(posFileUpload);
//     console.log(retrievedData);
//     if (retrievedData.data === "") {
//       setlabel("No variants found.");
//     } else {
//       // if (spreadSheetObj != null && spreadSheetObj.length > 1) {
//       //   for (var i = 1; i < spreadSheetObj.length; i++) {
//       //     spreadSheetObj.delete(i);
//       //   }
//       // }
//       setlabel(retrievedData.data.queryName);
//       generateJSON(retrievedData.data.header, retrievedData.data.rowData, 0);
//       setJsonData(testJsonData);
//     }
//   }

//   const searchGeneFile = async () => {
//     console.log("Searching gene file from GridView...");
//     let retrievedData = await TableService.queryByGeneFile(geneFileUpload);
//     console.log(retrievedData);
//     if (retrievedData.data === "") {
//       setlabel("File error, please try again. View accepted file format here: ");
//     } else {
//       setlabel("Mapping genes: " +  retrievedData.data.queries);
//       for (var i = 0; i < retrievedData.data.gridViewList.length; i++) {
//         generateJSON(retrievedData.data.gridViewList[i].header, retrievedData.data.gridViewList[i].rowData, i);
        
//         // console.log(testJsonData);
//       }
//       setJsonData(testJsonData);

      
//     }
//   }

//   const searchRange = async () => {
//     if (searchRangeTerm != null && searchRangeTerm != "") {
//       var dataObj = await TableService.queryByRange(searchRangeTerm)
//       if (dataObj.data === "") {
//         setlabel("No variants found.");
//       } else {
//         // if (spreadSheetObj != null && spreadSheetObj.length > 1) {
//         //   for (var i = 1; i < spreadSheetObj.length; i++) {
//         //     spreadSheetObj.delete(i);
//         //   }
//         // }
//         console.log(dataObj);
//         setlabel(dataObj.data.queryName);
//         generateJSON(dataObj.data.header, dataObj.data.rowData, 0);
//         setJsonData(testJsonData);

//       }
//     }
//   }

//   const searchGene = async () => {
//     if (searchGeneTerm != null && searchGeneTerm != "") {
//         console.log("In searchGene.")
//         console.log(searchGeneTerm);
//         let test = searchGeneTerm
//         var dataObj = await TableService.queryByGene(test)
//         if (dataObj.data === "") {
//           setlabel("No variants found.");
//         } else {
//           console.log("getting length");
//           // console.log(spreadSheetObj.sheets.length);
//           // if (spreadSheetObj != null && spreadSheetObj.sheets.length > 1) {
//           //   for (var i = 1; i < spreadSheetObj.sheets.length; i++) {
//           //     spreadSheetObj.delete(i);
//           //   }
//           // }
//           setlabel(dataObj.data.queryName);
//           generateJSON(dataObj.data.header, dataObj.data.rowData, 0);
//           setJsonData(testJsonData);
//           console.log(spreadSheetObj.sheets.length);

//         }
//     }
//   }

//   const handleFileChosen = async (filePath) => {
//     console.log({ filePath });
//     const phenPath = phenotypeList[pathList.indexOf(filePath)];
//     console.log(phenPath);
//     await FileService.addFile({ path: filePath, phenotypePath: phenPath});
//   }

//   // useEffect(() => {
//   //   if (searchRangeTerm != null && searchRangeTerm != '') {
//   //     searchRange();
//   //   } else if (searchGeneTerm != null && searchGeneTerm != '') {
//   //     searchGene();
//   //   } else {
//   //     setlabel("Enter a search term above.");
//   //   }
//   // }, [])

//   // useEffect(() => {
//   //   console.log("DATAOBJ CHANGE!");
//   //   console.log(testJsonData);

//   // }, [testJsonData])

//   useEffect(() => {
//     console.log("In table starting useeffect:");
//     testJsonData = [];
//     if (selected != null) {
//       handleFileChosen(selected);
//     }
//     if (geneFileUpload != null && selected != null && toggleGS === true) {
//       console.log("On refresh, searching gene FILE...");
//       searchGeneFile();
//     } else if (posFileUpload != null && selected != null && toggleRS === true) {
//       console.log("On refresh, searching pos FILE...");
//       searchPosFile();
//     } else if (searchGeneTerm != '' && searchGeneTerm != null && selected != null && toggleGS === true) {
//       console.log("On refresh, searching gene...");
//       searchGene();
//     } else if (searchRangeTerm != '' && searchRangeTerm != null && selected != null && toggleRS === true) {
//       console.log("On refresh, searching range...");
//       searchRange();
//     } else if (selected != null) {
//       console.log("On refresh, no existing query.");
//       setlabel("Enter a search term above.");
//       handleFileChosen(selected);
//       // setTestJsonData([undefined]);
//     }
//   }, [refresh])

//   return (
//     <div>
//     <SimplePane>
//       <div className="flex p-2">
//         {label != undefined && label}
//       </div>
//     </SimplePane>
//     <SimplePane>
//     {/* ref={(ssObj) => { this.spreadsheet = ssObj; }} dataBound={this.onDataBound.bind(this)} */}
//     {/* https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/save */}

//     {jsonData[0] != undefined && 
//     <SpreadsheetComponent allowSave={true} saveUrl='http://localhost:8080/gridview' ref={(ssObj) => { setSpreadSheetObj(ssObj); } } height="590" allowFiltering={true} >

//       <SheetsDirective>

//         {jsonData.map((item) => (
//         <SheetDirective>
//         <RangesDirective>
//           <RangeDirective dataSource={item}></RangeDirective>
//         </RangesDirective>
//       </SheetDirective>
//         ))}
//         {/* <SheetDirective>
//           <RangesDirective>
//             <RangeDirective dataSource={testJsonData[0]}></RangeDirective>
//           </RangesDirective>
//         </SheetDirective> */}
//       </SheetsDirective>


//   </SpreadsheetComponent>
//   }
//     </SimplePane>
//     </div>
//   )
// }

// export default Table