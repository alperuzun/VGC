import React, { useRef, useState, useEffect } from 'react'
import { useDisplayContext } from '../contexts/DisplayContext';
import { BsChevronDown, BsChevronRight, BsCheck2Circle, BsCircle } from 'react-icons/bs';
import { AiOutlineCheck } from 'react-icons/ai';
import { useStateContext } from '../contexts/ContextProvider';
import FileService from '../services/FileService';
import GeneService from '../services/GeneService';
import TabBar from './TabBar';





import '../css/TreeView.css';




const TreeView = () => {

  const { selected, setSelected, phenotypeList, pathList, handleRemovePath, sizeList, refList, currentlyViewing, setCurrentlyViewing, searchRangeTerm, setSearchRangeTerm, searchGeneTerm, setSearchGeneTerm, toggleRS, setToggleRS, toggleGS, setToggleGS, geneFileUpload, posFileUpload, setRefresh, refresh } = useStateContext();

  const { browserQuery, setBrowserQuery, isClicked } = useDisplayContext();

  const [treeObj, setTreeObj] = useState(undefined);
  const [treeObjList, setTreeObjList] = useState(undefined);

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

  const [processing, setProcessing] = useState(false);

  const prevVals = useRef({ selected, refresh, isClicked });


  const handleSave = () => {

  }

  const searchGeneFile = async () => {
    if (geneFileUpload !== undefined) {

      setProcessing(true);
      try {
        let retrievedData = await GeneService.getTreeForGeneFile(geneFileUpload, passFilter)
        const tempTreeObjList = retrievedData.data.treeViewList;
        setTreeObjList(tempTreeObjList);
        setQueryList(retrievedData.data.queries);
        setTreeObj(tempTreeObjList[0]);
      } catch (error) {
        alert(error.response.data.message);
      } finally {
        setProcessing(false);
      }
    }
  }


  const searchGene = async () => {
    if (searchGeneTerm !== undefined && searchGeneTerm != "") {

      setProcessing(true);
      try {
        let retrievedData = await GeneService.getTreeForGene(passFilter, searchGeneTerm)
        setQueryList([searchGeneTerm]);
        setTreeObj(retrievedData.data);
        setTreeObjList([retrievedData.data]);
      } catch (error) {
        alert(error.response.data.message);
      } finally {
        setProcessing(false);
      }
    }
  }



  const handleFileChosen = async (filePath) => {
    try {
      await FileService.addFile({
        path: filePath,
        phenotypePath: phenotypeList[pathList.indexOf(filePath)],
        size: sizeList[pathList.indexOf(filePath)],
        refGenome: refList[pathList.indexOf(filePath)]
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
        searchGeneFile();
      } else if (searchGeneTerm != '' && searchGeneTerm != null && selected != null && toggleGS === true) {
        searchGene();
      } else if (selected != null) {
        handleFileChosen(selected);
      }
    }

  }, [refresh, selected, isClicked])


  const TabButton = ({ name, width }) => {

    return (

      <div className={`flex h-7  min-w-min whitespace-nowrap text-[#3f89c7] text-sm px-3 items-center justify-center cursor-pointer border-b-2 ${queryList.indexOf(name) == selectedTab ? "bg-slate-100 text-[#3f89c7] border-[#3f89c7] " : "bg-slate-300 text-slate-700 hover:text-slate-500 hover:bg-slate-200 border-slate-400 border-transparent"}`} onClick={() => {
        setSelectedTab(queryList.indexOf(name));
        setTreeObj(treeObjList[queryList.indexOf(name)])
        }}>
        {name}
      </div>
    )
  }

  const FilterButton = () => {
    return (
      <div className="flex flex-row">
        <div className=" text-sm justify-center p-1">
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
                onClick={() => { setActiveFilterSelect(false); setPassFilter("PASS"); setRefresh(!refresh); }}>
                PASS
              </li>
              <li className={`w-20 flex justify-center cursor-pointer ${passFilter == "ALL" ? "hover:bg-slate-200 bg-slate-200" : "bg-white hover:bg-slate-100"} py-1`}
                onClick={() => { setActiveFilterSelect(false); setPassFilter("ALL"); setRefresh(!refresh); }}>
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
            {itemsToMap != null && itemsToMap.map((item) => (
              <span className="text-xs break-words border-b-1 border-slate-300 px-2 py-0.5">{item}</span>
            ))}
          </div>
        }
      </div>
    )
  }

  const handleSetBrowserQuery = (setString) => {
    if (refList[pathList.indexOf(selected)] === "GRCh37") {
      setBrowserQuery(setString + "?dataset=gnomad_r2_1");
    } else {
      setBrowserQuery(setString + "?dataset=gnomad_r4");
    }
  }




  return (
    <div className="flex w-full h-full flex-col items-center ">

        {processing && 
        <div className="absolute inset-0 bg-slate-200 bg-opacity-60 flex flex-col z-[70]">
          <div className="bg-slate-300 py-0.5 px-6 text-xs">Loading, please wait...</div>
        </div>
        }
      
      <div className="flex flex-row h-7 w-full bg-slate-200 " >
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

              <div className="flex items-center justify-evenly flex-row">
                <div className="flex flex-row justify-center">
                  <div className="font-bold">Gene: </div>
                  <div className="py-1 px-2">{treeObj.gene}</div>
                </div>
                <FilterButton />
                {/* Future Addition: Adding download option for gene data. */}
                {/* <button onClick={handleSave} className="flex p-0.5 w-20 text-sm justify-center rounded-full border-1 border-slate-500  hover:bg-slate-200 ">
                  Save
                </button> */}
              </div>

              {treeObj.omimInformation != null && treeObj.omimInformation.map((item) => (
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
                  {treeObj.pathogenicVariants != null && treeObj.pathogenicVariants.map((item) => (
                    <button className="flex w-full items-center " onClick={() => handleSetBrowserQuery("region/" + treeObj.chr + "-" + item + "-" + item)}>
                      <span className="flex w-full justify-center text-xs break-normal p-1 border-t-1 border-slate-300 px-2 hover:bg-slate-100">Position: {item}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className={`flex flex-col p-1 h-full w-1/3`}>
                <span className={`flex items-center w-full text-gray-50 bg-[#83b48a] justify-center`}>Benign</span>
                <div className="flex-col overflow-y-scroll bg-slate-50 flex-grow w-full items-center">
                  {treeObj.benignVariants != null && treeObj.benignVariants.map((item) => (
                    <button className="flex w-full items-center" onClick={() => { handleSetBrowserQuery("region/" + treeObj.chr + "-" + item + "-" + item);  }}>
                      <span className="flex w-full justify-center text-xs break-normal p-1 border-t-1 border-slate-300 px-2 hover:bg-slate-100">
                        Position: {item}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className={`flex flex-col p-1 h-full w-1/3 `}>
                <span className={`flex items-center w-full text-gray-50 bg-[#919191] justify-center`}>No Consensus</span>
                <div className="flex flex-col overflow-y-scroll bg-slate-50 flex-grow w-full items-center">
                  {treeObj.noConsensus != null && treeObj.noConsensus.map((item) => (
                    <button className="flex w-full items-center" onClick={() => { handleSetBrowserQuery("region/" + treeObj.chr + "-" + item + "-" + item); }}>
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


