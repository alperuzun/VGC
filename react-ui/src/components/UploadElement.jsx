import React, { useEffect, useState } from 'react'
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { RiPlayListAddLine } from 'react-icons/ri';
import { BiCaretRight, BiCaretDown } from 'react-icons/bi'
import { AiOutlinePlus, AiTwotoneCheckCircle, AiOutlineClose } from 'react-icons/ai'
import { useStateContext } from '../contexts/ContextProvider';
import { useDisplayContext } from '../contexts/DisplayContext';
import { BsThreeDotsVertical } from 'react-icons/bs';
import FileService from '../services/FileService';

const getLink = (barType) => {
  if (barType['variantGraph'] == true) {
    console.log(true);
    return `/bargraph/view-varients`
  } else {
    console.log(barType['variantGraph']);
    return `/bargraph/view-varients`
  }
}
//`/bargraph/view-dp`


const getFileSize = (size) => {
  var fSExt = new Array('Bytes', 'KB', 'MB', 'GB');
  var i = 0;

  while (size > 900) {
    size /= 1024;
    i++;
  }
  var exactSize = (Math.round(size * 100) / 100) + ' ' + fSExt[i];
  // console.log('FILE SIZE = ' + exactSize);
  return 'VCF File Size: ' + exactSize;
}

