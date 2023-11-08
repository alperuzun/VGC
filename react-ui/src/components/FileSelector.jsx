import React, { useEffect, useState } from 'react';
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { AiOutlinePlus } from 'react-icons/ai';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { useStateContext } from '../contexts/ContextProvider';
import { UploadElement } from './UploadElement';
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

    </div >
  )
}

export default FileSelector
