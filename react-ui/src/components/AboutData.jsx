import React, { useEffect, useState } from 'react'
import { useStateContext } from '../contexts/ContextProvider'
import { useBarContext } from '../contexts/BarContext';



const AboutData = () => {

  const { selected, currentlyViewing, setCurrentlyViewing } = useStateContext();
  const { histogramData, selectedBarEntry } = useBarContext();

  // const [svpData, setSvpData] = useState([]);
  const [pathogenicList, setPathogenicList] = useState([]);
  const [benignList, setBenignList] = useState([]);
  const [unknownList, setUnknownList] = useState([]);
  const [potentialPathVar, setPotentialPathVar] = useState([]);
  const [inputVariant, setInputVariant] = useState("No variant selected.");
  const [POS, setPOS] = useState("N/A");
  const [REF, setREF] = useState("N/A");
  const [ALT, setALT] = useState("N/A");
  const [isPathogenic, setIsPathogenic] = useState(undefined);
  const [pathString, setPathString] = useState("Select a variant to view pathogenicity.")




  // useEffect(() => {
  //   if (histogramData != null && histogramData.data.svpData.length > 0) {
  //     setSvpData(histogramData.data.svpData);
  //     console.log(histogramData.data.svpData);
  //   }

  // }, [histogramData])

  useEffect(() => {
    console.log("changed selection!");
    console.log(selectedBarEntry);
    if (histogramData != null && histogramData.data.svpData[selectedBarEntry] != null) {
      console.log(histogramData.data.svpData);
      console.log(histogramData.data.svpData[selectedBarEntry]);
      setPotentialPathVar(histogramData.data.svpData[selectedBarEntry].clinvarPathogenicVariants);
      setPathogenicList(histogramData.data.svpData[selectedBarEntry].pathogenicSamples);
      setBenignList(histogramData.data.svpData[selectedBarEntry].benignSamples);
      setUnknownList(histogramData.data.svpData[selectedBarEntry].unknownSamples);
      setPOS(histogramData.data.svpData[selectedBarEntry].varInfo[1]);
      setREF(histogramData.data.svpData[selectedBarEntry].varInfo[3]);
      setALT(histogramData.data.svpData[selectedBarEntry].varInfo[4]);
      setIsPathogenic(histogramData.data.svpData[selectedBarEntry].isPathogenic);
      if (histogramData.data.svpData[selectedBarEntry].isPathogenic) {
        setPathString("Pathogenic variant detected");
      } else {
        setPathString("Benign variant detected")
      }
    }

  }, [selectedBarEntry])

  if (currentlyViewing == null) {
    return null;
  }

  const MappedList = ({ title, list }) => {
    return (
      <div className="flex flex-col w-1/3 items-center">
        <text className="flex font-bold">{title}: </text>
        <div className="flex flex-col w-full h-10 overflow-auto items-center">
        {list.map((item) => (
          <div>{item}</div>
        ))}
        </div>

      </div>
    )
  }

  return (
    <div className="flex flex-col ">
      <div className="flex text-sm w-full px-4 bg-white border-1 border-black">
        File Information
      </div>
      <div className="flex flex-col ml-2 mr-80 px-4 w-full text-sm">
        <div><text className="font-bold">Path: </text>{currentlyViewing.name} </div>
        <div>Currently viewing VCF file <text className="font-bold">Version {currentlyViewing.version}</text> with <text className="font-bold">{currentlyViewing.numPatients} samples</text> and <text className="font-bold">{currentlyViewing.chromosomes} chromosomes</text> with data.</div>
      </div>
      <div className="flex text-sm w-full px-4 bg-white border-1 border-black">
        Variant Identification
      </div>
      <div className={`flex w-full ${isPathogenic == undefined ? "bg-slate-300" : (isPathogenic ? "bg-red-300" : "bg-green-300")}`}>
        
        <text className="flex ml-2 px-4 text-sm">{pathString}.</text>
      </div>
      <div className="flex flex-row px-4 w-full text-sm">
        <div className="flex flex-col w-1/3 items-center ">
          <text className="flex font-bold">Input Variant </text>
          <text className="flex">POS: {POS}</text>
          <text className="flex">REF: {REF}, ALT: {ALT}</text>
          {/* <text className="flex">ALT: {ALT}</text> */}

        </div>
        <div className="flex flex-col w-1/3 items-center">
          <span className="flex font-bold">Pathogenic Variant&#x28;s&#x29;: </span>
          {potentialPathVar.map((item) => (
            <div>{item}</div>
          ))}
        </div>

        <MappedList
          title="Samples w/ Pathogenic GT"
          list={pathogenicList}
        />
        <MappedList
          title="Samples w/ Benign GT"
          list={benignList}
        />
        <MappedList
          title="Samples w/ Unknown GT"
          list={unknownList}
        />
        {/* <div className="flex flex-col w-1/3 items-center">
          <text className="flex font-bold">Samples w/ Pathogenic GT </text>
          {pathogenicList.map((item) => (
            <div>{item}</div>
          ))}
        </div>
        <div className="flex flex-col w-1/3 items-center">
          <text className="flex font-bold">Samples w/ Benign GT </text>
          {benignList.map((item) => (
            <div>{item}</div>
          ))}
        </div>

        <div className="flex flex-col w-1/3 items-center">
          <text className="flex font-bold">Samples w/ Unknown GT </text>
          {unknownList.map((item) => (
            <div>{item}</div>
          ))}
        </div> */}
      </div>

    </div>
  )
}

