import React from 'react'
import { useStateContext } from '../../contexts/ContextProvider'


const DisplayPane = ({ children }) => {
  const { selected, activeMenu } = useStateContext();

  if (selected == undefined) {
    return (
      <div className={ `flex fixed p-1 w-full h-full justify-between`}>
          {children}
      </div>
    )
  } else {
    return (
      <div className="flex-col fixed p-1 w-full h-full justify-between">
        {children}
      </div>
    )
  }

}

export default DisplayPane