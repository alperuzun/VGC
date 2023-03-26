import React, { createContext, useContext, useState } from 'react'

const StateContext = createContext();

const initialState = {
  variantData: false,
  barGraph: false,
  nodeGraph: false,
  compareSamples: false,
  geneData: false
}

const initialBarType = {
  variantGraph: false,
  DPGraph: false,
  QUALGraph: false
}


export const DisplayContext = ({ children }) => {
  const [isClicked, setIsClicked] = useState(initialState);
  const [barType, setBarType] = useState(initialBarType);
  const [mouseOver, setMouseOver] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [errorPopup, setErrorPopup] = useState(false);
  const [browserQuery, setBrowserQuery] = useState(undefined);


  const checkClicked = () => {
    if (isClicked === initialState) {
      return true;
    }
    return false;
  }

  const handleClick = (clicked) => {
    setIsClicked({...initialState, [clicked]:true});
  }

  return (
    <StateContext.Provider
      value={{
        isClicked, 
        setIsClicked,
        handleClick,
        checkClicked,
        initialState,
        barType,
        setBarType,
        mouseOver,
        setMouseOver, 
        dropdown,
        setDropdown,
        errorPopup,
        setErrorPopup,
        browserQuery,
        setBrowserQuery,
      }}
    >
      { children }
    </StateContext.Provider>
  )
}

export const useDisplayContext = () => useContext(StateContext);
 