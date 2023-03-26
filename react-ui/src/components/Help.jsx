import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'


const Help = ({onClose, visible}) => {
  if (!visible) return null;
  return (
    <div></div>
    // <div className="flex fixed z-50 bg-black bg-opacity-30 backdrop-blur-sm items-center justify-center h-screen w-screen">
    //     <div className="flex flex-col bg-white p-2 h-[30rem] w-[28rem] rounded-3xl">
    //     <button onClick={onClose} className="flex justify-end p-4"><AiOutlineClose/></button>

    //     <div className="flex flex-col w-full items-center justify-center">
    //           <button className="flex w-40 h-8 border-1 border-slate-700 rounded-lg bg-slate-200 shadow-sm hover:bg-[#ffffff] hover:shadow-md justify-center items-center mt-20">
    //             About
    //           </button>
    //           <button className="flex w-40 h-8 border-1 border-slate-700 rounded-lg bg-slate-200 shadow-sm hover:bg-[#ffffff] hover:shadow-md justify-center items-center mt-20">
    //             Documentation
    //           </button>
    //           <button className="flex w-40 h-8 border-1 border-slate-700 rounded-lg bg-slate-200 shadow-sm hover:bg-[#ffffff] hover:shadow-md justify-center items-cente mt-20">
    //             Tutorial
    //           </button>
    //         </div>
    //     </div>
    // </div>
  )
}

export default Help