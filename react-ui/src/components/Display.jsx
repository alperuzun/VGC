import React, { useEffect, useState } from 'react';
import { useStateContext } from '../contexts/ContextProvider';
import { useDisplayContext } from '../contexts/DisplayContext';
import { useBarContext } from '../contexts/BarContext';
import { AboutData, BarView } from '.';
import { SimplePane } from './Panes';
import { CgUndo, CgRedo } from 'react-icons/cg';
import { IoMdHelpCircle } from 'react-icons/io';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';


const Display = () => {
  const { activeMenu, selected, setSelected, currentlyViewing, setCurrentlyViewing, refresh, setRefresh } = useStateContext();
  const { isClicked, setIsClicked, handleClick, barType, setBarType, handleBarGraph, searchRangeTerm, setSearchRangeTerm, searchGeneTerm, setSearchGeneTerm } = useDisplayContext();
  const { histogramData, setHistogramData, barHistory, setBarHistory, handleBarAction, historyIndex, setHistoryIndex, geneHistory, setGeneHistory, passFilter, setPassFilter } = useBarContext();
  const [activeFilterSelect, setActiveFilterSelect] = useState(false);

  const handleUndo = () => {
    console.log("Undoing barAction.");
    if (historyIndex > 0) {
      console.log(barHistory[historyIndex - 1]);
      setHistogramData(barHistory[historyIndex - 1]);
      setHistoryIndex(historyIndex - 1);
      console.log("BarHistory: ");
      console.log(barHistory);
    }
  }

  const handleRedo = () => {
    console.log("Redoing barAction.");
    if (historyIndex != undefined) {
      if (historyIndex < barHistory.length - 1) {
        console.log(barHistory[historyIndex + 1]);
        setHistogramData(barHistory[historyIndex + 1]);
        setHistoryIndex(historyIndex + 1);
        console.log("BarHistory: ");
        console.log(barHistory);
        console.log("GeneHistory: ");
        console.log(geneHistory);
      }
    }
  }


  return (
    <div className="flex w-full h-full overflow-x-clip">
      {selected != undefined ? (
        <div className="flex w-full flex-col ">

        {/* <div className="px-2 py-1.5">
          <div className={`flex bg-slate-100 w-full drop-shadow-md `}>
            <div className="w-full">
            <AboutData />
            </div>
          </div>
        </div> */}
          <SimplePane>
            <AboutData />
          </SimplePane>

          <div className="flex grow px-2 py-1.5">
            <div className={`flex flex-col bg-slate-100 w-full h-full drop-shadow-md `}>

              <div className="flex flex-col mt-6">
                <div className="flex ml-5 text-2xl w-full">
                  <CgUndo className={`rounded ml-2  ${historyIndex == 0 || historyIndex == null ? "text-slate-400" : "hover:bg-slate-200"}`} onClick={() => handleUndo()} />
                  <CgRedo className={`rounded ml-2 ${barHistory.length == Number(historyIndex) + 1 || barHistory.length == 0 ? "text-slate-400" : "hover:bg-slate-200"} `} onClick={() => handleRedo()} />
                  <div className="ml-2 text-sm justify-center p-1">
                    FILTER:
                  </div>
                  <div className="flex-col">
                    <button
                      type="button"
                      className={`flex p-1 ml-1 w-28 text-sm justify-center rounded-sm hover:bg-slate-300 ${1 == 1 ? 'bg-slate-300' : 'bg-slate-200'}`}
                      onClick={() => {
                        setActiveFilterSelect(!activeFilterSelect)
                    }}>
                      {passFilter}
                    </button>
                    <div className={`${activeFilterSelect ? "" : "hidden"} flex ml-1 justify-center z-40 fixed w-28  rounded-sm shadow`}>
                      <ul class="text-sm text-gray-700 dark:text-gray-200 divide-y">
                        <li 
                        className={`w-28 flex justify-center cursor-pointer ${passFilter == "PASS" ? "hover:bg-slate-200 bg-slate-200" : "bg-white hover:bg-slate-100"}  py-1`}
                        onClick={() => { setActiveFilterSelect(false); setPassFilter("PASS") }}>
                          PASS
                        </li>
                        <li 
                          className={`w-28 flex justify-center cursor-pointer ${passFilter == "ALL" ? "hover:bg-slate-200 bg-slate-200" : "bg-white hover:bg-slate-100"} py-1`}
                          onClick={() => { setActiveFilterSelect(false); setPassFilter("ALL") }}>
                            ALL
                        </li>
                        <li className={`w-28 flex justify-center cursor-pointer ${passFilter == "PATHOGENIC" ? "hover:bg-slate-200 bg-slate-200" : "bg-white hover:bg-slate-100"} py-1`}
                          onClick={() => { setActiveFilterSelect(false); setPassFilter("PATHOGENIC") }}>
                            PATHOGENIC
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex flex-row">
                    <button className="flex text-sm items-center  ml-6  bg-slate-300 px-2 hover:shadow hover:bg-slate-200" onClick={() => setRefresh(!refresh)}>
                      Update Graph Filter
                    </button>
                    <TooltipComponent content="Updates the graph after filter selection change." position="Right" showTipPointer={false}>
                      <div className="text-lg text-slate-700 flex h-full items-center ml-2"><IoMdHelpCircle /></div>
                    </TooltipComponent>
                  </div>
                </div>
                <div className="flex text-md justify-center">
                  {histogramData != null && histogramData.data.title}
                </div>
                <div className="flex text-md justify-center">
                  {histogramData != null && histogramData.data.zoomFactor != null && histogramData.data.zoomFactor <= 10000 &&
                    <div className="flex items-center">
                      <div className={`flex w-4 h-3 ${passFilter === "PATHOGENIC" ? "bg-[#ca5656]": "bg-[#3f89c7]"}`}></div>
                      <div className="flex pr-2 pl-2 text-sm text-gray-500">Variants in Exonic Regions</div>
                      <div className={`flex w-4 h-3 ${passFilter === "PATHOGENIC" ? "bg-[#ca5656a4]": "bg-[#3f8ac7a0]"} `}></div>
                      <div className="flex pr-2 pl-2 text-sm text-gray-500">Variants in Intronic Regions</div>
                    </div>
                  }
                </div>
              </div>
              <div className="flex flex-row h-3/4 w-full">
                <div className="flex items-center w-1/12 justify-right">
                  <nobr className="flex rotate-[270deg] origin-top">
                    {histogramData != null && histogramData.data.yTitle}
                  </nobr>
                </div>
                <div className="flex h-full w-11/12 justify-center">
                  <BarView />
                </div>
              </div>
              <div className="flex text-md pb-4 justify-center">
                {histogramData != null && histogramData.data.xTitle}
              </div>

            </div>
          </div>
        </div>
      ) : (
        <div className="flex fixed">
          <div className="flex">
            No file currently selected.
          </div>
        </div>
      )}
    </div>
  )
}

