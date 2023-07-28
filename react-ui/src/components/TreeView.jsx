import React, { useRef, useState, useEffect } from 'react'
// import * as d3 from 'd3';
// import { useD3 } from '../hooks/useD3';
import { useDisplayContext } from '../contexts/DisplayContext';
import { BsChevronDown, BsChevronRight, BsCheck2Circle, BsCircle } from 'react-icons/bs';
import { AiOutlineCheck } from 'react-icons/ai';
import { useStateContext } from '../contexts/ContextProvider';
import FileService from '../services/FileService';
import GeneService from '../services/GeneService';





import '../css/TreeView.css';




const TreeView = () => {

  const { selected, setSelected, phenotypeList, pathList, sizeList, currentlyViewing, setCurrentlyViewing, searchRangeTerm, setSearchRangeTerm, searchGeneTerm, setSearchGeneTerm, toggleRS, setToggleRS, toggleGS, setToggleGS, geneFileUpload, posFileUpload, refresh } = useStateContext();

  const { browserQuery, setBrowserQuery, isClicked } = useDisplayContext();

  const [treeObj, setTreeObj] = useState(undefined);
  const [treeObjList, setTreeObjList] = useState(undefined);

  // const [processedTree, setProcessedTree] = useState(undefined);
  // const [processedTreeList, setProcessedTreeList] = useState(undefined);

  const [queryList, setQueryList] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);

  const [activeFilterSelect, setActiveFilterSelect] = useState(false);
  const [passFilter, setPassFilter] = useState("ALL");

  const [activeMF, setActiveMF] = useState(true);
  const [activeCC, setActiveCC] = useState(true);
  const [activeBP, setActiveBP] = useState(true);
  const [activeBioCarta, setActiveBioCarta] = useState(true);
  const [activeKEGG, setActiveKEGG] = useState(true);
  const [activePID, setActivePID] = useState(true);
  const [activeReactome, setActiveReactome] = useState(true);

  const prevVals = useRef({ selected, refresh, isClicked });



  const searchGeneFile = async () => {
    if (geneFileUpload !== undefined) {
      console.log("Searching gene file from TreeView...");
      let retrievedData = await GeneService.getTreeForGeneFile(geneFileUpload, passFilter)
      if (retrievedData.data !== "") {
        const tempTreeObjList = retrievedData.data.treeViewList;
        setTreeObjList(tempTreeObjList);
        setQueryList(retrievedData.data.queries);
        setTreeObj(tempTreeObjList[0]);
        console.log(retrievedData);
      }

    }

  }


  const searchRange = async () => {
    if (searchRangeTerm !== undefined && searchRangeTerm != "") {
      console.log("Searching range from TreeView...")
      let retrievedData = await GeneService.getTreeForRange(passFilter, searchRangeTerm)
      if (retrievedData.data !== "") {
        console.log(retrievedData);
      }
    }
  }

  const searchGene = async () => {
    if (searchGeneTerm !== undefined && searchGeneTerm != "") {
      console.log("Searching gene from TreeView...")
      let retrievedData = await GeneService.getTreeForGene(passFilter, searchGeneTerm)
      if (retrievedData.data !== "") {
        console.log(retrievedData);
        console.log("Logging goTermsBP...");
        console.log(retrievedData.data.goTermsBP);

        setQueryList([searchGeneTerm]);
        setTreeObj(retrievedData.data);
        setTreeObjList([retrievedData.data]);

      }
    }
  }



  const handleFileChosen = async (filePath) => {
    await FileService.addFile({
      path: filePath,
      phenotypePath: phenotypeList[pathList.indexOf(filePath)],
      size: sizeList[sizeList.indexOf(filePath)]
    });
    const fileInfo = await FileService.getFileInfo();
    setCurrentlyViewing(fileInfo.data);
  }

  useEffect(() => {
    console.log("In nodeview starting useeffect:");
    if (prevVals.current.selected != selected) {
      setTreeObj(undefined);
      setTreeObjList(undefined);
      setQueryList([]);
      setSelectedTab(0);
      setActiveFilterSelect(false);
      if (selected != null) {
        handleFileChosen(selected);
      }
      prevVals.current = { selected, refresh, isClicked }
    } else {
      if (geneFileUpload != null && selected != null && toggleGS === true) {
        console.log("On refresh, searching gene FILE...");
        searchGeneFile();
      } else if (searchGeneTerm != '' && searchGeneTerm != null && selected != null && toggleGS === true) {
        console.log("On refresh, searching gene...");
        searchGene();
      } else if (searchRangeTerm != '' && searchRangeTerm != null && selected != null && toggleRS === true) {
        console.log("On refresh, searching range...");
        searchRange();
      } else if (selected != null) {
        console.log("On refresh, no existing query.");
        handleFileChosen(selected);
      }
    }

  }, [refresh, selected, isClicked])


  const TabButton = ({ name, width }) => {

    return (
      <div className="flex h-8 items-center ">
        <div className={`flex h-6 w-[` + width + `rem] text-white text-sm px-3 rounded-t-lg justify-center cursor-pointer ${queryList.indexOf(name) == selectedTab ? "bg-[#3f89c7]" : "bg-slate-400 "}`} onClick={() => {
          setSelectedTab(queryList.indexOf(name));
          setTreeObj(treeObjList[queryList.indexOf(name)])

          console.log("Printing selected tab index...");
          console.log(selectedTab);
          console.log("Printing selected tab index...");
          console.log(queryList.indexOf(name));
        }}>
          {name}
        </div>
      </div>
    )
  }

  const DataColumn = ({ title, mapData, width, height, titleColor, itemColor, titleOnClick, itemOnClick }) => {
    console.log(itemColor)

    return (
      <div className={`flex flex-col p-2 w-1/3`}>
        <span className={`flex items-center w-full text-gray-50 bg-[${itemColor}]`}>{title}</span>
        <div className="flex flex-col overflow-auto bg-slate-200 h-[30rem]">
          {mapData.map((item) => (
            <span className="text-sm break-normal">{item}</span>
          ))}
        </div>
      </div>
    )
  }

  const DataRow = ({ title, mapData, width, height, titleColor, itemColor, titleOnClick, itemOnClick }) => {
    return (
      <div className={`flex flex-col p-2 h-[10rem] w-full`}>
        <span>{title}</span>
        <div className="flex flex-col overflow-auto bg-slate-200 ">
          {mapData.map((item) => (
            <span className="text-sm break-normal">{item}</span>
          ))}
        </div>
      </div>
    )
  }

  const FilterButton = () => {
    return (
      <div className="flex flex-row">
        <div className="ml-12 text-sm justify-center p-1">
          FILTER:
        </div>
        <div className="flex-col">
          <button
            type="button"
            className={`flex p-1 ml-1 w-20 text-sm justify-center rounded-sm hover:bg-slate-300 ${1 == 1 ? 'bg-slate-300' : 'bg-slate-200'}`}
            onClick={() => {
              setActiveFilterSelect(!activeFilterSelect)
            }}>
            {passFilter}
          </button>
          <div className={`${activeFilterSelect ? "" : "hidden"} flex ml-1 justify-center z-40 fixed w-20  rounded-sm shadow`}>
            <ul class="text-sm text-gray-700 dark:text-gray-200 divide-y">
              <li className={`w-20 flex justify-center cursor-pointer ${passFilter == "PASS" ? "hover:bg-slate-200 bg-slate-200" : "bg-white hover:bg-slate-100"}  py-1`}
                onClick={() => { setActiveFilterSelect(false); setPassFilter("PASS") }}>
                PASS
              </li>
              <li className={`w-20 flex justify-center cursor-pointer ${passFilter == "ALL" ? "hover:bg-slate-200 bg-slate-200" : "bg-white hover:bg-slate-100"} py-1`}
                onClick={() => { setActiveFilterSelect(false); setPassFilter("ALL") }}>
                ALL
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  const MsigdbData = ({ itemsToMap, viewState, setViewState, title }) => {
    return (
      <div className="flex flex-col h-[11rem] w-full mb-2">
        <span className="flex w-full bg-slate-300 border-y-1 px-2 items-center">
          <div className="flex px-2 hover:text-slate-400 cursor-pointer" onClick={() => setViewState(!viewState)}>{viewState ? <BsChevronDown /> : <BsChevronRight />}</div>
          {title}
        </span>
        {viewState &&
          <div className={`flex flex-col overflow-auto bg-slate-50 px-2`}>
            {itemsToMap.map((item) => (
              <span className="text-xs break-words border-b-1 border-slate-300 px-2 py-0.5">{item}</span>
            ))}
          </div>
        }
      </div>
    )
  }




  return (
    <div className="flex w-full h-full flex-col items-center">
      
      <div className="flex flex-row h-8 w-full bg-slate-200">
        {queryList.map((item) => (
          <TabButton
            name={item}
            width={12}
          />
        ))}
      </div>

      {treeObj !== undefined &&
        <div className="flex flex-row h-full w-full ">

          <div className="flex h-full flex-col w-1/2 p-2">

            <div className="flex h-1/8 flex-col">

              <div className="flex items-center flex-row">
                <div className="font-bold">Gene: </div>
                <div className="py-1 px-2">{treeObj.gene}</div>
                <FilterButton />
              </div>

              {treeObj.omimInformation.map((item) => (
                <div className="flex flex-row">
                  <div className="flex font-bold">OMIM Information: </div>
                  <div className="font-normal flex px-2">{item}</div>
                </div>
              ))}
              <span className="flex font-bold">Variants: </span>
            </div>
            <div className="flex flex-row w-full h-5/6 p-2 ">
              <div className={`flex flex-col p-1 h-full w-1/3`}>
                <span className={`flex items-center w-full text-gray-50 bg-[#ac6161] justify-center`}>Pathogenic</span>
                <div className="flex-col overflow-y-scroll bg-slate-50 flex-grow w-full items-center">
                  {treeObj.pathogenicVariants.map((item) => (
                    <button className="flex w-full items-center " onClick={() => setBrowserQuery("region/" + treeObj.chr + "-" + item + "-" + item)}>
                      <span className="flex w-full justify-center text-xs break-normal p-1 border-t-1 border-slate-300 px-2 hover:bg-slate-100">Position: {item}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className={`flex flex-col p-1 h-full w-1/3`}>
                <span className={`flex items-center w-full text-gray-50 bg-[#83b48a] justify-center`}>Benign</span>
                <div className="flex-col overflow-y-scroll bg-slate-50 flex-grow w-full items-center">
                  {treeObj.benignVariants.map((item) => (
                    <button className="flex w-full items-center" onClick={() => { setBrowserQuery("region/" + treeObj.chr + "-" + item + "-" + item); console.log("region/" + treeObj.chr + "-" + item + "-" + item) }}>
                      <span className="flex w-full justify-center text-xs break-normal p-1 border-t-1 border-slate-300 px-2 hover:bg-slate-100">
                        Position: {item}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className={`flex flex-col p-1 h-full w-1/3 `}>
                <span className={`flex items-center w-full text-gray-50 bg-[#919191] justify-center`}>No Consensus</span>
                <div className="flex flex-col overflow-y-scroll bg-slate-50 flex-grow w-full items-center">
                  {treeObj.noConsensus.map((item) => (
                    <button className="flex w-full items-center" onClick={() => { setBrowserQuery("region/" + treeObj.chr + "-" + item + "-" + item); console.log("region/" + treeObj.chr + "-" + item + "-" + item) }}>
                      <span className="flex w-full justify-center text-xs break-normal p-1 border-t-1 border-slate-300 px-2 hover:bg-slate-100">Position: {item}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col max-h-min mx-2 mt-2 mb-10 p-4 w-1/2  bg-white rounded-xl overflow-y-scroll shadow-md">
            <div className="flex flex-row p-1 w-full items-center ">
              <div className="flex w-1/3 bg-[#3f89c7] h-0.5 "></div>
              <span className="flex w-1/3 p-1 text-lg justify-center text-[#3f89c7] font-bold">MSigdb Data</span>
              <div className="flex w-1/3 bg-[#3f89c7] h-0.5 "></div>
            </div>

            <MsigdbData
              itemsToMap={Object.keys(treeObj.goTermsBP)}
              viewState={activeBP}
              setViewState={setActiveBP}
              title="Biological Process"
            />

            <MsigdbData
              itemsToMap={Object.keys(treeObj.goTermsCC)}
              viewState={activeCC}
              setViewState={setActiveCC}
              title="Cellular Component"
            />
 
            <MsigdbData
              itemsToMap={Object.keys(treeObj.goTermsMF)}
              viewState={activeMF}
              setViewState={setActiveMF}
              title="Molecular Function"
            />

            <MsigdbData
              itemsToMap={Object.keys(treeObj.biocarta)}
              viewState={activeBioCarta}
              setViewState={setActiveBioCarta}
              title="BioCarta Pathway"
            />

            <MsigdbData
              itemsToMap={Object.keys(treeObj.kegg)}
              viewState={activeKEGG}
              setViewState={setActiveKEGG}
              title="KEGG Pathway"
            />

            <MsigdbData
              itemsToMap={Object.keys(treeObj.pid)}
              viewState={activePID}
              setViewState={setActivePID}
              title="PID Pathway"
            />

            <MsigdbData
              itemsToMap={Object.keys(treeObj.reactome)}
              viewState={activeReactome}
              setViewState={setActiveReactome}
              title="Reactome Pathway"
            /> 

          </div>
        </div>
      }
    </div>
  )
}

export default TreeView