export default AboutData

//Alternative Organization
// return (
//   <div className="flex flex-col ">
//     <div className="flex w-full px-4 text-white bg-slate-400">
//       File Information
//     </div>
//     <div className="flex flex-col ml-2 mr-80 px-4 w-full">
//       <div>Path: {currentlyViewing.name} </div>
//       <div className="flex flex-row w-full">
//       <div className="flex-grow">Version: {currentlyViewing.version} </div>
//       <div className="flex-grow">Number of Samples: {currentlyViewing.numPatients}</div>
//       <div className="flex-grow">Number of Chromosomes with Data: {currentlyViewing.chromosomes}</div>
//       </div>
//     </div>
//     <div className="flex w-full px-4 text-white bg-slate-400">
//       Variant Identification
//     </div>
//   </div>
// )


//expanding (sort of) version:

// import React, { useEffect, useState } from 'react'
// import { useStateContext } from '../contexts/ContextProvider'
// import { useBarContext } from '../contexts/BarContext';
// import { BsChevronUp, BsChevronDown } from 'react-icons/bs'





// const AboutData = () => {

//   const { selected, currentlyViewing, setCurrentlyViewing } = useStateContext();
//   const { histogramData, selectedBarEntry } = useBarContext();

//   // const [svpData, setSvpData] = useState([]);
//   const [pathogenicList, setPathogenicList] = useState([]);
//   const [benignList, setBenignList] = useState([]);
//   const [unknownList, setUnknownList] = useState([]);
//   const [potentialPathVar, setPotentialPathVar] = useState([]);
//   const [inputVariant, setInputVariant] = useState("No variant selected.");
//   const [POS, setPOS] = useState("N/A");
//   const [REF, setREF] = useState("N/A");
//   const [ALT, setALT] = useState("N/A");
//   const [expanded, setExpanded] = useState(false);
//   const [isPathogenic, setIsPathogenic] = useState(undefined);
//   const [pathString, setPathString] = useState("Select a variant to view pathogenicity.")




//   // useEffect(() => {
//   //   if (histogramData != null && histogramData.data.svpData.length > 0) {
//   //     setSvpData(histogramData.data.svpData);
//   //     console.log(histogramData.data.svpData);
//   //   }

//   // }, [histogramData])

//   useEffect(() => {
//     console.log("changed selection!");
//     console.log(selectedBarEntry);
//     if (histogramData != null && histogramData.data.svpData[selectedBarEntry] != null) {
//       console.log(histogramData.data.svpData);
//       console.log(histogramData.data.svpData[selectedBarEntry]);
//       setPotentialPathVar(histogramData.data.svpData[selectedBarEntry].clinvarPathogenicVariants);
//       setPathogenicList(histogramData.data.svpData[selectedBarEntry].pathogenicSamples);
//       setBenignList(histogramData.data.svpData[selectedBarEntry].benignSamples);
//       setUnknownList(histogramData.data.svpData[selectedBarEntry].unknownSamples);
//       setPOS(histogramData.data.svpData[selectedBarEntry].varInfo[1]);
//       setREF(histogramData.data.svpData[selectedBarEntry].varInfo[3]);
//       setALT(histogramData.data.svpData[selectedBarEntry].varInfo[4]);
//       setIsPathogenic(histogramData.data.svpData[selectedBarEntry].isPathogenic);
//       if (histogramData.data.svpData[selectedBarEntry].isPathogenic) {
//         setPathString("Pathogenic variant detected");
//       } else {
//         setPathString("Benign variant detected")
//       }
//     }

//   }, [selectedBarEntry])

//   if (currentlyViewing == null) {
//     return null;
//   }

