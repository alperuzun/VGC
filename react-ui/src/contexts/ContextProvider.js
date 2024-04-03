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
  const [refList, setRefList] = useState([]);

  const handleNewPath = (newFile, refGenome) => {
    if (!pathList.includes(newFile.path)) {
      setPathList([...pathList, newFile.path]);
      setPhenotypeList([...phenotypeList, undefined])
      setSizeList([...sizeList, newFile.size]);
      setRefList([...refList, refGenome]);
    }
  }
  const handleRemovePath = (removeFilePath) => {
    var indexOfDeleted = pathList.indexOf(removeFilePath);
    var pathCopy = [...pathList];
    pathCopy.splice(indexOfDeleted, 1)
    var phenotypeCopy = [...phenotypeList];
    phenotypeCopy.splice(indexOfDeleted, 1);
    var sizeCopy = [...sizeList];
    sizeCopy.splice(indexOfDeleted, 1);
    var refCopy = [...refList];
    refCopy.splice(indexOfDeleted, 1);

    setPathList(pathCopy);
    setPhenotypeList(phenotypeCopy);
    setSizeList(sizeCopy);
    setRefList(refCopy);

    if (pathCopy.length === 0) {
      setSelected(undefined);
    } else if (indexOfDeleted === pathCopy.length) {
      setSelected(pathCopy[indexOfDeleted - 1]);
    } else {
      setSelected(pathCopy[indexOfDeleted]);
    }
    setSearchGeneTerm("");
    setSearchRangeTerm("");
    setGeneFileUpload(undefined);
    setPosFileUpload(undefined)
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
        pathList, setPathList, handleNewPath, handleRemovePath,
        phenotypeList, setPhenotypeList,handlePhenotypeFileChange,
        sizeList, setSizeList,
        refList, setRefList,
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