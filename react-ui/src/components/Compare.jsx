import React from 'react'
import { useStateContext } from '../contexts/ContextProvider';
import { SimplePane } from './Panes';
import { HeatMap } from '.';
import { useCompareContext } from '../contexts/CompareContext';
import { useDisplayContext } from '../contexts/DisplayContext';

import { TooltipComponent } from "@syncfusion/ej2-react-popups";



const Compare = () => {

  const { selected, phenotypeList, pathList, toggleRS, toggleGS } = useStateContext();
  const { browserQuery, setBrowserQuery } = useDisplayContext();
  const { mapObj, setMapObj } = useCompareContext();


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

  return (
    <div>
      <SimplePane>
        {mapObj == null && <div className="fixed p-2">Enter a query above and upload a phenotype file to view sample read depth comparisons.</div> }
        <div className="flex flex-row text-sm w-full">
          {/* <text className="px-2 mt-2">VCF File Path: {getFileData()}</text>
        <text className="px-2">Phenotype File Path: {getPhenotypeData()}</text> */}
          <div className="flex w-[40rem] h-full p-2 ">
            <HeatMap />
          </div>
          <div className={`flex flex-col w-full h-min mt-2 mr-2 ${mapObj != null ?"bg-white ": ""}p-1`}>
            <div className="flex h-4 ml-1.5 mt-2 justify-center">
              {mapObj != null &&
              <text className="flex items-center">Statistical Analysis</text>
              } 
            </div>
            {mapObj != null && mapObj.data != null && mapObj.data.geneList != null ?

              <div className="flex flex-col w-full h-[35.5rem] overflow-y-scroll " onClick={() => { }}>
                {mapObj.data.geneList.map((item) => (
                  <div className="flex flex-col items-center">
                    <div className="flex w-full mt-2 bg-[#d3dee1] hover:bg-[#e3ebed] border-slate-400 py-1 cursor-pointer px-2" onClick={() => {setBrowserQuery("gene/" + item.ensembleID); console.log(item.ensembleID)}}>GENE: {item.gene} CHR: {item.chr}</div>
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
              <div></div>
            }
            {/* <div className="flex h-8 ml-1.5 mt-1.5 justify-center border-y-1 border-slate-300 hover:bg-[#E9F0F2] cursor-pointer " onClick={() => {console.log("hi"); console.log(mapObj.data.varInfoList)}}>
              <text className="flex items-center">Variant Position: 120000000</text>
            </div> */}
          </div>

        </div>

      </SimplePane>
    </div>
  )
}

export default Compare