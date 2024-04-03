import React, { useEffect, useState } from 'react'
import { useStateContext } from '../contexts/ContextProvider'
import { useBarContext } from '../contexts/BarContext';
import LoadingOverlay from './LoadingOverlay';



const AboutData = () => {

  const { selected, currentlyViewing, setCurrentlyViewing } = useStateContext();
  const { histogramData, selectedBarEntry } = useBarContext();

  const [pathogenicList, setPathogenicList] = useState([]);
  const [benignList, setBenignList] = useState([]);
  const [unknownList, setUnknownList] = useState([]);
  const [potentialPathVar, setPotentialPathVar] = useState([]);
  const [POS, setPOS] = useState("N/A");
  const [REF, setREF] = useState("N/A");
  const [ALT, setALT] = useState("N/A");
  const [isPathogenic, setIsPathogenic] = useState(undefined);
  const [pathString, setPathString] = useState("Select a variant to view pathogenicity.")

  useEffect(() => {
    setPathogenicList([]);
    setBenignList([]);
    setUnknownList([]);
    setPotentialPathVar([]);
    setPOS("N/A");
    setREF("N/A");
    setALT("N/A");
    setIsPathogenic(undefined);
    setPathString("Select a variant to view pathogenicity.");
  }, [selected])


  useEffect(() => {
    if (histogramData != null && histogramData.data.svpData[selectedBarEntry] != null) {
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

  if (histogramData === undefined || histogramData === null) {
    return (
      <div>
        <LoadingOverlay />
      </div>

    );
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
    <div className="flex flex-col">
      <div className="flex text-sm w-full px-4 bg-white border-1 border-black">
        File Information
      </div>
      <div className="flex flex-col ml-2 mr-80 px-4 w-full text-sm">
        <div><text className="font-bold">Path: </text>{currentlyViewing.name} </div>
        <div>Currently viewing VCF file <text className="font-bold">Version {currentlyViewing.version}</text> with <text className="font-bold">{currentlyViewing.numPatients} samples</text>, <text className="font-bold">{currentlyViewing.chromosomes} chromosomes</text>, and <text className="font-bold">{currentlyViewing.numVariants} total variants.</text>  </div>
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
      </div>

    </div>
  )
}

export default AboutData
