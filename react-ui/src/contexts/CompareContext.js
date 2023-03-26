import React, { createContext, useContext, useState } from 'react'

const StateContext = createContext();

export const CompareContext = ({ children }) => {

    const [mapObj, setMapObj] = useState(undefined);


  return (
    <StateContext.Provider
      value={{
        mapObj, setMapObj
      }}
    >
      { children }
    </StateContext.Provider>
  )
}

export const useCompareContext = () => useContext(StateContext);
