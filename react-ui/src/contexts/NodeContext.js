import React, { createContext, useContext, useState } from 'react'

const StateContext = createContext();

const initialState = {
  nodes: [],
  links: [],
}

export const NodeContext = ({ children }) => {
  // const [nlData, setNLData] = useState(initialState);
  const [nlData, setNLData] = useState([]);

  const [dataObj, setDataObj] = useState(undefined);
  const [view2D, setView2D] = useState(true);
  const [view3D, setView3D] = useState(false);
  const [nodeSize, setNodeSize] = useState("UNIFORM");
  const [gtList, setGtList] = useState([false, true, true]);
  const [passFilter, setPassFilter] = useState("PASS");
  const [highlightFormat, setHighlightFormat] = useState("None");
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [sampleColors, setSampleColors] = useState([]);
  const [variantColor, setVariantColor] = useState("#3f89c7");
  const [patientGroupings, setPatientGroupings] = useState("VISIBLE");


  //For multiples genes/file queries: 
  const [queryList, setQueryList] = useState([]);
  const [currView, setCurrView] = useState(undefined);
  const [currDataObj, setCurrDataObj] = useState(undefined);




  const checkEmpty = () => {
    if (nlData.nodes == [] && nlData.links == []) {
      return true;
    }
    return false;
  }

  return (
    <StateContext.Provider
      value={{
        nlData,
        setNLData,
        checkEmpty,
        dataObj, 
        setDataObj,
        view2D,
        setView2D,
        view3D,
        setView3D,
        nodeSize,
        setNodeSize,
        gtList,
        setGtList,
        passFilter,
        setPassFilter,
        highlightFormat,
        setHighlightFormat,
        settingsVisible, 
        setSettingsVisible,
        sampleColors,
        setSampleColors,
        variantColor, 
        setVariantColor,
        queryList,
        setQueryList,
        currView, 
        setCurrView,
        currDataObj, 
        setCurrDataObj,
        patientGroupings, 
        setPatientGroupings
        // clickedNode, 
        // setClickedNode,
      }}
    >
      { children }
    </StateContext.Provider>
  )
}

export const useNodeContext = () => useContext(StateContext);