export default Display

//   1/17 save 


// import React, { useEffect, useState } from 'react';
// import { useStateContext } from '../contexts/ContextProvider';
// import { useDisplayContext } from '../contexts/DisplayContext';
// import { useBarContext } from '../contexts/BarContext';
// import { AboutData, BarView } from '.';
// import { SimplePane } from './Panes';
// import { CgUndo, CgRedo } from 'react-icons/cg';
// import { IoMdHelpCircle } from 'react-icons/io';
// import { TooltipComponent } from '@syncfusion/ej2-react-popups';


// const Display = () => {
//   const { activeMenu, selected, setSelected, currentlyViewing, setCurrentlyViewing, refresh, setRefresh } = useStateContext();
//   const { isClicked, setIsClicked, handleClick, barType, setBarType, handleBarGraph, searchRangeTerm, setSearchRangeTerm, searchGeneTerm, setSearchGeneTerm } = useDisplayContext();
//   const { histogramData, setHistogramData, barHistory, setBarHistory, handleBarAction, historyIndex, setHistoryIndex, geneHistory, setGeneHistory, passFilter, setPassFilter } = useBarContext();
//   const [activeFilterSelect, setActiveFilterSelect] = useState(false);

//   const handleUndo = () => {
//     console.log("Undoing barAction.");
//     if (historyIndex > 0) {
//       console.log(barHistory[historyIndex - 1]);
//       setHistogramData(barHistory[historyIndex - 1]);
//       setHistoryIndex(historyIndex - 1);
//       console.log("BarHistory: ");
//       console.log(barHistory);
//     }
//   }

//   const handleRedo = () => {
//     console.log("Redoing barAction.");
//     if (historyIndex != undefined) {
//       if (historyIndex < barHistory.length - 1) {
//         console.log(barHistory[historyIndex + 1]);
//         setHistogramData(barHistory[historyIndex + 1]);
//         setHistoryIndex(historyIndex + 1);
//         console.log("BarHistory: ");
//         console.log(barHistory);
//         console.log("GeneHistory: ");
//         console.log(geneHistory);
//       }
//     }
//   }

//   return (
//     <div className="flex w-full">
//       {selected != undefined ? (
//         <div className="flex w-full flex-col">
//           <SimplePane>
//             <AboutData />
//           </SimplePane>
          
