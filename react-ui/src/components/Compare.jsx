import React, { useEffect, useState } from 'react'
import { useStateContext } from '../contexts/ContextProvider';
import { SimplePane } from './Panes';
import HeatMap from './HeatMap';
import NoQuery from './NoQuery';
import { useCompareContext } from '../contexts/CompareContext';
import { useDisplayContext } from '../contexts/DisplayContext';
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from 'react-icons/ai';
import {BiSearchAlt} from 'react-icons/bi';
import NoFileUploaded from './NoFileUploaded';



const Compare = () => {

  const { activeMenu, selected, phenotypeList, pathList, toggleRS, toggleGS } = useStateContext();
  const { browserQuery, setBrowserQuery } = useDisplayContext();
  const { mapObj, setMapObj } = useCompareContext();

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
        {mapObj == null && <NoQuery infoText={"Enter a query above and upload a phenotype file to view sample read depth comparisons"}/>}
        
        
        <div className="flex flex-row text-sm w-full">
          <div className="flex h-full w-[40rem] p-2 justify-center">
            <HeatMap />
          </div>

          {compareInfo || !activeMenu ?
            <div className="flex w-full h-full justify-center">
              {overlay && activeMenu &&
                <div className="absolute top-1 right-60 z-[60]  hover:text-slate-500" onClick={() => setCompareInfo(false)}>
                  <AiOutlineDoubleRight  />
                </div>
              }
              <div className={`${overlay && activeMenu? "absolute top-0 right-0 w-64 h-full" : "flex grow"} z-50 flex-col  ${mapObj != null ? "bg-white  shadow-md" : ""} text-sm`}>
                <div className="flex h-4 ml-1.5 mt-4 justify-center">
                  {mapObj != null &&
                    <text className="flex text-clip items-center">Statistical Analysis</text>
                  }
                </div>
                {mapObj != null && mapObj.data != null && mapObj.data.geneList != null ?
                  <div className="flex-1 flex-col overflow-y-scroll items-center ml-2" >
                    {mapObj.data.geneList.map((item) => (
                      <div className="flex flex-col items-center">
                        <div className="flex w-full mt-2 bg-[#d3dee1] hover:bg-[#e3ebed] border-slate-400 py-1 cursor-pointer px-2" onClick={() => { setBrowserQuery("gene/" + item.ensembleID); console.log(item.ensembleID) }}>GENE: {item.gene} CHR: {item.chr}</div>
                        {item.variants.map((variant) => (
                          <div className="flex flex-col w-11/12 mt-2">
                            <div className="flex px-2 py-1 justify-between bg-[#ebebeb] hover:bg-[#f2f2f2] cursor-pointer" onClick={() => setBrowserQuery("region/" + variant.varChr + "-" + variant.varPos + "-" + variant.varPos)}>Variant: {variant.varPos}</div>
                            <div className="flex flex-col">
                              {variant.testResult.map((r) => (
                                <div className="flex px-2 text-[13px]">{r}</div>
                              ))}
                            </div>
                          </div>
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