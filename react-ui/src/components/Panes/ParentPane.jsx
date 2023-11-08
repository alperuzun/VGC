import React, { useEffect } from 'react'
import { useStateContext } from '../../contexts/ContextProvider';
import { useDisplayContext } from '../../contexts/DisplayContext';
import FileService from '../../services/FileService';

const ParentPane = ({ children }) => {
  const { activeMenu, selected, currentlyViewing, setCurrentlyViewing } = useStateContext();

  if (activeMenu) {
    return (
      <div className="grow mt-[88px] ml-96 z-10 justify-center p-2 overflow-auto">
        <div className="w-full h-full p-2 z-40 ">
          {children}
        </div>
      </div>
    )
  } else {
    return (
      <div className="grow mt-[88px] ml-0 z-10 justify-center p-2">
        <div className="w-full h-full p-2 z-40">{children}</div>
      </div>
    )
  }

}

export default ParentPane
