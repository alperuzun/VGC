import React from 'react'
import { useStateContext } from '../../contexts/ContextProvider'

const SimplePane = ({ children }) => {
  const {activeMenu, setActiveMenu} = useStateContext();
  return (
    <div className="px-2 py-1.5">
    <div className={`flex bg-slate-100 w-full drop-shadow-md `}>
      <div className="w-full">
        {children}
      </div>
    </div>
    </div>
  )
}

export default SimplePane