import React, { useEffect, useState } from 'react'
import { BarChart, Bar, LabelList, Cell, Label, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { useStateContext } from '../contexts/ContextProvider';
import { SimplePane } from './Panes';
import HeatMap from './HeatMap';
import NoQuery from './NoQuery';
import { useCompareContext } from '../contexts/CompareContext';
import { useDisplayContext } from '../contexts/DisplayContext';
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from 'react-icons/ai';
import { BiSearchAlt } from 'react-icons/bi';
import NoFileUploaded from './NoFileUploaded';
import AnalysisComponent from './AnalysisComponent';



const Compare = () => {

  const { activeMenu, selected, phenotypeList, pathList, toggleRS, toggleGS, refresh, setRefresh } = useStateContext();
  const { browserQuery, setBrowserQuery } = useDisplayContext();
  const { mapObj, setMapOb, replicates, setReplicates } = useCompareContext();

  const [compareInfo, setCompareInfo] = useState(true);
  const [overlay, setOverlay] = useState(false);

  const getFileData = () => {
    if (selected == null) {
      return "No file selected.";
    } else {
      return pathList[pathList.indexOf(selected)];
    }
  }

  const getPhenotypeData = () => {
    if (selected == null) {
      return "No file selected.";
    } else if (phenotypeList[pathList.indexOf(selected)] == null) {
      return "No phenotype file added.";
    }
    return phenotypeList[pathList.indexOf(selected)];
  }

  const handleReplicatesSubmit = (e) => {
    e.preventDefault();
    setRefresh(!refresh);
  }

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 1300) {
        setOverlay(true);
      } else {
        setCompareInfo(true);
        setOverlay(false);
      }
    }

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    }

  }, [])

  if (selected === null || selected === undefined) {
    return (
      <div className="flex w-full h-full overflow-x-clip">
        <div className="flex w-full h-full">
          <NoFileUploaded noVCF={true} />
        </div>
      </div>

    )
  }


  return (
    <div className="flex flex-col w-full h-full">
      <div className={`flex bg-slate-100 w-full h-full drop-shadow-md`}>
        {mapObj == null && <NoQuery infoText={"Enter a query above to view sample read depth comparisons."} />}


        <div className="flex flex-row text-sm w-full">
          <div className="flex h-full w-[40rem] p-2 justify-center">
            <HeatMap />
          </div>

          {compareInfo || !activeMenu ?
            <div className="flex w-full h-full justify-center">
              {overlay && activeMenu && mapObj != null &&
                <div className="absolute top-1 right-60 z-[60]  hover:text-slate-500" onClick={() => setCompareInfo(false)}>
                  <AiOutlineDoubleRight />
                </div>
              }
              <div className={`${overlay && activeMenu ? "absolute top-0 right-0 w-64 h-full " : "flex grow"} z-50 flex-col  ${mapObj != null ? "bg-white  shadow-md" : ""} text-sm`}>
                <div className="flex flex-col w-full h-full relative">
                  <div className="flex h-8 ml-1.5 mt-4 justify-center w-full">
                    {mapObj != null &&
                      <text className="flex text-clip items-center font-bold">Statistical Analysis</text>
                    }
                  </div>
                  {mapObj != null && mapObj.data != null && mapObj.data.geneList != null ?
                    <div className="flex-1 flex-col overflow-y-auto gap-2 items-center px-2" >

                      {phenotypeList[pathList.indexOf(selected)] != null && 
                      <div className="flex flex-wrap font-bold px-2 py-1 border-1 border-slate-700">
                        Fisher's Exact Test with simulated p-value:
                        <div className="flex gap-2">
                          <label className="font-bold">Iterations: </label>
                          <input value={replicates} onChange={(e) => setReplicates(e.target.value)} className="w-12" />
                        </div>
                        {/* Future Addition: Replicates as user input. */}
                        {/* <form onSubmit={(e) => { handleReplicatesSubmit(e) }} className="flex gap-2">
                          <label className="font-bold">Iterations: </label>
                          <input value={replicates} onChange={(e) => setReplicates(e.target.value)} className="w-12" />
                          <input type="submit" value="Update" className="text-sm justify-center rounded-full border-1 border-slate-500 hover:bg-slate-200 px-2" />
                        </form> */}
                      </div>
                    }

                      {mapObj.data.geneList.map((item) => (
                        <div className="flex flex-col items-center">
                          <div className="flex w-full mt-2 bg-[#d3dee1] hover:bg-[#e3ebed] border-slate-400 py-1 cursor-pointer px-2" onClick={() => { setBrowserQuery("gene/" + item.ensembleID); console.log(item.ensembleID) }}>GENE: {item.gene} CHR: {item.chr}</div>
                          {item.variants.map((variant) => (
                            <AnalysisComponent variant={variant}/>
                          ))}
                        </div>
                      ))}
                    </div>
                    :
                    <div>
                    </div>
                  }
                </div>
              </div>
            </div>
            :
            <div className="flex h-full w-full justify-center ">
              {overlay &&
                <div className="absolute top-1 right-1 z-[60] ">
                  <AiOutlineDoubleLeft className="hover:text-slate-500" onClick={() => setCompareInfo(true)} />
                </div>
              }
            </div>
          }



        </div>

      </div>
    </div>

  )
}

export default Compare