//   const MappedList = ({ title, list }) => {
//     return (
//       <div className="flex flex-col w-1/3 h-full items-center">
//         <text className="flex font-bold">{title}: </text>
//         <div className="flex flex-col w-full items-center">
//         {list.map((item) => (
//           <div>{item}</div>
//         ))}
//         </div>

//       </div>
//     )
//   }

//   return (
//     <div className={`flex flex-col w-full ${expanded ? 'h-[24rem]' : 'h-[12rem]'} `}>
//       <div className="flex text-sm w-full px-4 bg-white border-1 border-black">
//         File Information
//       </div>
//       <div className="flex flex-col ml-2 mr-80 px-4 w-full text-sm">
//         <div><text className="font-bold">Path: </text>{currentlyViewing.name} </div>
//         <div>Currently viewing VCF file <text className="font-bold">Version {currentlyViewing.version}</text> with <text className="font-bold">{currentlyViewing.numPatients} samples</text> and <text className="font-bold">{currentlyViewing.chromosomes} chromosomes</text> with data.</div>
//       </div>
//       <div className="flex text-sm w-full px-4 bg-white border-1 border-black">
//         Variant Identification
//       </div>
//       <div className={`flex w-full ${isPathogenic == undefined ? "bg-slate-300" : (isPathogenic ? "bg-red-300" : "bg-green-300")}`}>
//         <text className="flex ml-2 px-4 text-sm">{pathString}.</text>
//       </div>

//       <div className="flex flex-row px-4 w-full grow text-sm ">
//         <div className="flex flex-col w-1/3 h-full items-center">
//           <text className="flex font-bold">Input Variant </text>
//           <text className="flex break-words">POS: {POS}</text>
//           <text className="flex break-words">REF: {REF}, ALT: {ALT}</text>

//         </div>
//         <div className="flex flex-col w-1/3 h-full items-center">
//           <span className="flex font-bold">Pathogenic Variant&#x28;s&#x29;: </span>
//           {potentialPathVar.map((item) => (
//             <div>{item}</div>
//           ))}
//         </div>


//         <MappedList
//           title="Samples w/ Pathogenic GT"
//           list={pathogenicList}
//         />
//         <MappedList
//           title="Samples w/ Benign GT"
//           list={benignList}
//         />
//         <MappedList
//           title="Samples w/ Unknown GT"
//           list={unknownList}
//         />

//       </div>  
//       <div className={`flex w-full h-6 border-1 bg-white border-black items-center}`}>    
//         <button className={`p-2`} onClick={() => setExpanded(!expanded)}>
//           {expanded && <BsChevronUp/>}
//           {!expanded && <BsChevronDown/>}
//         </button>
//       </div>  
//       {/* <div className={`flex w-full h-6 border-1 bg-white border-black items-center ${expanded ? 'mt-[8.5rem]':'mt-[0.5rem]'}`}>    
//         <button className={`p-2`} onClick={() => setExpanded(!expanded)}>
//           {expanded && <BsChevronUp/>}
//           {!expanded && <BsChevronDown/>}
//         </button>
//       </div>     */}



//     </div>
//   )
// }

// export default AboutData

        {/* <div className="flex flex-col w-1/3 items-center">
          <text className="flex font-bold">Samples w/ Pathogenic GT </text>
          {pathogenicList.map((item) => (
            <div>{item}</div>
          ))}
        </div>
        <div className="flex flex-col w-1/3 items-center">
          <text className="flex font-bold">Samples w/ Benign GT </text>
          {benignList.map((item) => (
            <div>{item}</div>
          ))}
        </div>

        <div className="flex flex-col w-1/3 items-center">
          <text className="flex font-bold">Samples w/ Unknown GT </text>
          {unknownList.map((item) => (
            <div>{item}</div>
          ))}
        </div> */}

        
//Alternative Organization
// return (
//   <div className="flex flex-col ">
//     <div className="flex w-full px-4 text-white bg-slate-400">
//       File Information
//     </div>
//     <div className="flex flex-col ml-2 mr-80 px-4 w-full">
//       <div>Path: {currentlyViewing.name} </div>
//       <div className="flex flex-row w-full">
//       <div className="flex-grow">Version: {currentlyViewing.version} </div>
//       <div className="flex-grow">Number of Samples: {currentlyViewing.numPatients}</div>
//       <div className="flex-grow">Number of Chromosomes with Data: {currentlyViewing.chromosomes}</div>
//       </div>
//     </div>
//     <div className="flex w-full px-4 text-white bg-slate-400">
//       Variant Identification
//     </div>
//   </div>
// )