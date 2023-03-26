import React, { useEffect } from 'react'
import { useStateContext } from '../../contexts/ContextProvider';
import { useDisplayContext } from '../../contexts/DisplayContext';
import FileService from '../../services/FileService';

const ParentPane = ({ children }) => {
  const { activeMenu, selected, currentlyViewing, setCurrentlyViewing } = useStateContext();
  // if (activeMenu) {
  //   return (
  //     <div className="mt-[75px] ml-96 w-auto h-auto bg-slate-700">
  //       {children}
  //     </div>
  //   )
  // } else {
  //   return (
  //     <div className="mt-[75px] ml-0 w-auto h-auto bg-slate-700">
  //       {children}
  //     </div>
  //   )
  // }

  //2/2
  // if (activeMenu) {
  //   return (
  //     <div className="grow mt-[75px] ml-96 z-10 justify-center p-2">
  //       <div className="w-full h-full p-2 z-40">
  //         {children}
  //       </div>
  //     </div>
  //   )
  // } else {
  //   return (
  //     <div className="grow mt-[75px] ml-0 z-10 justify-center p-2">
  //       <div className="w-full h-full p-2 z-40 ">{children}</div>
  //     </div>
  //   )
  // }

  if (activeMenu) {
    return (
      <div className="grow mt-[75px] ml-96 z-10 justify-center p-2 ">
        <div className="w-full h-full p-2 z-40 overflow-scroll">
          {children}
        </div>
      </div>
    )
  } else {
    return (
      <div className="grow mt-[75px] ml-0 z-10 justify-center p-2">
        <div className="w-full h-full p-2 z-40 overflow-scroll">{children}</div>
      </div>
    )
  }

}

export default ParentPane

// if (activeMenu) {
//   return (
//     <div className="flex mt-12 ml-60 fixed z-0">
//       <div className="flex flex-wrap lg:flex-nowrap">
//         <div className="flex h-full w-full p-10">
//           <div className="flex justify-between items-center">
//             <div>{children}</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// } else {
//   return (
//     <div className="flex mt-12 ml-0 fixed z-0">
//       <div className="flex flex-wrap lg:flex-nowrap">
//         <div className="flex mt-10 h-full w-full p-10">
//           <div className="flex justify-between items-center">
//             <div>{children}</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }