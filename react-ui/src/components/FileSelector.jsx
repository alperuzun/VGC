import React, { useEffect, useState } from 'react';
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { AiOutlinePlus } from 'react-icons/ai';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { useStateContext } from '../contexts/ContextProvider';
import { UploadElement } from '.';
import FileService from '../services/FileService';
import { useDisplayContext } from '../contexts/DisplayContext';


const FileSelector = () => {
  const { handleNewPath, setSelected, refresh, setRefresh, setSearchGeneTerm, setSearchRangeTerm } = useStateContext();
  const { isClicked, setIsClicked, handleClick } = useDisplayContext();
  const [fileMenu, setFileMenu] = useState(false);

  return (
    <div className="flex flex-row">
      <label>
        <TooltipComponent content="Upload VCF" openDelay={1000} showTipPointer={false} offsetY={6} position="TopRight">
          <div className="hidden">
            <input
              type="file"
              id="myfile"
              onChange={e => {
                handleNewPath(e.target.files[0])
                setSelected(e.target.files[0].path)
                setSearchGeneTerm("");
                setSearchRangeTerm("");
                // setRefresh(!refresh);
                e.target.value = ''
              }}
              name="myfile"
              accept=".vcf"
              multiple />
          </div>
          <div className="flex mr-2 rounded-full p-1 hover:bg-slate-100 z-1 cursor-pointer">
            <AiOutlinePlus />
          </div>
        </TooltipComponent>
      </label>

      {/* <button className="flex mr-1 rounded-full p-1 hover:bg-slate-100 z-1" onClick={() => setFileMenu(!fileMenu)}>
        <HiOutlineDotsVertical />
      </button> */}

    </div >
  )
}

export default FileSelector


{/* <button className="flex mr-1 rounded-full p-1 hover:bg-slate-100 z-1" onClick={() => setFileMenu(!fileMenu)}>
<HiOutlineDotsVertical />
</button> */}

// {
//   fileMenu &&
//   <div className="flex fixed ml-14 z-50 w-50 ">
//     <ul class="text-sm text-white dark:text-gray-200 divide-y">
//       <li className={`w-60 flex justify-center cursor-pointer bg-[#2d3b3b] text-[#bec1c1] hover:text-white hover:bg-[#465353] p-1 shadow-md rounded-md `}
//         onClick={() => setFileMenu(false)}>
//         Add Phenotype File
//       </li>
//       <li className={`w-60 flex justify-center cursor-pointer bg-[#2d3b3b] text-[#bec1c1] hover:text-white hover:bg-[#465353] p-1 shadow-md rounded-md `}
//         onClick={() => setFileMenu(false)}>
//         Manage Files
//       </li>
//     </ul>
//   </div>
// }



// <label>
//   <div className="hidden">
//     <input
//       type="file"
//       id="myfile"
//       onChange={e => {
//       }}
//       name="pathFile"
//       multiple />
//   </div>
//   <div className="flex mr-1 rounded-full p-1 hover:bg-slate-100 z-1 cursor-pointer">
//     <HiOutlineDotsVertical />
//   </div>
// </label>
