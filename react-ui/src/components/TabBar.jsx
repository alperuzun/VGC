import React, {useState, useEffect} from 'react'
import { useNodeContext } from '../contexts/NodeContext'
import { useStateContext } from '../contexts/ContextProvider';

const TabBar = () => {
  const { nlData, dataObj, queryList, setCurrView, setCurrDataObj } = useNodeContext(); 

  const { refresh } = useStateContext();

  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    setSelectedTab(0);
  }, [refresh])

  const TabButton = ({ name, width}) => {

    return (
      <div className="flex h-8 items-center ">
      <div className={`flex h-6 w-[` + width + `rem] text-white text-sm px-3 rounded-t-lg justify-center cursor-pointer ${queryList.indexOf(name) == selectedTab ? "bg-[#3f89c7]" : "bg-slate-400 "}`} onClick={() => {
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
      </div>
    )
  }

  return (
    <div className="flex flex-row h-8 w-full bg-slate-200">
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