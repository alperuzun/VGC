import React, {useState, useEffect} from 'react'
import { useNodeContext } from '../contexts/NodeContext'
import { useStateContext } from '../contexts/ContextProvider';
import '../css/TabBar.css';

const TabBar = () => {
  const { nlData, dataObj, queryList, setQueryList, setCurrView, setCurrDataObj } = useNodeContext(); 

  const { activeMenu, refresh, selected, currentlyViewing } = useStateContext();

  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    setSelectedTab(0);
  }, [refresh])

  const TabButton = ({ name, width}) => {


    return (
      <div className={`flex h-7  min-w-min whitespace-nowrap text-[#3f89c7] text-sm px-3 items-center justify-center cursor-pointer border-b-2 ${queryList.indexOf(name) == selectedTab ? "bg-slate-100 text-[#3f89c7] border-[#3f89c7] " : "bg-slate-300 text-slate-700 hover:text-slate-500 hover:bg-slate-200 border-slate-400 border-transparent"}`} onClick={() => {
        setCurrView(nlData[queryList.indexOf(name)]);
        setSelectedTab(queryList.indexOf(name));
        setCurrDataObj(dataObj[queryList.indexOf(name)]);
        console.log("Printing nlData....");
        console.log(nlData);
        console.log("Printing selected tab index...");
        console.log(selectedTab);
        console.log("Printing selected tab index...");
        console.log(queryList.indexOf(name));
        }}>
        {name}
      </div>
    )
  }

  return (
    <div className={`flex flex-row h-7 w-full bg-slate-200 overflow-y-clip overflow-x-auto`}
    style={{ width: activeMenu ? window.innerWidth - 410 : window.innerWidth - 28 }}>
      {queryList.map((item) => (
        <TabButton 
        name={item}
        width={12}
        />
      ))}
    </div>
  )
}

export default TabBar