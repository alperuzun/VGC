import React, { useEffect, useState } from 'react'
import TabBar from './TabBar';
import NodeView from './NodeView';
import { SimplePane } from './Panes';
import { NodeContext, useNodeContext } from '../contexts/NodeContext';
import { useStateContext } from '../contexts/ContextProvider';
import { AiFillSetting, AiOutlineClose } from 'react-icons/ai';
import { RiErrorWarningLine } from 'react-icons/ri';
import NoFileUploaded from './NoFileUploaded';


const Graph = () => {
  const { selected, setSelected, searchRangeTerm, setSearchRangeTerm, searchGeneTerm, setSearchGeneTerm, toggleRS, setToggleRS, toggleGS, setToggleGS, phenotypeList, pathList, refresh, setRefresh } = useStateContext();

  const { nlData, setNLData, checkEmpty, dataObj, setDataObj, view2D, setView2D, view3D, setView3D, nodeSize, setNodeSize, gtList, setGtList, passFilter, setPassFilter, highlightFormat, setHighlightFormat, settingsVisible, setSettingsVisible, sampleColors, setSampleColors, variantColor, setVariantColor, currDataObj, patientGroupings, setPatientGroupings } = useNodeContext();

  const [data, setData] = useState("Data will appear here");

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

  if (selected === null || selected === undefined) {
    return (
      <div className="flex w-full h-full overflow-x-clip">
        <div className="flex w-full h-full">
          <NoFileUploaded noVCF={true}/>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full h-full overflow-x-clip ">

      <TabBar />

      <div className={`flex px-2 py-1.5 bg-slate-100 w-full h-full drop-shadow-md `}>
          <div className="flex flex-row w-full h-full overflow-hidden">
            <div className="flex-1 flex-col">
              <div className="flex flex-row h-8 p-1 mt-[8px] z-50 items-center">

                <div className="flex grow items-center">

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
                    className={`flex mr-[1rem] p-0.5 w-24 text-sm justify-center rounded-full border-1 border-slate-500 hover:bg-slate-200 ${view2D ? 'bg-slate-200' : 'bg-slate-100'}`}
                    onClick={() => { setView2D(true); setView3D(false) }}>
                    View in 2D
                  </button>
                  <button
                    type="button"
                    className={`flex p-0.5 w-24 text-sm justify-center rounded-full border-1 border-slate-500 hover:bg-slate-200 ${view3D ? 'bg-slate-200' : 'bg-slate-100'}`}
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

              <div className="flex-1">
                <div className="w-fit">
                  <NodeView setData={setData} />
                </div>
                <div className="absolute top-20 left-10 opacity-75 max-h-full h-fit w-72 rounded-md justify-self-end items-start p-2 z-60 bg-white overflow-scroll text-sm">
                  <div dangerouslySetInnerHTML={{ __html: data }} />
                </div>
              </div>
            </div>

            {/* PREFERENCES SIDEBAR */}

            <div className={`${settingsVisible ? "" : "hidden"} fixed w-72 h-full right-[1px] items-center shadow-lg  p-2 bottom-[0px] bg-white`}>
              <div className="flex w-full bg-[#3f89c7] ">
                <button className="absolute items-center text-white hover:text-slate-300 rounded-full p-1 z-50" onClick={() => setSettingsVisible(!settingsVisible)}>
                  <AiOutlineClose />
                </button>
                <text className="flex grow justify-center font-thin text-white text-[15px] rounded-sm">Preferences</text>
              </div>
              <div className="flex flex-col items-center mt-4 w-full gap-2">
                <div className="flex text-sm  w-full h-0.5 justify-center bg-slate-500 items-center mt-4 mb-3">
                  <text className="bg-white px-2 text-slate-600">Graph Options</text>
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
                    &&
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
                  }

                  {patientGroupings == "HIDDEN" && phenotypeList[pathList.indexOf(selected)] != null && currDataObj != null && currDataObj.patientGroups != null
                  && 
                    <div className="flex-row">
                      <text className="text-sm">Sample Color:</text>
                      <input type="color" className="w-7 h-5 ml-2" value={sampleColors[0]} onChange={(e) => {
                            var colorCopy = [...sampleColors];
                            for (var i = 0; i < currDataObj.patientGroups.length; i++) {
                              colorCopy[Number(currDataObj.patientGroups[i])] = e.target.value.toString();
                            }
                            setSampleColors(colorCopy);
                          }}></input>
                    </div>
                  }

                {currDataObj != null && (phenotypeList[pathList.indexOf(selected)] == null || currDataObj.patientGroups == null)
                  && 
                    <div className="flex-row">
                      <text className="text-sm">Sample Color:</text>
                      <input type="color" className="w-7 h-5 ml-2" value={sampleColors[0]} onChange={(e) => {
                            var colorCopy = [e.target.value.toString()];
                            setSampleColors(colorCopy);
                          }}></input>
                    </div>
                  }

                </div>


                <div className="flex text-sm  w-full h-0.5 justify-center bg-slate-500 items-center mt-6 mb-3">
                  <text className="bg-white px-2 text-slate-600">Query Options</text>
                </div>
              </div>
              <div className="flex flex-col w-full mt-2 text-sm gap-2">
                <div className="flex ml-2 items-center gap-2">
                  <input className="accent-[#3f89c7] focus:border-[#3f89c7]  border-2 border-gray-400 rounded-md" type="checkbox" id="topping" name="Homozygous Reference (0/0)" value="Paneer" checked={gtList[0]} onClick={() => setGtList([!gtList[0], gtList[1], gtList[2]])} />
                  Homozygous Reference (0/0)
                </div>
                <div className="flex ml-2 items-center gap-2">
                  <input className="accent-[#3f89c7] focus:border-[#3f89c7]  border-2 border-gray-400 rounded-md" type="checkbox" id="topping" name="Homozygous Reference (0/0)" value="Paneer" checked={gtList[1]} onClick={() => setGtList([gtList[0], !gtList[1], gtList[2]])} />
                  Heterozygous (0/1)
                </div>
                <div className="flex ml-2 items-center gap-2">
                  <input className="accent-[#3f89c7] focus:border-[#3f89c7]  border-2 border-gray-400 rounded-md" type="checkbox" id="topping" name="Homozygous Reference (0/0)" value="Paneer" checked={gtList[2]} onClick={() => setGtList([gtList[0], gtList[1], !gtList[2]])} />
                  Homozygous Alternative (1/1)
                </div>
              </div>
              
              <button
                className="w-24 h-7 mt-6 flex mr-[1rem] p-0.5 text-sm justify-center text-center ml-[90px] rounded-full border-1 border-slate-500 hover:bg-slate-200"
                onClick={() => {
                  setRefresh(!refresh)
                  if (passFilter == "PATHOGENIC") {
                    setVariantColor("#ca5656");
                  } else {
                    setVariantColor("#3f89c7");
                  }
                }}>
                Update
              </button>
            </div>
          </div>

      </div>
    </div>
  )
}

export default Graph

