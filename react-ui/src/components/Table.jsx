import React, { useRef, useState, useEffect } from 'react'
import { SpreadsheetComponent, SheetsDirective, SheetDirective, RangesDirective } from '@syncfusion/ej2-react-spreadsheet';
import { RangeDirective, ColumnsDirective, ColumnDirective } from '@syncfusion/ej2-react-spreadsheet';
import { ContextProvider, useStateContext } from '../contexts/ContextProvider'
import TableService from '../services/TableService'
import FileService from '../services/FileService';
import NoFileUploaded from './NoFileUploaded';
import { useDisplayContext } from '../contexts/DisplayContext';

const Table = () => {
  const { selected, setSelected, phenotypeList, pathList, sizeList, currentlyViewing, setCurrentlyViewing, searchRangeTerm, setSearchRangeTerm, searchGeneTerm, setSearchGeneTerm, toggleRS, setToggleRS, toggleGS, setToggleGS, refresh, setRefresh, handleRemovePath } = useStateContext();
  const { isClicked } = useDisplayContext();

  const [label, setlabel] = useState(undefined);
  const [testJsonData, setTestJsonData] = useState(undefined);
  const [spreadSheetObj, setSpreadSheetObj] = useState(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const [windowSize, setWindowSize] = useState({ height: window.innerHeight });
  const [processing, setProcessing] = useState(false);


  const prevVals = useRef({ selected, refresh, isClicked });

  const handleSave = (type) => {
    if (spreadSheetObj != undefined) {
      console.log(type);
      spreadSheetObj.save({ url: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/save', fileName: "Sample", saveType: type });
    } else {
      alert("Please enter a query to save results. ");
    }
    setIsOpen(false)
  }

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
  }

  const searchRange = async () => {
    setProcessing(true);
    try {
      if (searchRangeTerm != null && searchRangeTerm != "") {
        var dataObj = await TableService.queryByRange(searchRangeTerm)
        console.log(dataObj);
        setlabel(dataObj.data.queryName);
        generateJSON(dataObj.data.header, dataObj.data.rowData);
      }
    } catch (error) {
      alert(error.response.data.message);    
    } finally {
      setProcessing(false);
    }

  }

  const searchGene = async () => {
    setProcessing(true);
    try {
      if (searchGeneTerm != null && searchGeneTerm != "") {
        console.log("In searchGene.")
        console.log(searchGeneTerm);
        let test = searchGeneTerm
        var dataObj = await TableService.queryByGene(test)
        setlabel(dataObj.data.queryName);
        generateJSON(dataObj.data.header, dataObj.data.rowData);
      }
    } catch (error) {
      alert(error.response.data.message);    
    } finally {
      setProcessing(false);
    }

  }

  const handleFileChosen = async (filePath) => {
    try {
      await FileService.addFile({
        path: filePath,
        phenotypePath: phenotypeList[pathList.indexOf(filePath)],
        size: sizeList[sizeList.indexOf(filePath)]
      });
      const fileInfo = await FileService.getFileInfo();
      setCurrentlyViewing(fileInfo.data);
    } catch (error) {
      handleRemovePath(filePath);
      alert(error.response.data.message);
    }
  }

  useEffect(() => {
    if (prevVals.current.selected != selected) {
      setTestJsonData(undefined);
      setSpreadSheetObj(undefined);
      setlabel("Enter a search term above.");
      handleFileChosen(selected);
      prevVals.current = { selected, refresh, isClicked }
    } else {
      console.log("In table starting useeffect:");
      if (selected !== null && selected !== undefined) {
        handleFileChosen(selected);
        if (searchGeneTerm != '' && searchGeneTerm != null && toggleGS === true) {
          console.log("On refresh, searching gene...");
          searchGene();
        } else if (searchRangeTerm != '' && searchRangeTerm != null && toggleRS === true) {
          console.log("On refresh, searching range...");
          searchRange();
        } else {
          console.log("On refresh, no existing query.");
          setlabel("Enter a search term above.");
        }
      } 
    }

  }, [refresh, selected, isClicked])

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (spreadSheetObj) {
      spreadSheetObj.refresh();
    }
  }, [windowSize, spreadSheetObj]);

  const Dropdown = () => {
    return (
      <div className="relative px-2 inline-block text-left">
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

  if (selected === null || selected === undefined) {
    return (
      <div className="flex w-full h-full overflow-x-clip">
        <div className="flex w-full h-full">
          <NoFileUploaded noVCF={true}/>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="px-2 py-1.5">
        <div className={`flex bg-slate-50 border-1 border-slate-300 w-full rounded-lg`}>
          <div className="w-full h-min">
            <div className="flex p-2 text-sm">
              {label != undefined && label}
            </div>
          </div>
        </div>
      </div>
      <Dropdown />
      <div className="flex grow px-2 py-1.5 h-full w-full">
        <div className={`flex bg-slate-100 w-full  drop-shadow-md `}>
        {processing && 
        <div className="absolute inset-0 bg-slate-200 bg-opacity-60 flex flex-col z-[70]">
          <div className="bg-slate-300 py-0.5 px-6 text-xs">Loading, please wait...</div>
        </div>
        }
          {testJsonData != undefined &&
            <SpreadsheetComponent showRibbon={false} allowSave={true} saveUrl='http://localhost:8080/gridview' ref={(ssObj) => { setSpreadSheetObj(ssObj); }} allowFiltering={true}>
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
