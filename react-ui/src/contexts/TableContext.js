import React, { createContext, useContext, useState, useEffect } from 'react';

const StateContext = createContext();


export const TableContext = ({ children }) => {

  const [testJsonData, setTestJsonData] = useState([]);

  return (<StateContext.Provider value={{
    testJsonData, 
    setTestJsonData
  }}>
    {children}
  </StateContext.Provider>)
}

export const useTableContext = () => useContext(StateContext);
