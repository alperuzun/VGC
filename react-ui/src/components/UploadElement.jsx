import React, { useEffect, useState } from 'react'
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { RiPlayListAddLine } from 'react-icons/ri';
import { BiCaretRight, BiCaretDown } from 'react-icons/bi'
import { AiOutlinePlus, AiTwotoneCheckCircle, AiOutlineClose } from 'react-icons/ai'
import { useStateContext } from '../contexts/ContextProvider';
import { useDisplayContext } from '../contexts/DisplayContext';

const getFileSize = (size) => {
  var fSExt = new Array('Bytes', 'KB', 'MB', 'GB');
  var i = 0;

  while (size > 900) {
    size /= 1024;
    i++;
  }
  var exactSize = (Math.round(size * 100) / 100) + ' ' + fSExt[i];
  return 'VCF File Size: ' + exactSize;
}

const UploadElement = ({ path, fileDeleterToggle, size }) => {
  const { selected, setSelected, phenotypeList, pathList, setPathList, setPhenotypeList, sizeList, setSizeList, handlePhenotypeFileChange, handleRemovePath, searchRangeTerm, setSearchRangeTerm, searchGeneTerm, setSearchGeneTerm, refresh, setRefresh } = useStateContext();
  const { isViewing, handleChangeView, handleClick, handleVisData} = useDisplayContext();

  const filename = path.replace(/^.*[\\\/]/, '')
  const fileSize = getFileSize(size);
  const [showPhenotype, setShowPhenotype] = useState(true);

  return (
    <div>
      <div className={` ${selected === path ? "bg-[#e4ecf1] border-1 border-blue-500" : "hover:bg-[#e4ecf1] bg-[#E9F0F2]" } flex flex-col  w-full`} >
        <div className="flex items-center p-1 ml-2 text-sm truncate w-full">
          <button className="flex hover:text-slate-500 mr-1" onClick={() => setShowPhenotype(!showPhenotype)}>
            {showPhenotype ?
              <BiCaretDown /> :
              <BiCaretRight />}
          </button>
          <button className="flex grow max-w-[312px]"
            onClick={() => {
              if (selected === path) {
                setRefresh(!refresh);
              } else {
                setSelected(path);
              }
            }
            }>
            <span className="font-bold overflow-clip"> {filename} </span>
          </button>

          {
          fileDeleterToggle ? (
            <div>
              <button
                className="flex items-center pr-2 text-slate-400 hover:text-slate-600"
                onClick={() => {
                  handleRemovePath(path);
                  console.log("Removed! Now Selected:" );
                  console.log(selected);
                }}>
                <AiOutlineClose />
              </button>
            </div>
          ) : (
            <div>

              <label className="flex items-center">
                <TooltipComponent content="Add Phenotype File" openDelay={1000} showTipPointer={false} offsetY={6} position="RightCenter">
                  <div className="hidden">
                    <input
                      type="file"
                      id="myfile"
                      onChange={e => {
                        handlePhenotypeFileChange(e.target.files[0], path);
                        setRefresh(!refresh);
                      }}
                      name="myfile"
                      accept=".txt"
                      multiple />
                  </div>
                  <div className="flex items-center pr-2 text-slate-400 hover:text-slate-600 text-lg cursor-pointer">
                    <RiPlayListAddLine />
                  </div>
                </TooltipComponent>
              </label>
            </div>
          )
        }
        </div>

        

          <div className="flex w-full flex-col ml-10 ">
            <span className="flex text-xs"> {fileSize} </span>

            {showPhenotype == true && phenotypeList[pathList.indexOf(path)] != null &&

            <div className="flex text-sm truncate w-full ">
              
              <span className="font-bold pr-1">Phenotype File:</span> {phenotypeList[pathList.indexOf(path)].replace(/^.*[\\\/]/, '')}
            </div>
          }
          </div>
        

      </div>

    </div>
  )



}

export default UploadElement