const UploadElement = ({ path, fileDeleterToggle, size }) => {
  const { selected, setSelected, phenotypeList, pathList, setPathList, setPhenotypeList, sizeList, setSizeList, handlePhenotypeFileChange, searchRangeTerm, setSearchRangeTerm, searchGeneTerm, setSearchGeneTerm, refresh, setRefresh } = useStateContext();
  const { isViewing, handleChangeView, handleClick, handleVisData, barType, setBarType } = useDisplayContext();

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
          <button className="flex grow"
            onClick={() => {
              setSearchGeneTerm("");
              setSearchRangeTerm("");
              if (selected === path) {
                setRefresh(!refresh);
              } else {
                setSelected(path);
              }
            }
            }>
            <span className="font-bold"> {filename} </span>
          </button>

          {
          fileDeleterToggle ? (
            <div>
              <button
                className="flex items-center pr-2 text-slate-400 hover:text-slate-600"
                onClick={() => {
                  var indexOfDeleted = pathList.indexOf(path);
                  var pathCopy = [...pathList];
                  pathCopy.splice(indexOfDeleted, 1)
                  var phenotypeCopy = [...phenotypeList];
                  phenotypeCopy.splice(indexOfDeleted, 1);
                  var sizeCopy = [...sizeList];
                  sizeCopy.splice(indexOfDeleted, 1);

                  setPathList(pathCopy);
                  setPhenotypeList(phenotypeCopy);
                  setSizeList(sizeCopy);

                  if (pathCopy.length === 0) {
                    setSelected(undefined);
                  } else if (indexOfDeleted === pathCopy.length) {
                    setSelected(pathCopy[indexOfDeleted - 1]);
                  } else {
                    setSelected(pathCopy[indexOfDeleted]);
                  }
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


// if (selected == path && !fileDeleterToggle) {
//   return (
//     <div>
//       <div className="flex hover:bg-[#E9F0F2] bg-[#E9F0F2] w-full" >
//         <div className="flex items-center p-1 ml-2 text-sm truncate w-full">
//           <button className="flex hover:text-slate-500 mr-1" onClick={() => setShowPhenotype(!showPhenotype)}>
//             {showPhenotype ?
//               <BiCaretDown /> :
//               <BiCaretRight />}
//           </button>
//           <button className="flex grow"
//             onClick={() => {
//               if (selected === path) {
//                 setSearchGeneTerm("");
//                 setSearchRangeTerm("");
//                 setRefresh(!refresh);
//               } else {
//                 setSearchGeneTerm("");
//                 setSearchRangeTerm("");
//                 setSelected(path);
//                 // setRefresh(!refresh);
//               }
//             }
//             }>
//             <span> {filename} </span>
//           </button>
//         </div>

//         <label className="flex items-center">
//           <TooltipComponent content="Add Phenotype File" openDelay={1000} showTipPointer={false} offsetY={6} position="RightCenter">
//             <div className="hidden">
//               <input
//                 type="file"
//                 id="myfile"
//                 onChange={e => {
//                   handlePhenotypeFileChange(e.target.files[0], selected);
//                   setRefresh(!refresh);
//                 }}
//                 name="myfile"
//                 accept=".txt"
//                 multiple />
//             </div>
//             <div className="flex items-center pr-2 text-slate-400 hover:text-slate-600 text-lg cursor-pointer">
//               <RiPlayListAddLine />
//             </div>
//           </TooltipComponent>
//         </label>
//       </div>
//       {showPhenotype == true && phenotypeList[pathList.indexOf(path)] != null &&
//         <div className="flex w-full mt-1 bg-[#f4f8f9]">
//           <div className="flex p-1 ml-10 text-sm truncate w-full ">
//             {phenotypeList[pathList.indexOf(path)].replace(/^.*[\\\/]/, '')}
//           </div>
//         </div>
//       }
//     </div>
//   )
// } else if (selected != path && !fileDeleterToggle) {
//   return (
//     <div>
//       <div className="flex hover:bg-slate-100 w-full" >
//         <div className="flex items-center p-1 ml-2 text-sm truncate w-full">
//           <button className="flex hover:text-slate-500 mr-1" onClick={() => setShowPhenotype(!showPhenotype)}>
//             {showPhenotype ?
//               <BiCaretDown /> :
//               <BiCaretRight />}
//           </button>
//           <button className="flex grow"
//             onClick={() => {
//               if (selected === path) {
//                 setSearchGeneTerm("");
//                 setSearchRangeTerm("");
//                 setRefresh(!refresh);
//               } else {
//                 setSearchGeneTerm("");
//                 setSearchRangeTerm("");
//                 setSelected(path);
//                 // setRefresh(!refresh);

//               }
//             }
//             }>
//             <span> {filename} </span>
//           </button>
//         </div>

//         <label className="flex items-center">
//           <TooltipComponent content="Add Phenotype File" openDelay={1000} showTipPointer={false} offsetY={6} position="RightCenter">
//             <div className="hidden">
//               <input
//                 type="file"
//                 id="myfile"
//                 onChange={e => {
//                   handlePhenotypeFileChange(e.target.files[0], selected);
//                   setRefresh(!refresh);
//                 }}
//                 name="myfile"
//                 accept=".txt"
//                 multiple />
//             </div>
//             <div className="flex items-center pr-2 text-slate-400 hover:text-slate-600 text-lg cursor-pointer">
//               <RiPlayListAddLine />
//             </div>
//           </TooltipComponent>
//         </label>
//       </div>
//       {showPhenotype == true && phenotypeList[pathList.indexOf(path)] != null &&
//         <div className="flex w-full mt-1 bg-[#f4f8f9]">
//           <div className="flex p-1 ml-10 text-sm truncate w-full ">
//             {phenotypeList[pathList.indexOf(path)].replace(/^.*[\\\/]/, '')}
//           </div>
//         </div>
//       }
//     </div>
//   )
// } else if (selected == path && fileDeleterToggle) {
//   return (
//     <div>
//       <div className="flex hover:bg-[#E9F0F2] bg-[#E9F0F2] w-full" >
//         <div className="flex items-center p-1 ml-2 text-sm truncate w-full">
//           <button className="flex hover:text-slate-500 mr-1" onClick={() => setShowPhenotype(!showPhenotype)}>
//             {showPhenotype ?
//               <BiCaretDown /> :
//               <BiCaretRight />}
//           </button>
//           <button className="flex grow"
//             onClick={() => {
//               if (selected === path) {
//                 setSearchGeneTerm("");
//                 setSearchRangeTerm("");
//                 setRefresh(!refresh);
//               } else {
//                 setSearchGeneTerm("");
//                 setSearchRangeTerm("");
//                 setSelected(path);
//                 // setRefresh(!refresh);
//               }
//             }
//             }>
//             <span> {filename} </span>
//           </button>
//         </div>

//         <button
//           className="flex items-center pr-2 text-slate-400 hover:text-slate-600"
//           onClick={() => {
//             var pathCopy = [...pathList];
//             pathCopy.splice(pathList.indexOf(path), 1)
//             var phenotypeCopy = [...phenotypeList];
//             phenotypeCopy.splice(pathList.indexOf(path), 1);
//             setPathList(pathCopy);
//             setPhenotypeList(phenotypeCopy);
//             setSelected(undefined);
//           }}>
//           <AiOutlineClose />
//         </button>

//       </div>

//       {showPhenotype == true && phenotypeList[pathList.indexOf(path)] != null &&
//         <div className="flex mt-1 w-full">
//           <div className="flex p-1 ml-10 text-sm truncate w-full ">
//             {phenotypeList[pathList.indexOf(path)].replace(/^.*[\\\/]/, '')}
//           </div>
//         </div>
//       }
//     </div>
//   )
// } else if (selected != path && fileDeleterToggle) {
//   return (
//     <div>
//       <div className="flex hover:bg-slate-100 w-full" >
//         <div className="flex items-center p-1 ml-2 text-sm truncate w-full">
//           <button className="flex hover:text-slate-500 mr-1" onClick={() => setShowPhenotype(!showPhenotype)}>
//             {showPhenotype ?
//               <BiCaretDown /> :
//               <BiCaretRight />}
//           </button>
//           <button className="flex grow"
//             onClick={() => {
//               if (selected === path) {
//                 setSearchGeneTerm("");
//                 setSearchRangeTerm("");
//                 setRefresh(!refresh);
//               } else {
//                 setSearchGeneTerm("");
//                 setSearchRangeTerm("");
//                 setSelected(path);
//                 // setRefresh(!refresh);
//               }
//             }
//             }>
//             <span> {filename} </span>
//           </button>
//         </div>

//         <button
//           className="flex items-center pr-2 text-slate-400 hover:text-slate-600"
//           onClick={() => {
//             var pathCopy = [...pathList];
//             pathCopy.splice(pathList.indexOf(path), 1)
//             var phenotypeCopy = [...phenotypeList];
//             phenotypeCopy.splice(pathList.indexOf(path), 1);
//             setPathList(pathCopy);
//             setPhenotypeList(phenotypeCopy);
//             setSelected(undefined);
//           }}>
//           <AiOutlineClose />
//         </button>

//       </div>

//       {showPhenotype == true && phenotypeList[pathList.indexOf(path)] != null &&
//         <div className="flex mt-1 w-full">
//           <div className="flex p-1 ml-10 text-sm truncate w-full ">
//             {phenotypeList[pathList.indexOf(path)].replace(/^.*[\\\/]/, '')}
//           </div>
//         </div>
//       }
//     </div>
//   )