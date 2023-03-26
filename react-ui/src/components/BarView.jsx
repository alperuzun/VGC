import React, { useRef, useEffect, useState } from 'react'
import { BarChart, Bar, LabelList, Cell, Label, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useStateContext } from '../contexts/ContextProvider'
import { useBGContext, useDisplayContext } from '../contexts/DisplayContext'
import { useBarContext } from '../contexts/BarContext';
import FileService from '../services/FileService';

const BarView = () => {
  const { histogramData, setHistogramData, barHistory, setBarHistory, handleBarAction, historyIndex, setHistoryIndex, geneHistory, setGeneHistory, mapHistory, setMapHistory, passFilter, setPassFilter, GSError, setGSError, RSError, setRSError, selectedBarEntry, setSelectedBarEntry } = useBarContext();
  const { isClicked, browserQuery, setBrowserQuery } = useDisplayContext();
  const { selected, setSelected, pathList, phenotypeList, sizeList, currentlyViewing, setCurrentlyViewing, searchRangeTerm, setSearchRangeTerm, searchGeneTerm, setSearchGeneTerm, toggleRS, setToggleRS, toggleGS, setToggleGS, refresh, setRefresh } = useStateContext();

  const initialRender = useRef(true);
  const prevVals = useRef({ selected, refresh, isClicked });


  //Come back to this - Clean up the tooltip code!!
  const tool_tip_outer_flex = `flex flex-col w-60 h-16 bg-white items-center shadow rounded-sm border-slate-400`
  const tool_tip_purple = `flex w-full h-2 bg-[#1f547e]`
  const tool_tip_inner_flex = `flex justify-center w-full flex-col`

  const CustomToolTip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={tool_tip_outer_flex}>
          <div className={tool_tip_purple}></div>
          <div className={tool_tip_inner_flex}>
            <nbr className="flex justify-center w-full"> Chromosome: {label} </nbr>
            <nbr className="flex justify-center w-full text-[#62a2d7]"> Number of variants: {payload[0].value} </nbr>
          </div>
        </div>
      );
    }
    return null;
  }

  const ZoomedToolTip = ({ active, payload, label }) => {
    const upperBound = Number(label) + Number(histogramData.data.zoomFactor)
    if (active && payload && payload.length) {
      return (
        <div className="flex flex-col w-60 h-16 bg-white items-center shadow rounded-sm border-slate-400">
          <div className="flex w-full h-2 bg-[#1f547e] "></div>
          <div className="flex justify-center w-full flex-col">
            <nbr className="flex justify-center w-full"> Range: {label}-{upperBound}</nbr>
            <nbr className="flex justify-center w-full text-[#62a2d7]"> Number of variants: {payload[0].value} </nbr>
          </div>
        </div>
      );
    }
    return null;
  }

  function GeneExonToolTipHelper(names, conditions, significances) {
    var nameArray = names.split("&&nextvariant&&")
    var conditionArray = conditions.split("&&nextvariant&&")
    var significanceArray = significances.split("&&nextvariant&&")
    var html = ''
    /*     for (let i = 0; i < nameArray.length; i++) {
          if (passFilter == "PATHOGENIC") {
            if (significanceArray[i].startsWith("Pathogenic")) {
              html = html + '<br /><div> \
              <div><strong>&#40;' + (i + 1) + '&#41; Variant name:</strong> ' + nameArray[i] + '</div> \
              <div><strong>Condition&#40;s&#41;:</strong> ' + conditionArray[i] + '</div> \
              <div><strong>Clinical significance:</strong> <span class="text-red-600">' + significanceArray[i] + '</span> </div> \
            </div>'
            }
          } else {
            if (significanceArray[i].startsWith("Pathogenic")) {
              html = html + '<br /><div> \
              <div><strong>&#40;' + (i + 1) + '&#41; Variant name:</strong> ' + nameArray[i] + '</div> \
              <div><strong>Condition&#40;s&#41;:</strong> ' + conditionArray[i] + '</div> \
              <div><strong>Clinical significance:</strong> <span class="text-red-600">' + significanceArray[i] + '</span> </div> \
            </div>'
            } else {
              html = html + '<br /><div> \
              <div><strong>&#40;' + (i + 1) + '&#41; Variant name:</strong> ' + nameArray[i] + '</div> \
              <div><strong>Condition&#40;s&#41;:</strong> ' + conditionArray[i] + '</div> \
              <div><strong>Clinical significance:</strong> <span class="text-green-500">' + significanceArray[i] + '</span> </div> \
            </div>'
            }
          }
        } */

    if (passFilter == "PATHOGENIC") {
      var pathogenicVariantCount = 0
      for (let i = 0; i < nameArray.length; i++) {
        if (significanceArray[i].startsWith("Pathogenic")) {
          pathogenicVariantCount++
          console.log(pathogenicVariantCount)
          html = html + '<br /><div> \
          <div><strong>&#40;' + (pathogenicVariantCount) + '&#41; Variant name:</strong> ' + nameArray[i] + '</div> \
          <div><strong>Condition&#40;s&#41;:</strong> ' + conditionArray[i] + '</div> \
          <div><strong>Clinical significance:</strong> <span class="text-red-600">' + significanceArray[i] + '</span> </div> \
        </div>'
        }
      }
    } else {
      for (let i = 0; i < nameArray.length; i++) {
        if (significanceArray[i].startsWith("Pathogenic")) {
          html = html + '<br /><div> \
            <div><strong>&#40;' + (i + 1) + '&#41; Variant name:</strong> ' + nameArray[i] + '</div> \
            <div><strong>Condition&#40;s&#41;:</strong> ' + conditionArray[i] + '</div> \
            <div><strong>Clinical significance:</strong> <span class="text-red-600">' + significanceArray[i] + '</span> </div> \
          </div>'
        } else {
          html = html + '<br /><div> \
            <div><strong>&#40;' + (i + 1) + '&#41; Variant name:</strong> ' + nameArray[i] + '</div> \
            <div><strong>Condition&#40;s&#41;:</strong> ' + conditionArray[i] + '</div> \
            <div><strong>Clinical significance:</strong> <span class="text-green-500">' + significanceArray[i] + '</span> </div> \
          </div>'
        }
      }
    }

    return html
  }

  const GeneExonToolTip = ({ active, payload, label }) => {
    const upperBound = Number(label) + Number(histogramData.data.zoomFactor)
    var displayLabel = `Range: ${label}-${upperBound}`
    if (Number(histogramData.data.zoomFactor) == 1) {
      displayLabel = `Variant Position: ${histogramData.data.xMarkToVarMap[label]} \n`
    }
    if (active && payload && payload.length == 1 && payload[0].value == 1) {
      return (
        <div className={`flex flex-col w-70 items-center shadow rounded-sm border-slate-400 text-sm`}>
          <div className="flex w-full h-2 bg-[#1f547e] rounded-t-sm">
          </div>
          <div className="flex justify-center w-full p-2 flex-col bg-white h-fit">
            <nbr className="flex justify-center w-full">
              {displayLabel}
            </nbr>
            <div className="flex justify-center w-full p-2 flex-col-reverse rounded-b-sm">
              {mapHistory[historyIndex] != undefined && mapHistory[historyIndex].get(label) != undefined && mapHistory[historyIndex].get(label).map((subBar) => (
                <div className="flex flex-col justify-center w-full">
                  {subBar.gene.localeCompare("none") === 0 ? (
                    <div>
                      Gene Not Found: {subBar.val} variants
                    </div>
                  ) : (
                    <div>
                      {subBar.gene}, {subBar.type.charAt(0).toUpperCase() + subBar.type.slice(1)} {subBar.num}: {subBar.val} variants
                    </div>
                  )}
                  {/* {subBar.gene}, {subBar.type.charAt(0).toUpperCase() + subBar.type.slice(1)} {subBar.num}: {subBar.val} variants */}


                  {subBar.inClinvar ?
                    <div>
                      <div><strong>Clinvar information: </strong> GRCh37 chromosome: {subBar.chromosome}, GRCh37 location: {subBar.location}, dbSNP ID: {subBar.snpId} </div>
                      <div dangerouslySetInnerHTML={{ __html: GeneExonToolTipHelper(subBar.name, subBar.conditions, subBar.significance) }} />
                    </div> :
                    <strong>Variant not found in Clinvar</strong>}
                </div>
              )
              )}
            </div>
          </div>

        </div>
      );
    } else if (active && payload && payload.length) {
      return (
        <div className={`flex flex-col w-70 items-center shadow rounded-sm border-slate-400`}>
          <div className="flex w-full h-2 bg-[#1f547e] rounded-t-sm">
          </div>
          <div className="flex justify-center w-full p-2 flex-col bg-white h-fit">
            <nbr className="flex justify-center w-full">
              {displayLabel}
            </nbr>
            <div className="flex justify-center w-full p-2 flex-col-reverse rounded-b-sm">
              {mapHistory[historyIndex] != undefined && mapHistory[historyIndex].get(label) != undefined && mapHistory[historyIndex].get(label).map((subBar) => (
                <div className="flex flex-col justify-center w-full">
                  {subBar.gene.localeCompare("none") === 0 ? (
                    <div>
                      Gene Not Found: {subBar.val} variants
                    </div>
                  ) : (
                    <div>
                      {subBar.gene}, {subBar.type.charAt(0).toUpperCase() + subBar.type.slice(1)} {subBar.num}: {subBar.val} variants
                    </div>
                  )}

                </div>
              )
              )}
            </div>
          </div>

        </div>
      );
    }
    return null;
  }

  const processData = (toProcess) => {
    var allKeys = new Set();
    var map = new Map();
    for (var i = 0; i < toProcess.length; i++) {
      for (var j = 0; j < toProcess[i].subBars.length; j++) {
        const newKey = j + toProcess[i].subBars[j].type;
        toProcess[i][newKey] = Number(toProcess[i].subBars[j].val);
        allKeys.add(newKey);
      }
      map.set(toProcess[i].x, toProcess[i].subBars);
    }
    var keys = Array.from(allKeys)
    const sorted = keys.sort();
    return { sorted, map };
  }

  const handleGeneQuery = async () => {
    console.log("Calling handleGeneQuery with: ")
    console.log("HistoryIndex: " + historyIndex)
    const newData = await FileService.getHistogramByGene(searchGeneTerm.trim(), passFilter);
    console.log(newData);
    if (newData.data === '') {
      setGSError(true);
    } else if (newData.data.zoomFactor <= 10000) {
      const { sorted, map } = processData(newData.data.data)
      console.log("Processed data:")
      console.log(sorted);
      console.log("Map:")
      console.log(map);
      handleBarAction(newData, sorted, map);
      setHistogramData(newData);
    } else {
      handleBarAction(newData, undefined, undefined);
      setHistogramData(newData);
    }
  }

  const handleRangeQuery = async (chr, start, end) => {
    console.log("Calling handleRangeQuery with: ")
    console.log("HistoryIndex: " + historyIndex)
    const newData = await FileService.getHistogramByRange(chr, start, end, passFilter);
    if (newData.data === '') {
      setRSError(true);
    } else if (newData.data.zoomFactor <= 10000) {
      const { sorted, map } = processData(newData.data.data)
      console.log("Processed data:")
      console.log(sorted);
      console.log("Map:")
      console.log(map);
      handleBarAction(newData, sorted, map);
      setHistogramData(newData);
      setBrowserQuery("region/" + chr + "-" + start + "-" + end);
    } else {
      handleBarAction(newData, undefined, undefined);
      setHistogramData(newData);
      setBrowserQuery("region/" + chr + "-" + start + "-" + end);
    }
  }

  const handleFileChosen = async (filePath) => {
    await FileService.addFile({
      path: filePath,
      phenotypePath: phenotypeList[pathList.indexOf(filePath)],
      size: sizeList[pathList.indexOf(filePath)]
    });
    const genericGraph = await FileService.getVarToChromGraph(passFilter);
    const fileInfo = await FileService.getFileInfo();
    setHistogramData(genericGraph);
    setCurrentlyViewing(fileInfo.data);
    handleBarAction(genericGraph, undefined, undefined);
    console.log(barHistory);
    console.log("Index:" + historyIndex);
  }

  const handleReset = async (filePath) => {
    await FileService.addFile({
      path: filePath,
      phenotypePath: phenotypeList[pathList.indexOf(filePath)],
      size: sizeList[pathList.indexOf(filePath)]
    });
    const genericGraph = await FileService.getVarToChromGraph(passFilter);
    const fileInfo = await FileService.getFileInfo();
    setHistogramData(genericGraph);
    setCurrentlyViewing(fileInfo.data);
    setBarHistory([genericGraph]);
    setGeneHistory([undefined]);
    setMapHistory([undefined]);
    setHistoryIndex(0);
    console.log(barHistory);
    console.log("Index:" + historyIndex);
  }

  useEffect(() => {
    if (prevVals.current.selected != selected) {
      setHistoryIndex(undefined);
      setHistogramData(undefined);
      if (selected !== undefined) {
        handleReset(selected);
      }
      prevVals.current = { selected, refresh, isClicked }
    } else {
      if (searchGeneTerm != '' && searchGeneTerm != null && selected != null && toggleGS === true) {
        console.log("In start...handling gene query...selected file is: ");
        console.log(selected);
        handleGeneQuery();
      } else if (searchRangeTerm != '' && searchRangeTerm != null && selected != null && toggleRS === true) {
        console.log("In start...handling range query...");
        let trimmedQuery = searchRangeTerm.trim();
        let chr = trimmedQuery.substring(0, trimmedQuery.indexOf(":"));
        let startPos = trimmedQuery.substring(trimmedQuery.indexOf(":") + 1, trimmedQuery.indexOf("-"));
        let endPos = trimmedQuery.substring(trimmedQuery.indexOf("-") + 1);
        handleRangeQuery(chr, startPos, endPos)
      } else if (selected != null) {
        console.log("Creating generic graph...");
        handleFileChosen(selected);
      }
    }

  }, [refresh, selected, isClicked])


  if (histogramData === undefined) {
    return (
      <div>
        Displaying your graph...
      </div>
    );
  }

  const handleClick = async (index, entry) => {
    console.log("click!");
    if (histogramData.data.chr === undefined || histogramData.data.zoomFactor === null) {
      const newData = await FileService.getZoomedgraph(index, passFilter);
      handleBarAction(newData, undefined, undefined);
      setHistogramData(newData);
    } else {
      if (histogramData.data.zoomFactor != 1) {
        console.log("here! about to zoom w/ g/e info.");
        const endNum = Number(entry.x) + Number(histogramData.data.zoomFactor)
        const newData = await FileService.getFurtherZoom(histogramData.data.chr,
          entry.x,
          endNum.toString(),
          histogramData.data.zoomFactor,
          passFilter);
        console.log("post call");

        if (newData.data.zoomFactor <= 10000) {
          const { sorted, map } = processData(newData.data.data)
          handleBarAction(newData, sorted, map);
          setHistogramData(newData);
        } else {
          handleBarAction(newData, undefined, undefined);
          setHistogramData(newData);
        }
        console.log("Post call, new data is: ");
        console.log(newData);
        console.log("Post call, new history is: ");
        console.log(barHistory);
      } else {
        setBrowserQuery("region/" + histogramData.data.chr + "-" + histogramData.data.xMarkToVarMap[entry.x]);
        console.log("At full zoom! X entry: " + entry.x);
        setSelectedBarEntry(entry.x);
        console.log("Index is: " + index);
        console.log("Entry is: " + entry.x);
        console.log("Pos is: " + histogramData.data.xMarkToVarMap[entry.x]);
      }
    }
  }

  return (
    <div className="flex p-2 w-full h-full justify-center">
      {/* <ResponsiveContainer width="99%" height="99%"> */}
        <BarChart
          data={histogramData.data.data}
          margin={{
            top: 10,
            right: 35,
            left: 0,
            bottom: 10,
          }}
          width={850}
          height={400}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" />
          <YAxis />
          {histogramData.data.zoomFactor == null && geneHistory[historyIndex] == undefined && <Tooltip content={<CustomToolTip />} />}
          {histogramData.data.zoomFactor != null && geneHistory[historyIndex] == undefined && <Tooltip content={<ZoomedToolTip />} />}
          {histogramData.data.zoomFactor != null && geneHistory[historyIndex] != undefined && <Tooltip content={<GeneExonToolTip />} />}

          {geneHistory[historyIndex] == undefined && histogramData.data != undefined && histogramData.data.data != undefined &&
            <Bar dataKey="y" name="Number of Variants" fill={passFilter == "PATHOGENIC" ? "#ca5656" : "#3f89c7"}  >
              {histogramData.data.data.map((entry, index) => (
                <Cell cursor="pointer" key={`cell-${index}`} onClick={() => { handleClick(index + 1, entry) }} />
              ))}
            </Bar>
          }
          {geneHistory[historyIndex] != undefined && histogramData != undefined &&
            geneHistory[historyIndex].map((key) => (
              <Bar dataKey={key} stackId="a" fill={key.substring(1) == "exon" ? (passFilter == "PATHOGENIC" ? "#ca5656" : "#3f89c7") : (passFilter == "PATHOGENIC" ? "#ca5656a4" : "#3f8ac7a0")} >
                {histogramData.data.data.map((entry, index) => (
                  <Cell cursor="pointer" key={`cell-${index}`} onClick={() => { handleClick(index + 1, entry) }} />
                ))}
              </Bar>
            ))
          }
        </BarChart>
      {/* </ResponsiveContainer> */}
    </div>
  )
}

export default BarView