//           <SimplePane>
//             <div className="flex flex-col mt-6">
//               <div className="flex ml-5 text-2xl w-full">
//                 <CgUndo className={`rounded ml-2  ${historyIndex == 0 || historyIndex == null ? "text-slate-400" : "hover:bg-slate-200"}`} onClick={() => handleUndo()} />
//                 <CgRedo className={`rounded ml-2 ${barHistory.length == Number(historyIndex) + 1 || barHistory.length == 0 ? "text-slate-400" : "hover:bg-slate-200"} `} onClick={() => handleRedo()} />
//                 <div className="ml-2 text-sm justify-center p-1">
//                   FILTER:
//                 </div>
//                 <div className="flex-col">
//                   <button
//                     type="button"
//                     className={`flex p-1 ml-1 w-28 text-sm justify-center rounded-sm hover:bg-slate-300 ${1 == 1 ? 'bg-slate-300' : 'bg-slate-200'}`}
//                     onClick={() => {
//                       setActiveFilterSelect(!activeFilterSelect)
//                     }}>
//                     {passFilter}
//                   </button>
//                   <div className={`${activeFilterSelect ? "" : "hidden"} flex ml-1 justify-center z-40 fixed w-28  rounded-sm shadow`}>
//                     <ul class="text-sm text-gray-700 dark:text-gray-200 divide-y">
//                       <li className={`w-28 flex justify-center cursor-pointer ${passFilter == "PASS" ? "hover:bg-slate-200 bg-slate-200" : "bg-white hover:bg-slate-100"}  py-1`}
//                         onClick={() => { setActiveFilterSelect(false); setPassFilter("PASS") }}>
//                         PASS
//                       </li>
//                       <li className={`w-28 flex justify-center cursor-pointer ${passFilter == "ALL" ? "hover:bg-slate-200 bg-slate-200" : "bg-white hover:bg-slate-100"} py-1`}
//                         onClick={() => { setActiveFilterSelect(false); setPassFilter("ALL") }}>
//                         ALL
//                       </li>
//                       <li className={`w-28 flex justify-center cursor-pointer ${passFilter == "PATHOGENIC" ? "hover:bg-slate-200 bg-slate-200" : "bg-white hover:bg-slate-100"} py-1`}
//                         onClick={() => { setActiveFilterSelect(false); setPassFilter("PATHOGENIC") }}>
//                         PATHOGENIC
//                       </li>
//                     </ul>
//                   </div>
//                 </div>
//                   <div className="flex flex-row">
//                     <button className="flex text-sm items-center  ml-6  bg-slate-300 px-2 hover:shadow hover:bg-slate-200" onClick={() => setRefresh(!refresh)}>
//                       Update Graph Filter
//                     </button>
//                     <TooltipComponent content="Updates the graph after filter selection change." position="Right" showTipPointer={false}>
//                       <div className="text-lg text-slate-700 flex h-full items-center ml-2"><IoMdHelpCircle /></div>
//                     </TooltipComponent>
//                   </div>
//               </div>
//               <div className="flex text-md justify-center">
//                 {histogramData != null && histogramData.data.title}
//               </div>
//               <div className="flex text-md justify-center">
//                 {histogramData != null && histogramData.data.zoomFactor != null && histogramData.data.zoomFactor <= 10000 &&
//                   <div className="flex items-center">
//                     <div className={`flex w-4 h-3 ${passFilter === "PATHOGENIC" ? "bg-[#ca5656]": "bg-[#3f89c7]"}`}></div>
//                     <div className="flex pr-2 pl-2 text-sm text-gray-500">Variants in Exonic Regions</div>
//                     <div className={`flex w-4 h-3 ${passFilter === "PATHOGENIC" ? "bg-[#ca5656a4]": "bg-[#3f8ac7a0]"} `}></div>
//                     <div className="flex pr-2 pl-2 text-sm text-gray-500">Variants in Intronic Regions</div>
//                   </div>}
//               </div>
//             </div>
//             <div className="flex flex-row">
//               <div className="flex items-center w-1/12 justify-center">
//                 <nobr className="flex rotate-[270deg] origin-top">
//                   {histogramData != null && histogramData.data.yTitle}
//                 </nobr>
//               </div>

//               <div className={`flex ${histogramData != null && histogramData.data.zoomFactor != null && histogramData.data.zoomFactor <= 10000 ? "h-[24rem] " : "h-[25rem] "} ${activeMenu ? 'xl:w-[56rem] lg:w-[48rem] md:w-[42rem] sm:w-[32rem]' : 'xl:w-[80rem] lg:w-[72rem] md:w-[68rem] sm:w-[56rem] w-[36rem]'}`}>
//                 <BarView />
//               </div>
//             </div>
//             <div className="flex text-md pb-4 justify-center">
//               {histogramData != null && histogramData.data.xTitle}
//             </div>
//           </SimplePane>
//         </div>
//       ) : (
//         <div className="flex fixed">
//           <div className="flex">
//             No file currently selected.
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default Display