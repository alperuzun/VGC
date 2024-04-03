import React, { useEffect, useState } from 'react'
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { RiPlayListAddLine } from 'react-icons/ri';
import { BiCaretRight, BiCaretDown } from 'react-icons/bi'
import { AiOutlinePlus, AiTwotoneCheckCircle, AiOutlineClose } from 'react-icons/ai'
import { useStateContext } from '../contexts/ContextProvider';
import { useDisplayContext } from '../contexts/DisplayContext';
import FileService from '../services/FileService';

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

const UploadElement = ({ path, fileDeleterToggle, size, refGenome}) => {
  const { selected, setSelected, phenotypeList, pathList, setPathList, setPhenotypeList, sizeList, setSizeList, refList, setRefList, handlePhenotypeFileChange, handleRemovePath, searchRangeTerm, setSearchRangeTerm, searchGeneTerm, setSearchGeneTerm, refresh, setRefresh } = useStateContext();
  const { isViewing, handleChangeView, handleClick, handleVisData} = useDisplayContext();

  const filename = path.replace(/^.*[\\\/]/, '')
  const fileSize = getFileSize(size);
  const [showPhenotype, setShowPhenotype] = useState(true);
  // const [activeFilterSelect, setActiveFilterSelect] = useState(false);
  // const [referenceGenome, setReferenceGenome] = useState("...");


  // const handleChangeReference = async (newRef) => {
  //   try {
  //     await FileService.changeReference(newRef);
  //     setReferenceGenome(newRef);
  //   } catch (error) {
  //     alert(error.response.data.message);    
  //   }
  // }


  // useEffect(() => {

  //   FileService.getReference().then(items => {
  //     setReferenceGenome(items.data);
  //   });
  // }, [selected]);



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
            <div className="flex flex-row items-center">
              <span className="flex text-xs"> {fileSize} </span>

              <div className="flex-col m-1 ">
                  <div
                    className={`flex px-1 py-0.5 w-24 text-xs justify-center rounded-sm hover:bg-slate-300 bg-slate-300`}>
                    {refGenome}
                  </div>
              </div>


              {/* <div className="flex-col m-1 ">
                  <button
                    type="button"
                    className={`flex px-1 py-0.5 w-24 text-xs justify-center rounded-sm hover:bg-slate-300 bg-slate-300`}
                    onClick={() => {
                      setActiveFilterSelect(!activeFilterSelect)
                    }}>
                    {referenceGenome}
                  </button>
                  <div className={`${activeFilterSelect ? "" : "hidden"} flex justify-center z-40 fixed w-24  rounded-sm shadow`}>
                    <ul class=" text-gray-700 dark:text-gray-200 divide-y">
                      <li
                        className={`w-24 flex text-xs justify-center cursor-pointer ${referenceGenome == "GRCh37" ? "hover:bg-slate-200 bg-slate-200" : "bg-white hover:bg-slate-100"}  py-0.5 `}
                        onClick={() => { handleChangeReference('GRCh37'); setActiveFilterSelect(false); setRefresh(!refresh);}}>
                        GRCh37
                      </li>
                      <li
                        className={`w-24 flex text-xs justify-center cursor-pointer ${referenceGenome == "GRCh38" ? "hover:bg-slate-200 bg-slate-200" : "bg-white hover:bg-slate-100"}  py-0.5 `}
                        onClick={() => { handleChangeReference('GRCh38'); setActiveFilterSelect(false); setRefresh(!refresh);}}>
                        GRCh38
                      </li>
                    </ul>
                  </div> 
                </div> */}

            </div>
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

