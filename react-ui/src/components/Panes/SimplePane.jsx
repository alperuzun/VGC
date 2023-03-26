import React from 'react'
import { useStateContext } from '../../contexts/ContextProvider'

//hover:outline outline-1

const SimplePane = ({ children }) => {
  const {activeMenu, setActiveMenu} = useStateContext();
  // {activeMenu ? 'lg:w-[62rem] md:w-[45rem]' : 'lg:w-[80rem] md:w-[45rem]'}
  return (
    // <div className="px-2 py-1.5 w-full">
    //   <div className=" bg-slate-100 drop-shadow-md">
    //     {children}
    //   </div>
    // </div>

    <div className="px-2 py-1.5">
    <div className={`flex bg-slate-100 w-full drop-shadow-md `}>
      <div className="w-full">
        {children}
      </div>
    </div>
    </div>


    // <div className="px-2 py-1.5">
    //   <div className={`flex bg-slate-100 ${activeMenu ? 'xl:w-[64rem] lg:w-[52rem] md:w-[46rem] sm:w-[36rem] ' : 'xl:w-[88rem] lg:w-[76rem] md:w-[72rem] sm:w-[60rem] w-[40rem]'} drop-shadow-md `}>
    //     <div className="w-full">
    //       {children}
    //     </div>
    //   </div>
    // </div>
  )
}

export default SimplePane