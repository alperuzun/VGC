import React, { createContext, useContext, useState } from 'react'

const StateContext = createContext();

export const GeneContext = ({ children }) => {
  return (
    <StateContext.Provider
      value={{
      }}
    >
      { children }
    </StateContext.Provider>
  )
}

export const useGeneContext = () => useContext(StateContext);

