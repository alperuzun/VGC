import React, { useState } from 'react'
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import { AiOutlineFileAdd } from 'react-icons/ai';
import { useStateContext } from '../contexts/ContextProvider';


const NoFileUploaded = ({ noVCF, noPhenotype }) => {
  const { selected, setSelected, handleNewPath, refresh, setRefresh, setSearchGeneTerm, setSearchRangeTerm } = useStateContext();

  const [activeFilterSelect, setActiveFilterSelect] = useState(false);


  return (
    <div className={`flex m-2 mt-2 bg-slate-100 w-full drop-shadow-md `}>

      <div className="flex flex-col items-center justify-center h-full w-full">

        <div className="flex bg-slate-200 rounded-lg">
          {noVCF && <AiOutlineFileAdd className="text-slate-50 text-[10rem] m-6" />}
        </div>
        <div className="flex mt-4 text-slate-500 font-light text-l">Visualization requires VCF data. Upload a file to get started!
        </div>

        <div className="flex flex-row">
          <label>
            <div className="hidden">
              <input
                type="file"
                id="myfile"
                onChange={e => {
                  handleNewPath(e.target.files[0], "GRCh37");
                  setSelected(e.target.files[0].path);
                  setSearchGeneTerm("");
                  setSearchRangeTerm("");
                  e.target.value = ''
                }}
                name="myfile"
                accept=".vcf"
                multiple />
            </div>
            <div className="flex flex-col p-1 m-4  w-56 text-sm justify-center items-center text-no-wrap rounded-full cursor-pointer border-1 border-slate-500 hover:bg-slate-200 hover:scale-[1.02] transform transition-transform text-slate-500">
              <text className="flex"> Upload a VCF File </text>
              <text className="flex text-xs"> Genome Assembly: GRCh37 </text>
            </div>
          </label>

          <label>
            <div className="hidden">
              <input
                type="file"
                id="myfile"
                onChange={e => {
                  handleNewPath(e.target.files[0], "GRCh38");
                  setSelected(e.target.files[0].path);
                  setSearchGeneTerm("");
                  setSearchRangeTerm("");
                  e.target.value = ''
                }}
                name="myfile"
                accept=".vcf"
                multiple />
            </div>
            <div className="flex flex-col p-1 m-4  w-56 text-sm justify-center items-center text-no-wrap rounded-full cursor-pointer border-1 border-slate-500 hover:bg-slate-200 hover:scale-[1.02] transform transition-transform text-slate-500">
              <text className="flex"> Upload a VCF File </text>
              <text className="flex text-xs"> Genome Assembly: GRCh38 </text>
            </div>
          </label>
        </div>

        {noPhenotype && <AiOutlineUsergroupAdd />}
      </div>
    </div>
  )
}

export default NoFileUploaded