import React, { useEffect, useState } from 'react'
import { NodeView, TabBar } from './';
import { SimplePane } from './Panes';
import { NodeContext, useNodeContext } from '../contexts/NodeContext';
import { useStateContext } from '../contexts/ContextProvider';
import { AiFillSetting, AiOutlineClose } from 'react-icons/ai';
import { RiErrorWarningLine } from 'react-icons/ri';


const Graph = () => {
  const { selected, setSelected, searchRangeTerm, setSearchRangeTerm, searchGeneTerm, setSearchGeneTerm, toggleRS, setToggleRS, toggleGS, setToggleGS, phenotypeList, pathList, refresh, setRefresh } = useStateContext();
  const { nlData, setNLData, checkEmpty, dataObj, setDataObj, view2D, setView2D, view3D, setView3D, nodeSize, setNodeSize, gtList, setGtList, passFilter, setPassFilter, highlightFormat, setHighlightFormat, settingsVisible, setSettingsVisible, sampleColors, setSampleColors, variantColor, setVariantColor, currDataObj } = useNodeContext();
  const [patientGroupings, setPatientGroupings] = useState("VISIBLE");
  const [data, setData] = useState("Data will appear here");
  var lastSearch = null;

  const SettingsOption = ({ title, stateName, setFunction, statesArray }) => {
    const [optionActive, setOptionActive] = useState(false);
    return (
      <div className="flex flex-row py-1  ">
        <text className="text-sm">
          {title}
        </text>
        <div className="flex-col ml-2 w-28">
          <button
            type="button"
            className={`flex p-0.5 mr-[1rem] w-full text-sm justify-center rounded-sm hover:bg-slate-300 bg-slate-200`}
            onClick={() => { setOptionActive(!optionActive) }}>
            {stateName}
          </button>
          <div className={`${optionActive ? "" : "hidden"} flex mr-1 justify-center z-40 fixed rounded-sm shadow`}>
            <ul class="text-sm text-gray-700 dark:text-gray-200 divide-y w-28">
              {statesArray.map((settingState) => (
                <li className={`flex justify-center cursor-pointer ${stateName == settingState ? "hover:bg-slate-200 bg-slate-200" : "bg-white hover:bg-slate-100"}  p-0.5`}
                  onClick={() => { setOptionActive(false); setFunction(settingState) }}>
                  {settingState}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full h-full overflow-x-clip">
      <SimplePane>
        <div className="flex flex-row w-full h-full overflow-hidden">
          <div className="flex flex-col grow ">
            <TabBar />

            <div className="flex flex-row h-8 p-1 mt-1 z-50 items-center">

              <div className="flex grow items-center">
                <div className={`ml-[2rem] pr-1 pl-1 text-sm `}>
                  {currDataObj != undefined ? currDataObj.title : <text>Enter your query above. </text>}
                </div>
                <div className="flex px-10 text-sm justify-center rounded-sm">
                  <SettingsOption
                    title="FILTER: "
                    stateName={passFilter}
                    setFunction={(p) => setPassFilter(p)}
                    statesArray={["ALL", "PASS", "PATHOGENIC"]}
                  />
                </div>


                <button
                  type="button"
                  className={`flex mr-[1rem] p-0.5 w-24 text-sm justify-center rounded-sm hover:bg-slate-300 ${view2D ? 'bg-slate-300' : 'bg-slate-200'}`}
                  onClick={() => { setView2D(true); setView3D(false) }}>
                  View in 2D
                </button>
                <button
                  type="button"
                  className={`flex p-0.5 w-24 text-sm justify-center rounded-sm hover:bg-slate-300 ${view3D ? 'bg-slate-300' : 'bg-slate-200'}`}
                  onClick={() => { setView2D(false); setView3D(true) }}>
                  View in 3D
                </button>
              </div>
              <div className={`${settingsVisible ? "hidden" : ""} flex`}>
                <button
                  className="hover:text-slate-200 bg-[#3f89c7] text-white hover:bg-[#4a84b4] rounded-full p-1"
                  onClick={() => setSettingsVisible(!settingsVisible)}>
                  <AiFillSetting />
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="flex p-1">
                <NodeView setData={setData} />
              </div>
              {/* DATA SIDEBAR */}
              <div className="absolute top-0 left-10 opacity-75 max-h-full h-fit w-72 rounded-md justify-self-end items-start p-2 z-60 bg-white overflow-scroll">
                <div dangerouslySetInnerHTML={{ __html: data }} />
              </div>
            </div>
          </div>

          {/* PREFERENCES SIDEBAR */}
          <div className={`${settingsVisible ? "" : "hidden"} flex flex-col w-72 justify-self-end items-center shadow-lg p-2 bg-white`}>
            <div className="flex w-full bg-[#3f89c7] ">
              <button className="flex items-center text-white hover:text-slate-200 hover:bg-[#278188] rounded-full p-1 z-50" onClick={() => setSettingsVisible(!settingsVisible)}>
                <AiOutlineClose />
              </button>
              <text className="flex grow justify-center font-thin text-white ">Preferences</text>
            </div>
            <div className="flex flex-col items-center mt-2 w-full ">
              <div className="flex text-sm  w-full h-0.5 justify-center bg-slate-500 items-center mt-4 mb-3">
                <text className="bg-white px-2">Graph Options</text>
              </div>
              <SettingsOption
                title="NODE SIZE:"
                stateName={nodeSize}
                setFunction={(s) => setNodeSize(s)}
                statesArray={["UNIFORM", "PROPORTIONAL"]}
              />
              <SettingsOption
                title="FORMAT: "
                stateName={highlightFormat}
                setFunction={(f) => setHighlightFormat(f)}
                statesArray={["Highlight Genotypes by Color", "Highlight Genotypes by Color (onClick)", "Highlight Homozygous Reference (onClick)", "Highlight Heterozygous (onClick)", "Highlight Homozygous Alternative (onClick)", "None"]}
              />
              <SettingsOption
                title="PHENOTYPE DATA: "
                stateName={patientGroupings}
                setFunction={(g) => setPatientGroupings(g)}
                statesArray={["VISIBLE", "HIDDEN"]}
              />
              {patientGroupings == "VISIBLE" && phenotypeList[pathList.indexOf(selected)] == null &&
                <div className="flex text-red-800 ml-1">
                  <RiErrorWarningLine />
                  <text className="text-xs ml-1">No phenotype data was uploaded for this vcf file.</text>
                </div>}

              <div>
                <div className="flex-row">
                  <text className="text-sm">Variant Color:</text>
                  <input type="color" className="w-7 h-5 ml-2" value={variantColor} onChange={(e) => setVariantColor(e.target.value.toString())}></input>
                </div>
                {patientGroupings == "VISIBLE" && phenotypeList[pathList.indexOf(selected)] != null && currDataObj != null && currDataObj.patientGroups != null
                  ?
                  <div>
                    {currDataObj.patientGroups.map((groupNum) => (
                      <div>
                        <text className="text-sm">Sample Group #{groupNum}</text>
                        <input type="color" className="w-7 h-5 ml-2" value={sampleColors[Number(groupNum)]} onChange={(e) => {
                          var colorCopy = [...sampleColors];
                          colorCopy[Number(groupNum)] = e.target.value.toString();
                          setSampleColors(colorCopy);
                        }}></input>
                      </div>
                    ))}
                  </div>
                  :
                  <div className="flex-row">
                    <text className="text-sm">Sample Color:</text>
                    <input type="color" className="w-7 h-5 ml-2"></input>
                  </div>
                }
              </div>


              <div className="flex text-sm  w-full h-0.5 justify-center bg-slate-500 items-center mt-6 mb-3">
                <text className="bg-white px-2">Query Options</text>
              </div>

              {/* //PREVIOUSLY HERE */}
            </div>
            <div className="flex flex-col w-full mt-2 text-sm">
              <div className="flex justify-center">
                GENOTYPE DATA
              </div>
              <div className="flex ml-2 items-center">
                <input className="" type="checkbox" id="topping" name="Homozygous Reference (0/0)" value="Paneer" checked={gtList[0]} onClick={() => setGtList([!gtList[0], gtList[1], gtList[2]])} />
                Homozygous Reference (0/0)
              </div>
              <div className="flex ml-2 items-center">
                <input className="" type="checkbox" id="topping" name="Homozygous Reference (0/0)" value="Paneer" checked={gtList[1]} onClick={() => setGtList([gtList[0], !gtList[1], gtList[2]])} />
                Heterozygous (0/1)
              </div>
              <div className="flex ml-2 items-center">
                <input className="" type="checkbox" id="topping" name="Homozygous Reference (0/0)" value="Paneer" checked={gtList[2]} onClick={() => setGtList([gtList[0], gtList[1], !gtList[2]])} />
                Homozygous Alternative (1/1)
              </div>
            </div>
            <button
              className="w-20 h-6 bg-[#3f89c7] text-white text-sm hover:shadow mt-6"
              onClick={() => {
                setRefresh(!refresh)
                if (passFilter == "PATHOGENIC") {
                  setVariantColor("#ca5656");
                } else {
                  setVariantColor("#3f89c7");
                }
                // console.log(lastSearch);
                // setToggleGS(!toggleGS);
                // setToggleRS(!toggleRS);

                // if (lastSearch == "RS") {
                //   setToggleRS(!toggleRS)
                // } else if (lastSearch == "GS") {
                //   console.log("Toggling GS...");
                //   setToggleGS(!toggleGS);
                // }
              }}>
              Update
            </button>
          </div>
        </div>
      </SimplePane>
    </div>
  )
}

export default Graph


//SAVING PREVIOUS GRAPH CODE

// <div className="flex relative">
//       <SimplePane>
//         <div className="flex flex-col">
//           <div className="flex flex-row p-1 w-full z-50">
//             <div className="flex flex-row items-center">
//               <text className="mr-[1rem] ml-[2rem] text-sm">
//                 NODE SIZE:
//               </text>
//               <div className="flex-col">
//                 <button
//                   type="button"
//                   className={`flex p-0.5 mr-[1rem] w-32 text-sm justify-center rounded-sm hover:bg-slate-300 bg-slate-200`}
//                   onClick={() => { setActiveNS(!activeNS) }}>
//                   {nodeSize}
//                 </button>
//                 <div className={`${activeNS ? "" : "hidden"} flex mr-1 justify-center z-40 fixed w-32  rounded-sm shadow`}>
//                   <ul class="text-sm text-gray-700 dark:text-gray-200 divide-y">
//                     <li className={`w-32 flex justify-center cursor-pointer ${nodeSize == "UNIFORM" ? "hover:bg-slate-200 bg-slate-200" : "bg-white hover:bg-slate-100"}  p-0.5`}
//                       onClick={() => { setActiveNS(false); setNodeSize("UNIFORM") }}>
//                       UNIFORM
//                     </li>
//                     <li className={`w-32 flex justify-center cursor-pointer ${nodeSize == "PROPORTIONAL" ? "hover:bg-slate-200 bg-slate-200" : "bg-white hover:bg-slate-100"} p-0.5`}
//                       onClick={() => { setActiveNS(false); setNodeSize("PROPORTIONAL") }}>
//                       PROPORTIONAL
//                     </li>
//                   </ul>
//                 </div>
//               </div>

//               <text className="mr-[1rem] text-sm">
//                 FORMAT:
//               </text>
//               <div className="flex-col">
//                 <button
//                   type="button"
//                   className={`flex p-0.5 min-w-[5rem] mr-[2rem] text-sm justify-center rounded-sm hover:bg-slate-300 bg-slate-200`}
//                   onClick={() => { setActiveFormat(!activeFormat) }}>
//                   {highlightFormat}
//                 </button>
//                 <div className={`${activeFormat ? "" : "hidden"} flex mr-1 justify-center z-40 fixed w-80  rounded-sm shadow`}>
//                   <ul class="text-sm text-gray-700 dark:text-gray-200 divide-y">
//                     <li className={`w-80 flex justify-left p-2 cursor-pointer ${highlightFormat == "Highlight Genotypes by Color" ? "hover:bg-slate-200 bg-slate-200" : "bg-white hover:bg-slate-100"}  p-0.5`}
//                       onClick={() => { setActiveFormat(false); setHighlightFormat("Highlight Genotypes by Color") }}>
//                       Highlight Genotypes by Color
//                     </li>
//                     <li className={`w-80 p-2 flex justify-left cursor-pointer ${highlightFormat == "Highlight Genotypes by Color (onClick)" ? "hover:bg-slate-200 bg-slate-200" : "bg-white hover:bg-slate-100"} p-0.5`}
//                       onClick={() => { setActiveFormat(false); setHighlightFormat("Highlight Genotypes by Color (onClick)") }}>
//                       Highlight Genotypes by Color (onClick)
//                     </li>
//                     <li className={`w-80 p-2 flex justify-left cursor-pointer ${highlightFormat == "Highlight Homozygous Reference (onClick)" ? "hover:bg-slate-200 bg-slate-200" : "bg-white hover:bg-slate-100"} p-0.5`}
//                       onClick={() => { setActiveFormat(false); setHighlightFormat("Highlight Homozygous Reference (onClick)") }}>
//                       Highlight Homozygous Reference (onClick)
//                     </li>
//                     <li className={`w-80 p-2 flex justify-left cursor-pointer ${highlightFormat == "Highlight Heterozygous Variants (onClick)" ? "hover:bg-slate-200 bg-slate-200" : "bg-white hover:bg-slate-100"} p-0.5`}
//                       onClick={() => { setActiveFormat(false); setHighlightFormat("Highlight Heterozygous (onClick)") }}>
//                       Highlight Heterozygous (onClick)
//                     </li>
//                     <li className={`w-80 p-2 flex justify-left cursor-pointer ${highlightFormat == "Highlight Homozygous Alternative (onClick)" ? "hover:bg-slate-200 bg-slate-200" : "bg-white hover:bg-slate-100"} p-0.5`}
//                       onClick={() => { setActiveFormat(false); setHighlightFormat("Highlight Homozygous Alternative (onClick)") }}>
//                       Highlight Homozygous Alternative (onClick)
//                     </li>
//                     <li className={`w-80 p-2 flex justify-left cursor-pointer ${highlightFormat == "None" ? "hover:bg-slate-200 bg-slate-200" : "bg-white hover:bg-slate-100"}  p-0.5`}
//                       onClick={() => { setActiveFormat(false); setHighlightFormat("None") }}>
//                       None
//                     </li>
//                   </ul>
//                 </div>
//               </div>


//               <text className="mr-[1rem] text-sm">
//                 FILTER:
//               </text>
//               <div className="flex-col">
//                 <button
//                   type="button"
//                   className={`flex p-0.5 mr-[2rem] w-20 text-sm justify-center rounded-sm hover:bg-slate-300 bg-slate-200`}
//                   onClick={() => { setActivePF(!activePF) }}>
//                   {passFilter}
//                 </button>
//                 <div className={`${activePF ? "" : "hidden"} flex mr-1 justify-center z-40 fixed w-20  rounded-sm shadow`}>
//                   <ul class="text-sm text-gray-700 dark:text-gray-200 divide-y">
//                     <li className={`w-20 flex justify-center cursor-pointer ${passFilter == "ALL" ? "hover:bg-slate-200 bg-slate-200" : "bg-white hover:bg-slate-100"}  p-0.5`}
//                       onClick={() => { setActivePF(false); setPassFilter("ALL") }}>
//                       ALL
//                     </li>
//                     <li className={`w-20 flex justify-center cursor-pointer ${passFilter == "PASS" ? "hover:bg-slate-200 bg-slate-200" : "bg-white hover:bg-slate-100"} p-0.5`}
//                       onClick={() => { setActivePF(false); setPassFilter("PASS") }}>
//                       PASS
//                     </li>
//                   </ul>
//                 </div>
//               </div>

//               <button
//                 type="button"
//                 className={`flex mr-[1rem] p-0.5 w-24 text-sm justify-center rounded-sm hover:bg-slate-300 ${view2D ? 'bg-slate-300' : 'bg-slate-200'}`}
//                 onClick={() => { setView2D(true); setView3D(false) }}>
//                 View in 2D
//               </button>
//               <button
//                 type="button"
//                 className={`flex p-0.5 w-24 text-sm justify-center rounded-sm hover:bg-slate-300 ${view3D ? 'bg-slate-300' : 'bg-slate-200'}`}
//                 onClick={() => { setView2D(false); setView3D(true) }}>
//                 View in 3D
//               </button>

//             </div>
//           </div>

//           <div className={`ml-[2rem] pr-1 pl-1 text-sm ${searchGeneTerm == undefined || searchGeneTerm == "" ? "hidden" : ""}`}>
//             {dataObj != undefined && dataObj.data.title}
//           </div>
//           <div className="flex w-full h-[28rem] mt-[5rem]">
//             <NodeView />
//           </div>
//           <div className="flex-row w-full mt-20 h-6 flex">
//             <div className="flex ml-2 items-center">
//               <input className="" type="checkbox" id="topping" name="Homozygous Reference (0/0)" value="Paneer" checked={gtList[0]} onClick={() => setGtList([!gtList[0], gtList[1], gtList[2]])} />
//               Homozygous Reference (0/0)
//             </div>
//             <div className="flex ml-2 items-center">
//               <input className="" type="checkbox" id="topping" name="Homozygous Reference (0/0)" value="Paneer" checked={gtList[1]} onClick={() => setGtList([gtList[0], !gtList[1], gtList[2]])} />
//               Heterozygous (0/1)
//             </div>
//             <div className="flex ml-2 items-center">
//               <input className="" type="checkbox" id="topping" name="Homozygous Reference (0/0)" value="Paneer" checked={gtList[2]} onClick={() => setGtList([gtList[0], gtList[1], !gtList[2]])} />
//               Homozygous Alternative (1/1)
//             </div>
//           </div>
//         </div>