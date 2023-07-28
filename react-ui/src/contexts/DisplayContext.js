import React, { createContext, useContext, useState } from 'react'

const StateContext = createContext();

const initialState = {
  variantData: false,
  barGraph: false,
  nodeGraph: false,
  compareSamples: false,
  geneData: false
}


export const DisplayContext = ({ children }) => {
  const [isClicked, setIsClicked] = useState(initialState);
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
 