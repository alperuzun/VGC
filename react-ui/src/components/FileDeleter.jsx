import React, { useEffect, useState } from 'react';
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { BsPencilFill } from 'react-icons/bs';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { useStateContext } from '../contexts/ContextProvider';
import { UploadElement } from '.';
import FileService from '../services/FileService';
import { useDisplayContext } from '../contexts/DisplayContext';


const FileDeleter = (props) => {
    const { handleNewPath, setSelected, refresh, setRefresh } = useStateContext();
    const { isClicked, setIsClicked, handleClick } = useDisplayContext();
    const [fileMenu, setFileMenu] = useState(false);

    function setToggle() {
        if (props.fileDeleterToggle) {
            props.setFileDeleterToggle(false);
        } else if (!props.fileDeleterToggle) {
            props.setFileDeleterToggle(true);
        }
    }

    return (
        <div className="flex flex-row">
            <label>
                <TooltipComponent content="Edit VCF(s)" openDelay={1000} showTipPointer={false} offsetY={6} position="TopRight">
                    <div className="hidden">
                        <input
                            type="checkbox"
                            id="editToggle"
                            onChange={
                                setToggle
                            }
                            name="editToggle"
                        />
                    </div>
                    <div className="flex mr-2 rounded-full p-1 hover:bg-slate-100 z-1 cursor-pointer">
                        <BsPencilFill />
                    </div>
                </TooltipComponent>
            </label>

            {/* <button className="flex mr-1 rounded-full p-1 hover:bg-slate-100 z-1" onClick={() => setFileMenu(!fileMenu)}>
        <HiOutlineDotsVertical />
      </button> */}

        </div >
    )
}

export default FileDeleter;