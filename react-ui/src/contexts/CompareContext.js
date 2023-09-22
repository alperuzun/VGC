import React, { createContext, useContext, useState } from 'react'

const StateContext = createContext();

export const CompareContext = ({ children }) => {

    const [mapObj, setMapObj] = useState(undefined);
    const [replicates, setReplicates] = useState("2000");



  return (
    <StateContext.Provider
      value={{
        mapObj, setMapObj,
        replicates, setReplicates

      }}
    >
      { children }
    </StateContext.Provider>
  )
}

export const useCompareContext = () => useContext(StateContext);
