import React, { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import vgc_final from './Images/vgc_final.png';
import welcome_logo from './Images/welcome_logo.png';

// const icon1 = require(`${__dirname}/Images/icon1.png`)
// const icon2 = require(`${__dirname}/Images/icon2.png`)
// const icon3 = require(`${__dirname}/Images/icon3.png`)
// const icon4 = require(`${__dirname}/Images/icon4.png`)

// const icon1 = `${process.env.PUBLIC_URL}/Images/icon1.png`
// const icon2 = `${process.env.PUBLIC_URL}/Images/icon2.png`
// const icon3 = `${process.env.PUBLIC_URL}/Images/icon3.png`
// const icon4 = `${process.env.PUBLIC_URL}/Images/icon4.png`
// import icon1 from `${process.env.PUBLIC_URL}/Images/icon1.png`
// import icon2 from `${process.env.PUBLIC_URL}/Images/icon2.png`
// import icon3 from `${process.env.PUBLIC_URL}/Images/icon3.png`
// import icon4 from `${process.env.PUBLIC_URL}/Images/icon4.png`

import icon1 from './Images/icon1.png';
import icon2 from './Images/icon2.png';
import icon3 from './Images/icon3.png';
import icon4 from './Images/icon4.png';
// import icon1 from '../.webpack/renderer/Images/icon1.png';
// import icon2 from '../.webpack/renderer/Images/icon2.png';
// import icon3 from '../.webpack/renderer/Images/icon3.png';
// import icon4 from '../.webpack/renderer/Images/icon4.png';

// import icon1 from `${__dirname}/Images/icon1.png`;
// import icon2 from `${__dirname}/Images/icon2.png`;
// import icon3 from `${__dirname}/Images/icon3.png`;
// import icon4 from `${__dirname}/Images/icon4.png`;
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
    // setPhenotypeList([...phenotypeList, file]);
    // setPhenotypePathList([...phenotypePathList, path]);
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
    // console.log('FILE SIZE = ' + exactSize);
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
            
            {/* <div className="flex flex-row mt-4">
              <button className="flex w-40 h-8 border-1 border-white rounded-lg text-white shadow-sm  hover:shadow-md justify-center items-center">
                About
              </button>
              <button className="flex w-40 h-8 border-1 border-white rounded-lg text-white shadow-sm  hover:shadow-md justify-center items-center ml-24">
                Documentation
              </button>
              <button className="flex w-40 h-8 border-1 border-white rounded-lg text-white shadow-sm  hover:shadow-md justify-center items-center ml-24">
                Tutorial
              </button>
            </div> */}

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
{/*
            <div className="flex flex-col justify-center items-center mt-4 font-light w-full px-40 py-4">
              <div className="flex p-2 justify-center">Select a VCF file to get started:</div>

               <div className="flex h-60 w-full flex-col border-1 border-[#3f89c7] p-2">
                <label className="flex flex-col">
                  <div className="hidden">
                    <input
                      type="file"
                      id="myfile"
                      onChange={e => {
                        handleVCFSelection(e.target.files[0], e.target.files[0].path);
                      }}
                      name="myfile"
                      accept=".vcf"
                      multiple />
                  </div>
                  <div className="flex p-2 h-8 w-20 bg-[#3f89c7] items-center justify-center text-white cursor-pointer ">
                    Browse
                  </div>
                  <div className="flex w-full h-[1px] bg-[#343434] mt-2"></div>
                </label>

                <div className="flex flex-col w-full overflow-auto">
                  {fileList.map((item) => (
                    <div className="flex flex-row pb-8 pt-2 px-2 border-b-1 border-slate-300">
                      <div className="flex flex-grow flex-col overflow-x-clip">
                        <text className="text-lg">{item.name}</text>
                        <text className="text-sm">{getFileSize(item.size)}</text>
                        <PhenotypeSelector matchToVCF={item}/>
                      </div>
                      <div className="flex p-2 w-10 h-10 text-black text-xl hover:bg-slate-100 rounded-full justify-center items-center">
                        <AiOutlineClose />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div> */}


            {/* <div className="flex flex-row mt-4 ">
              <div className={`flex  ${activeGenomeSelect ? "h-6" : "h-[6.9rem]"}`}>
                Human Assembly:
              </div>
              <div className="flex-col">
                <button
                  type="button"
                  className={`flex p-1 ml-2 w-60 text-sm justify-center items-center rounded-sm border-1`}
                  onClick={() => {
                    setActiveGenomeSelect(!activeGenomeSelect)
                  }}>
                  {genome}
                </button>

                <div className={`${activeGenomeSelect ? "" : "hidden"} flex justify-center  w-60  rounded-sm shadow ml-2`}>
                  <ul class="text-sm text-gray-700 dark:text-gray-200 divide-y">
                    <li className={`w-60 h-6 flex justify-center items-center cursor-pointer ${genome == "Feb. 2009 (GRCh37/hg19)" ? "hover:bg-slate-200 bg-slate-200" : "bg-white hover:bg-slate-100"}  py-1`}
                      onClick={() => { setActiveGenomeSelect(false); setGenome("Feb. 2009 (GRCh37/hg19)") }}>
                      Feb. 2009 (GRCh37/hg19)
                    </li>
                    <li className={`w-60 h-6 flex justify-center items-center cursor-pointer ${genome == "Dec. 2013 (GRCh38/hg38)" ? "hover:bg-slate-200 bg-slate-200" : "bg-white hover:bg-slate-100"} py-1`}
                      onClick={() => { setActiveGenomeSelect(false); setGenome("Dec. 2013 (GRCh38/hg38)") }}>
                      Dec. 2013 (GRCh38/hg38)
                    </li>
                  </ul>
                </div>
              </div>

            </div> */}


            {/* <button
              className={` ${activeGenomeSelect ? "mt-6" : "mt-12"} flex w-40 h-8 bg-[#3f89c7]  justify-center items-center mt-20 text-white mb-12 cursor-pointer hover:bg-[#4f97d1]`}
              onClick={() => {

              }}>
              Submit
            </button> */}
          </div>


        </div>
      </div>

    </div>
  )
}

export default Welcome

// <div className="flex p-2 justify-center mt-2">Select a phenotype file to compare CASE/CONTROL samples:</div>

// <div className="flex flex-col h-60 w-full border-1 border-[#3f89c7] p-2">
//   <label className="flex flex-col">
//     <div className="hidden">
//       <input
//         type="file"
//         id="myfile"
//         onChange={e => {
//           handlePhenotypeSelection(e.target.files[0], e.target.files[0].path);
//         }}
//         name="myfile"
//         accept=".txt"
//         multiple />
//     </div>
//     <div className="flex p-2 h-8 w-20 bg-[#3f89c7] items-center text-white cursor-pointer justify-center">
//       Browse
//     </div>
//     <div className="flex w-full h-[1px] bg-[#343434] mt-2"></div>
//   </label>

//   <div className="flex flex-col w-full overflow-auto ">
//     {phenotypeList.map((item) => (
//       <div className="flex flex-row pb-8 pt-2 px-2 border-b-1">
//         <div className="flex flex-grow flex-col  border-slate-300 overflow-x-clip">
//           <text className="text-lg">{item.name}</text>
//           <text className="text-sm">{getFileSize(item.size)}</text>
//         </div>
//         <div className="flex p-2 w-10 h-10 text-xl hover:bg-slate-100 rounded-full justify-center items-center">
//           <AiOutlineClose />
//         </div>
//       </div>
//     ))}
//   </div>