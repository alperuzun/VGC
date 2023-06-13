import React, { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import vgc_final from './Images/vgc_final.png';
import welcome_logo from './Images/welcome_logo.png';
import legorreta_cancer_center_logo from './Images/legorreta_cancer_center_logo.png';

import icon1 from './Images/icon1.png';
import icon2 from './Images/icon2.png';
import icon3 from './Images/icon3.png';
import icon4 from './Images/icon4.png';
import logo_no_border from './Images/logo_no_border.png';


import { useStateContext } from '../contexts/ContextProvider';
import { useDisplayContext } from '../contexts/DisplayContext';
import { SimplePane } from './Panes';
import "../css/DragDrop.css";
import { AiOutlineClose } from 'react-icons/ai';


const Welcome = () => {

  const navigate = useNavigate();
  const { activeMenu, selected} = useStateContext();
  const {handleClick} = useDisplayContext();
  const [activeGenomeSelect, setActiveGenomeSelect] = useState(false);
  const [genome, setGenome] = useState("Feb. 2009 (GRCh37/hg19)");
  const [fileList, setFileList] = useState([]);
  const [pathList, setPathList] = useState([]);
  const [phenotypeList, setPhenotypeList] = useState([]);
  const [phenotypePathList, setPhenotypePathList] = useState([]);


  const handleVCFSelection = (file, path) => {
    setFileList([...fileList, file]);
    setPathList([...pathList, path]);
    console.log("In handle selection!");
    console.log(file);
    console.log(path);
    console.log(fileList);
    console.log(pathList);
  }

  const handlePhenotypeSelection = (file, path, matchToVCF) => {
    const updatedList = phenotypeList;
    updatedList[pathList.indexOf(matchToVCF)] = file;

    const updatedPathList = phenotypePathList;
    updatedPathList[phenotypePathList.indexOf(matchToVCF.path)] = path;

    setPhenotypeList(updatedList);
    setPhenotypePathList(updatedPathList);
    console.log("In handle selection!");
    console.log(file);
    console.log(path);
    console.log(phenotypeList);
    console.log(phenotypePathList);
  }

  const getFileSize = (size) => {
    var fSExt = new Array('Bytes', 'KB', 'MB', 'GB');
    var i = 0;

    while (size > 900) {
      size /= 1024;
      i++;
    }
    var exactSize = (Math.round(size * 100) / 100) + ' ' + fSExt[i];
    return 'File Size: ' + exactSize;
  }

  const PhenotypeSelector = (matchToVCF) => {
    return (
      <div className="flex w-full ">
        <label className="flex flex-col">
          <div className="hidden">
            <input
              type="file"
              id="myfile"
              onChange={e => {
                handlePhenotypeSelection(e.target.files[0], e.target.files[0].path, matchToVCF);
                console.log("Phenotype file being selected! Match to VCF is:");
                console.log(matchToVCF);
              }}
              name="myfile"
              accept=".txt"
              multiple />
          </div>
          <div className="flex p-2 h-6 w-60 bg-[#ffffff] items-center text-slate-500 border-1 border-slate-600 cursor-pointer justify-center">
            Add Phenotype File
          </div>
        </label>
      </div>
    )
  }

  useEffect(() => {
    console.log("here");
    if (selected != undefined) {
      handleClick('barGraph');
      navigate("/bar_graph");

    }

  }, [selected])


  return (
    <div className="flex h-full overflow-y-scroll z-50 bg-[#457b9d]">
      <div className="p-2 ">
        <div className={`flex ${activeMenu ? 'xl:w-[64rem] lg:w-[52rem] md:w-[46rem] sm:w-[36rem] ' : 'xl:w-[88rem] lg:w-[76rem] md:w-[72rem] sm:w-[60rem] w-[40rem]'}`}>
          <div className="flex w-full p-12 justify-center items-center flex-col">
            <div className="flex rounded-2xl">
              <img className="" src={welcome_logo}></img>
            </div>

            <div className="flex flex-row w-full mt-16 justify-evenly text-white text-sm">
              <div className="flex flex-col justify-center items-center w-1/4 ">
              <img className="w-12 h-12" src={icon1}></img>
                <div className="text-center px-3 py-6 "> Rapid VCF file browsing with Histogram, Grid View, and Node Graph support</div>
              </div>
              <div className="flex flex-col justify-center items-center w-1/4">
              <img className="w-12 h-12" src={icon2}></img> 
                <div className="text-center px-3 py-6">Rapid identification and visualization of variant pathogenicity</div>
              </div>
              <div className="flex flex-col justify-center items-center w-1/4">
              <img className="w-12 h-12" src={icon3}></img>
                <div className="text-center px-3 py-6">Integrated variant querying through Gnomad, MSigDB, and Clinvar databases</div>
              </div>
              <div className="flex flex-col justify-center items-center w-1/4">
              <img className="w-12 h-12" src={icon4}></img>
                <div className="text-center px-3 py-6">Display variant-to-sample genotype relations of user-defined groups</div>
              </div>

            </div>
            <div className="flex flex-row items-center justify-evenly">
              <div className="w-56 h-0.5 bg-[#000000] mx-10 mt-2"></div>
              <img className="mt-2 w-48 h-16" src={legorreta_cancer_center_logo}></img>
              <div className="w-56 h-0.5 bg-[#000000] mx-10 mt-2"></div>
            </div>
          </div>


        </div>
      </div>

    </div>
  )
}

export default Welcome
