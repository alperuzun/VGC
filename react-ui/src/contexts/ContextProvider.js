import React, { createContext, useContext, useState } from 'react'

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState(true);
  const [screenSize, setScreenSize] = useState(undefined);
  const [selected, setSelected] = useState(undefined);
  const [currentlyViewing, setCurrentlyViewing] = useState(undefined);

  const [pathList, setPathList] = useState([]);
  const [phenotypeList, setPhenotypeList] = useState([]);
  const [sizeList, setSizeList] = useState([]);
  const handleNewPath = (newFile) => {
    if (!pathList.includes(newFile.path)) {
      setPathList([...pathList, newFile.path]);
      setPhenotypeList([...phenotypeList, undefined])
      setSizeList([...sizeList, newFile.size]);
    }
  }
  const handlePhenotypeFileChange = (phenotypeFile, vcfPath) => {
    phenotypeList[pathList.indexOf(vcfPath)] = phenotypeFile.path;
  }

  const [graphData, setGraphData] = useState(undefined);
  const [searchRangeTerm, setSearchRangeTerm] = useState(undefined);
  const [searchGeneTerm, setSearchGeneTerm] = useState(undefined);
  const [geneFileUpload, setGeneFileUpload] = useState(undefined);
  const [posFileUpload, setPosFileUpload] = useState(undefined);
  const [toggleRS, setToggleRS] = useState(false);
  const [toggleGS, setToggleGS] = useState(false);
  const [refresh, setRefresh] = useState(false);



  
  return (
    <StateContext.Provider
      value={{
        activeMenu, setActiveMenu,
        screenSize, setScreenSize,
        selected, setSelected,
        graphData, setGraphData,
        currentlyViewing, setCurrentlyViewing,
        pathList, setPathList, handleNewPath,
        phenotypeList, setPhenotypeList,handlePhenotypeFileChange,
        sizeList, setSizeList,
        searchRangeTerm, setSearchRangeTerm,
        searchGeneTerm, setSearchGeneTerm,
        geneFileUpload, setGeneFileUpload,
        posFileUpload, setPosFileUpload,
        toggleRS, setToggleRS,
        toggleGS, setToggleGS,
        refresh, setRefresh
      }}
    >
      { children }
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);