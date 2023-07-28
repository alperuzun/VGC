import React from 'react'
import  TreeView  from './TreeView';
import NoFileUploaded from './NoFileUploaded';
import { useStateContext } from '../contexts/ContextProvider';



const Gene = () => {
  const { selected, setSelected } = useStateContext();

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
    <div className="flex flex-col w-full h-full">
        <div className="flex px-2 py-1.5 h-full w-full bg-slate-100  drop-shadow-md">
          <TreeView />
        </div>
    </div>
  )
}

export default Gene