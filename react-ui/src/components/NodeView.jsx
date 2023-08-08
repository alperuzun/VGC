import React, { useEffect, useState, useRef } from 'react'
import { useStateContext } from '../contexts/ContextProvider'
import GraphService from '../services/GraphService'
import FileService from '../services/FileService';
import { NodeContext, useNodeContext } from '../contexts/NodeContext';
import { Sprite, CanvasTexture, SpriteMaterial, TextureLoader } from "three";

import ForceGraph2D from "react-force-graph-2d";
import ForceGraph3D from "react-force-graph-3d";
import { useDisplayContext } from '../contexts/DisplayContext';

const NodeView = ({ w, h, setData }) => {
  const { activeMenu, selected, currentlyViewing, setCurrentlyViewing, phenotypeList, pathList, handleRemovePath, sizeList, searchRangeTerm, searchGeneTerm, geneFileUpload, posFileUpload, toggleRS, toggleGS, refresh } = useStateContext();
  const { isClicked } = useDisplayContext();

  const { setNLData, setDataObj, view2D, nodeSize, gtList, passFilter, highlightFormat, settingsVisible, sampleColors, setSampleColors, variantColor, setQueryList, currView, setCurrView, currDataObj, setCurrDataObj, patientGroupings, setPatientGroupings } = useNodeContext();

  const fgRef = useRef();
  const prevVals = useRef({ selected, refresh, isClicked });
  const { browserQuery, setBrowserQuery } = useDisplayContext();
  const [clickedNode, setClickedNode] = useState(undefined);
  const [processing, setProcessing] = useState(false);
  const [singleColorFlag, setSingleColorFlag] = useState(false);
  const [multiColorFlag, setMultiColorFlag] = useState(false);

  const incrementColor = (col, amt) => {
    col = col.slice(1);
    var num = parseInt(col, 16);
    var r = (num >> 16) + amt;

    if (r > 255) r = 255;
    else if (r < 0) r = 0;

    var b = ((num >> 8) & 0x00FF) + amt;

    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    var g = (num & 0x0000FF) + amt;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    return "#" + (g | (b << 8) | (r << 16)).toString(16);
  }

  const handleColoring = (numGroups) => {
    console.log("In handlecoloring:")
    console.log(sampleColors);
    if (!singleColorFlag && !multiColorFlag) {
      if (numGroups === 0) {
        console.log("Patient groupings do no exist.");
        var colorArray = ["#BABABA"]
        setSampleColors(colorArray);
      } else if (numGroups > 0) {
        console.log("Patient groupings exist.");
        var colorArray = []
        var currColor = "#BABABA"
        var increment = 150 / numGroups;
        for (var i = 0; i < numGroups; i++) {
          colorArray[i] = currColor;
          currColor = incrementColor(currColor, -1 * increment);
        }
        setSampleColors(colorArray);
        setMultiColorFlag(true);
      }
      setSingleColorFlag(true);
    } else if (!multiColorFlag)  {
      if (numGroups > 0) {
        console.log("Patient groupings exist.");
        var colorArray = []
        var currColor = "#BABABA"
        var increment = 150 / numGroups;
        for (var i = 0; i < numGroups; i++) {
          colorArray[i] = currColor;
          currColor = incrementColor(currColor, -1 * increment);
        }
        setSampleColors(colorArray);
        setMultiColorFlag(true);
      }
    }
  }


  const searchGeneFile = async () => {
    if (geneFileUpload !== undefined) {
      console.log("Searching gene file from NodeView...")
      setProcessing(true);
      try {
        let retrievedData = await GraphService.getGeneFileNodeGraph(geneFileUpload, passFilter, gtList[0], gtList[1], gtList[2])
        const tempnlData = [];
        const tempNodeViews = retrievedData.data.nodeViewList;
        for (var i = 0; i < tempNodeViews.length; i++) {
          tempnlData.push({ nodes: tempNodeViews[i].nodes, links: tempNodeViews[i].links })
        }
        setNLData(tempnlData);
        setQueryList(retrievedData.data.queries);
        setCurrView(tempnlData[0]);
        setDataObj(tempNodeViews);
        setCurrDataObj(tempNodeViews[0]);
        console.log(retrievedData);
        handleColoring(tempNodeViews[0].patientGroups.length);
      } catch (error) {
        alert(error.response.data.message);
      } finally {
        setProcessing(false);
      }

    }
  }

  const searchPosFile = async () => {
    if (posFileUpload !== undefined) {
      console.log("Searching range file from NodeView...")
      setProcessing(true);
      try {
        let retrievedData = await GraphService.getPosFileNodeGraph(posFileUpload, passFilter, gtList[0], gtList[1], gtList[2])
        const tempnlData = [];
        const tempNodeViews = retrievedData.data.nodeViewList;
        for (var i = 0; i < tempNodeViews.length; i++) {
          tempnlData.push({ nodes: tempNodeViews[i].nodes, links: tempNodeViews[i].links })
        }
        setNLData(tempnlData);
        setQueryList(retrievedData.data.queries);
        setCurrView(tempnlData[0]);
        setDataObj(tempNodeViews);
        setCurrDataObj(tempNodeViews[0]);
        console.log(retrievedData);
        handleColoring(tempNodeViews[0].patientGroups.length);
      } catch (error) {
        alert(error.response.data.message);
      } finally {
        setProcessing(false);
      }

    }
  }

  const searchGene = async () => {
    if (searchGeneTerm !== undefined && searchGeneTerm != "") {
      console.log("Searching gene from NodeView...")
      console.log(gtList);

      setProcessing(true);
      try {
        let retrievedData = await GraphService.getGeneNodeGraph(searchGeneTerm, passFilter, gtList[0], gtList[1], gtList[2])
        setNLData([{ nodes: retrievedData.data.nodes, links: retrievedData.data.links }]);
        setQueryList([searchGeneTerm]);
        setCurrView({ nodes: retrievedData.data.nodes, links: retrievedData.data.links });
        setDataObj([retrievedData.data]);
        setCurrDataObj(retrievedData.data);

        console.log(retrievedData);
        handleColoring(retrievedData.data.patientGroups.length);
      } catch (error) {
        alert(error.response.data.message);
      } finally {
        setProcessing(false);
      }

    }
  }

  const searchRange = async () => {
    if (searchRangeTerm !== undefined && searchRangeTerm != "") {
      console.log("Searching range from NodeView...")
      setProcessing(true);
      try {
        let retrievedData = await GraphService.getRangeNodeGraph(searchRangeTerm, passFilter, gtList[0], gtList[1], gtList[2])
        setNLData([{ nodes: retrievedData.data.nodes, links: retrievedData.data.links }]);
        setQueryList([searchRangeTerm]);
        setCurrView({ nodes: retrievedData.data.nodes, links: retrievedData.data.links });
        setDataObj([retrievedData]);
        setCurrDataObj(retrievedData);
        console.log(retrievedData);
        handleColoring(retrievedData.data.patientGroups.length);
      } catch (error) {
        alert(error.response.data.message);
      } finally {
        setProcessing(true);
      }

    }
  }

  const handleFileChosen = async (filePath) => {
    try {
      await FileService.addFile({
        path: filePath,
        phenotypePath: phenotypeList[pathList.indexOf(filePath)],
        size: sizeList[sizeList.indexOf(filePath)]
      }); 
      const fileInfo = await FileService.getFileInfo();
      setCurrentlyViewing(fileInfo.data);
    } catch (error) {
      handleRemovePath(filePath);
      alert(error.response.data.message);
    }

  }

  const getSampleColor = (node) => {
    if (node.type == 'variant') {
      return variantColor;
    } else {
      if (node.group != null && sampleColors.length > 0 && patientGroupings == "VISIBLE" && phenotypeList[pathList.indexOf(selected)] != null) {
        return sampleColors[Number(node.group)];
      } else {
        return sampleColors[0];
      }
    }
  }


  const getDefaultLink = (is3D) => {
    if (is3D) {
      return "#010101";
    } else {
      return "";
    }
  }

  const handleLinkColor = (link, is3D) => {
    if (highlightFormat == "None") {
      return getDefaultLink(is3D);
    } else if (highlightFormat == "Highlight Genotypes by Color") {
      if (link.gt == "HR") {
        return '#79DB52';
      } else if (link.gt == "HT") {
        return '#D6DB52';
      } else if (link.gt == "HA") {
        return '#DDA547';
      } else {
        return getDefaultLink(is3D);
      }
    } else if (highlightFormat == "Highlight Genotypes by Color (onClick)") {
      if (clickedNode != null) {
        if (link.source.name == clickedNode.name) {
          if (link.gt == "HR") {
            return '#79DB52';
          } else if (link.gt == "HT") {
            return '#D6DB52';
          } else if (link.gt == "HA") {
            return '#DDA547';
          } else {
            return getDefaultLink(is3D);
          }
        }
      }
    } else if (highlightFormat == "Highlight Homozygous Reference (onClick)") {
      if (clickedNode != null) {
        if (link.source.name == clickedNode.name) {
          if (link.gt == "HR") {
            return '#79DB52';
          } else {
            return getDefaultLink(is3D);
          }
        }
      }
    } else if (highlightFormat == "Highlight Heterozygous (onClick)") {
      if (clickedNode != null) {
        if (link.source.name == clickedNode.name) {
          if (link.gt == "HT") {
            return '#D6DB52';
          } else {
            return getDefaultLink(is3D);
          }
        }
      }
    } else if (highlightFormat == "Highlight Homozygous Alternative (onClick)") {
      if (clickedNode != null) {
        if (link.source.name == clickedNode.name) {
          if (link.gt == "HA") {
            return '#DDA547';
          } else {
            return getDefaultLink(is3D);
          }
        }
      }
    }
  }

  const paintNodes = (node, ctx, globalScale) => {
    ctx.fillStyle = getSampleColor(node);
    if (node.type == "sample") {
      ctx.beginPath();
      ctx.arc(node.x, node.y - 2, 2, 8 / 12 * Math.PI, 4 / 12 * Math.PI);
      ctx.arc(node.x + 1, node.y + 1.732, 2, -1 / 2 * Math.PI, 0 * Math.PI);
      ctx.lineTo(node.x + 3, node.y + 2);
      ctx.lineTo(node.x - 3, node.y + 2);
      ctx.lineTo(node.x - 3, node.y + 1.732);
      ctx.arc(node.x - 1, node.y + 1.732, 2, 1 * Math.PI, -1 / 2 * Math.PI);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(node.x, node.y, getNodeSize(node), 0 * Math.PI, 2 * Math.PI);
      ctx.fill();
    }
  };

  function getNodeLabelHelper(names, conditions, significances) {
    var nameArray = names.split("&&nextvariant&&")
    var conditionArray = conditions.split("&&nextvariant&&")
    var significanceArray = significances.split("&&nextvariant&&")
    var html = ''
    for (let i = 0; i < nameArray.length; i++) {
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
    }
    return html
  }

  function constructSignificanceList(significances) {
    var significanceArray = significances.split("&&nextvariant&&")
    var html = ''
    for (let i = 0; i < significanceArray.length; i++) {
      if (significanceArray[i].startsWith("Pathogenic")) {
        html = html + '<br />(' + (i + 1) + ') <span class="text-red-600">' + significanceArray[i] + '</span>'
      } else {
        html = html + '<br />(' + (i + 1) + ') <span class="text-green-500">' + significanceArray[i] + '</span>'
      }
    }
    return html
  }

  const getNodeLabel = (node) => {
    const numCC = () => {
      return `
        <div>
          ${node.groupToNumSamples.map((item) => {
        <span>{item}</span>
      })}
        </div>
      `
    }

    if (node.type == "variant" && node.inClinvar) {
      return `<div className="text-[#2f2f2f] bg-white">
              <div>
                <strong>Clinvar information: </strong>
                <div>${node.groupToNumSamplesString}</div>
                ${getNodeLabelHelper(node.variantName, node.conditions, node.significance)}
                <div><strong>GRCh37 chromosome:</strong> ${node.chromosome}</div>
                <div><strong>GRCh37 location:</strong> ${node.name}</div>
                <div><strong>dbSNP ID:</strong> ${node.snpId}</div></div>`
    } else if (node.type == "variant" && !node.inClinvar) {
      return `<div className="text-[#2f2f2f] bg-white flex flex-col"><div>
              Variant position: ${node.name}</div>
              <div>Variant chromosome: ${node.chromosome}</div>
              <div>${node.groupToNumSamplesString}</div>
              <strong>Variant not found in Clinvar</strong> 
              </div>`
    } else {
      return `<div className="text-[#2f2f2f] bg-white">Sample: ${node.name}</div>`
    }
  }

  const getNodeTooltip = (node) => {
    if (node.type == "variant" && node.inClinvar) {
      return `<div className="text-[#2f2f2f] bg-white">
        <div>Variant position: ${node.name}</div>
        <div>Variant chromosome: ${node.chromosome}</div>
        <div>Clinical significance: ${constructSignificanceList(node.significance)}</div>
      </div>`
    } else if (node.type == "variant" && !node.inClinvar) {
      return `<div className="text-[#2f2f2f] bg-white">
        <div>Variant position: ${node.name}</div>
        <div>Variant chromosome: ${node.chromosome}</div>
        <strong>Variant not found in Clinvar</strong> 
      </div>`
    } else {
      return `<div className="text-[#2f2f2f] bg-white">Sample: ${node.name}</div>`
    }
  }

  const getNodeSize = (node) => {
    if (nodeSize == "UNIFORM") {
      return 3;
    } else {
      return Math.sqrt(node.size);
    }
  }

  const getNodeColor = (node) => {
    if (node.type == 'variant') {
      return variantColor;
    } else {
      if (sampleColors.length === 0) {
        return '#BABABA';
      } 
      else if (node.group != null) {
        return sampleColors[Number(node.group)];
      } else {
        return sampleColors[0];
      }
    }
  }

  const handleNodeClick = (node, event, setData) => {
    console.log("here?")

    if (clickedNode == node || node.type == "sample") {
      setClickedNode(null);
    } else {
      setClickedNode(node);
      console.log("Logging browser query term: ");
      console.log("Current object: ");
      console.log(currDataObj);
      console.log(currDataObj.graphInfo[1] + "-" + node.name)
      setBrowserQuery("region/" + currDataObj.graphInfo[1] + "-" + node.name);
      setData(getNodeLabel(node));
    }
  }

  useEffect(() => {
    console.log("In nodeview starting useeffect:");
    if (prevVals.current.selected != selected) {
      console.log("New selected:");
      setDataObj(undefined);
      setCurrView(undefined);
      setCurrDataObj(undefined);
      setNLData([]);
      setQueryList([]);
      handleFileChosen(selected);
      prevVals.current = { selected, refresh, isClicked }
    } else {
      if (selected !== null && selected !== undefined) {
        handleFileChosen(selected);
        // A file has been selected; process file and return for user queries.
        if (geneFileUpload != null && selected != null && toggleGS === true) {
          console.log("On refresh, searching gene FILE...");
          searchGeneFile();
        } else if (posFileUpload != null && toggleRS === true) {
          console.log("On refresh, searching pos FILE...");
          searchPosFile();
        } else if (searchGeneTerm != '' && searchGeneTerm != null && toggleGS === true) {
          console.log("On refresh, searching gene...");
          searchGene();
        } else if (searchRangeTerm != '' && searchRangeTerm != null && toggleRS === true) {
          console.log("On refresh, searching range...");
          searchRange();
        } 
      } 
    }

  }, [refresh, selected, isClicked])

  useEffect(() => {
    const fg = fgRef.current;
    if (fg != undefined) {
      fg.d3Force('charge').strength(-100);
    }
  })


  if (currView == undefined || ((searchGeneTerm == undefined) && (searchRangeTerm == undefined) && geneFileUpload == undefined && posFileUpload == undefined)) {
    return (
      <div className="flex w-full h-full bg-blue-300">
      </div>
    )
  }

  if (view2D === true) {
    return (

      <div className="flex">
                {processing && 
        <div className="absolute inset-0 bg-slate-200 bg-opacity-60 flex flex-col z-[70]">
          <div className="bg-slate-300 px-6 text-xs">Loading, please wait...</div>
        </div>
        }
        <ForceGraph2D
          ref={fgRef}
          linkDirectionalParticleColor={() => "red"}
          linkDirectionalParticleWidth={6}
          linkHoverPrecision={10}
          nodeId="name"
          graphData={currView}
          nodeColor={(node) => getNodeColor(node)}
          onNodeClick={(node, event) => handleNodeClick(node, event, setData)}
          linkColor={(link) => handleLinkColor(link, false)}
          nodeLabel={(node) => getNodeTooltip(node)}
          nodeCanvasObject={(node, ctx, globalScale) => paintNodes(node, ctx, globalScale)}
          onNodeDragEnd={node => {
            node.fx = node.x;
            node.fy = node.y;
            node.fz = node.z;
          }}
          width={`${activeMenu ? window.innerWidth - 430 : window.innerWidth - 48}`}
          height={window.innerHeight - 200}
        />
      </div>
    )
  }

  const getNodeTooltip3D = (node) => {
    if (node.type == "variant" && node.inClinvar) {
      return `<div style="color: white; background: #2f2f2f; padding: 5px; opacity: 0.7; border-radius: 3px; "> 
        <div>Variant position: ${node.name}</div>
        <div>Variant chromosome: ${node.chromosome}</div>
        <div>Clinical significance: ${constructSignificanceList(node.significance)}</div>
        </div>`
    } else if (node.type == "variant" && !node.inClinvar) {
      return `<div style="color: white; background: #2f2f2f; padding: 5px; opacity: 0.7; border-radius: 3px; "> 
      <div>Variant position: ${node.name}</div>
      <div>Variant chromosome: ${node.chromosome}</div>
        <strong>Variant not found in Clinvar</strong> 
      </div>`
    } else {
      return `<div style="color: white; background: #2f2f2f; padding: 5px; opacity: 0.7; border-radius: 3px; ">Sample: ${node.name}</div>`
    }
  }

  return (
    <div className="flex items-center ml-2">
        {processing && 
        <div className="absolute inset-0 bg-slate-200 bg-opacity-60 flex flex-col z-[70]">
          <div className="bg-slate-300 py-0.5 px-6 text-xs">Loading, please wait...</div>
        </div>
        }
      <ForceGraph3D
        ref={fgRef}
        linkDirectionalParticleColor={() => "red"}
        linkDirectionalParticleWidth={6}
        linkHoverPrecision={10}
        nodeId="name"
        graphData={currView}
        nodeColor={(node) => getNodeColor(node)}
        nodeResolution={16}
        onNodeClick={(node, event) => handleNodeClick(node, event, setData)}
        nodeLabel={(node) => getNodeTooltip3D(node)}
        nodeVal={(node) => getNodeSize(node)}
        nodeOpacity={1}
        linkColor={(link) => handleLinkColor(link, true)}
        backgroundColor="#f1f5f9"
        width={`${activeMenu ? window.innerWidth - 434 : window.innerWidth - 52}`}
        height={window.innerHeight - 200}
      />
    </div>
  )
}

export default NodeView


