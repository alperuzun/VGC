
import React, { useEffect, useState, NavLink } from 'react'
import { useNavigate } from 'react-router-dom'
import legorreta_cancer_center_logo from './Images/legorreta_cancer_center_logo.png';
import { AiOutlineFileAdd } from 'react-icons/ai';
import { AiFillFileUnknown } from 'react-icons/ai';
import warren_alpert_medical_school_logo from './Images/warren_alpert_medical_school_logo.png'
import department_pathology_logo from './Images/department_pathology_logo.png'

import logo_final from './Images/logo_final.png';

import icon1 from './Images/icon1.png';
import icon2 from './Images/icon2.png';
import icon3 from './Images/icon3.png';
import icon4 from './Images/icon4.png';

import jennifer_li_email from './Images/jennifer_li_email.png';
import alper_uzun_email from './Images/alper_uzun_email.png';

import { useStateContext } from '../contexts/ContextProvider';
import { useDisplayContext } from '../contexts/DisplayContext';


const Welcome = () => {

  const navigate = useNavigate();
  const { activeMenu, selected, setSelected, handleNewPath, refresh, setRefresh, setSearchGeneTerm, setSearchRangeTerm } = useStateContext();
  const { handleClick } = useDisplayContext();
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
    <div className="flex h-full w-full">
      <div className="flex grow px-2 py-1.5 ">
        <div className={`flex  flex-col w-full h-full bg-slate-100 drop-shadow-md`}>

          <div className="flex w-full px-6 justify-center items-center flex-col">
            {/* Topmost row */}
            <div className="flex flex-row w-full mt-3">
              {/* <div className="flex w-3/5 justify-center items-center">
                <img src={logo_final}></img>
              </div> */}
              {/* Visualization */}
              <div className="flex w-full flex-col gap-2 justify-center items-center ">
                <div className="flex flex-row items-center justify-center w-full gap-4">
                  <div className="flex-grow w-full h-[1.5px] bg-slate-700"></div>
                  <text className="text-lg font-extralight text-slate-700 whitespace-nowrap">Getting Started</text>
                  <div className="flex-grow w-full h-[1.5px] bg-slate-700"></div>
                </div>

                <div className="flex flex-row w-full gap-2 px-2">
                  <div className="flex flex-col w-full gap-2">
                    <label className="flex w-full justify-center items-center rounded-lg cursor-pointer border-1 border-[#3f89c7] hover:bg-slate-200 transition-colors duration-500 text-slate-700">
                      <div className="hidden">
                        <input
                          type="file"
                          id="myfile"
                          onChange={e => {
                            handleNewPath(e.target.files[0]);
                            setSelected(e.target.files[0].path);
                            setSearchGeneTerm("");
                            setSearchRangeTerm("");
                            e.target.value = ''
                          }}
                          name="myfile"
                          accept=".vcf"
                          multiple />
                      </div>
                      <div className="flex p-1 gap-3 w-full h-24 justify-center items-center flex-row">
                        <AiOutlineFileAdd className="w-16 h-full text-[#3f89c7]" />
                        <text className="flex text-slate-700">Upload VCF File</text>
                      </div>
                    </label>
                    <div className="flex flex-row w-full gap-2">
                      <div
                        className="flex p-1 w-1/2 text-sm justify-center text-no-wrap rounded-lg cursor-pointer border-1 border-[#3f89c7] hover:bg-slate-200 transition-colors duration-500 text-slate-700"
                        onClick={() => {
                          const newWindow = window.open('https://github.com/alperuzun/VGC', '_blank');
                          newWindow.opener = null;
                        }}
                      >
                        Small Example
                      </div>
                      <div
                        className="flex p-1 w-1/2 text-sm justify-center text-no-wrap rounded-lg cursor-pointer border-1 border-[#3f89c7] hover:bg-slate-200 transition-colors duration-500 text-slate-700"
                        onClick={() => {
                          const newWindow = window.open('https://github.com/alperuzun/VGC', '_blank');
                          newWindow.opener = null;
                        }}
                      >
                        Large Example
                      </div>
                    </div>
                  </div>

                  <div
                    className="flex p-1 w-1/3 h-[8.5rem] text-sm justify-center items-center text-center flex-col rounded-lg cursor-pointer border-1 border-[#3f89c7] hover:bg-slate-200 transition-colors duration-500"
                    onClick={() => {
                      const newWindow = window.open('https://github.com/alperuzun/VGC', '_blank');
                      newWindow.opener = null;
                    }}
                  >
                    <AiFillFileUnknown className="flex w-16 h-full text-[#3f89c7]" />
                    <text className="flex text-sm text-slate-700 ">View Documentation</text>
                  </div>
                </div>
              </div>
              {/* </div> */}
            </div>

            <div className="flex flex-row items-center justify-center w-full gap-4 mt-2">
              <div className="flex-grow w-full h-[1.5px] bg-slate-700"></div>
              <text className="text-lg font-extralight text-slate-700">Features</text>
              <div className="flex-grow w-full h-[1.5px] bg-slate-700"></div>
            </div>
            <div className={`flex flex-row w-full mt-2 justify-evenly gap-2 text-slate-700 text-sm `}>
              <div className="flex flex-col items-center w-1/4 border-1 border-slate-300 rounded-md ">
                <img className="w-12 h-12 mt-4" src={icon1}></img>
                <div className={`text-center ${activeMenu ? "md:px-3 md:py-6 px-0.5 py-0.5" : "sm:px-3 sm:py-6 px-0.5 py-0.5"} `}> Rapid VCF file browsing with Histogram, Grid View, and Node Graph support</div>
              </div>
              <div className="flex flex-col items-center w-1/4 border-1 border-slate-300 rounded-md ">
                <img className="w-12 h-12 mt-4" src={icon2}></img>
                <div className={`text-center ${activeMenu ? "md:px-3 md:py-6 px-0.5 py-0.5" : "sm:px-3 sm:py-6 px-0.5 py-0.5"} `}>Rapid identification and visualization of variant pathogenicity</div>
              </div>
              <div className="flex flex-col items-center w-1/4 border-1 border-slate-300 rounded-md ">
                <img className="w-12 h-12 mt-4" src={icon3}></img>
                <div className={`text-center ${activeMenu ? "md:px-3 md:py-6 px-0.5 py-0.5" : "sm:px-3 sm:py-6 px-0.5 py-0.5"} `}>Integrated variant querying through Gnomad, MSigDB, and Clinvar databases</div>
              </div>
              <div className="flex flex-col items-center w-1/4 border-1 border-slate-300 rounded-md">
                <img className="w-12 h-12 mt-4" src={icon4}></img>
                <div className={`text-center ${activeMenu ? "md:px-3 md:py-6 px-0.5 py-0.5" : "sm:px-3 sm:py-6 px-0.5 py-0.5"} `}>Displays variant-to-sample genotype relations of user-defined groups</div>
              </div>
            </div>

            <div className="flex flex-row items-center justify-center w-full gap-4 mt-2">
              <div className="flex-grow w-full h-[1.5px] bg-slate-700"></div>
              <text className="text-slate-700 font-extralight text-lg">Acknowledgements</text>
              <div className="flex-grow w-full h-[1.5px] bg-slate-700"></div>
            </div>

            <div className="flex flex-row items-center justify-center w-full gap-2 mt-2">
              <div className="flex items-center justify-center w-1/3 border-1 border-slate-300 rounded-md hover:border-slate-700">
                <img className="flex m-2 h-16" src={department_pathology_logo}></img>
              </div>
              <div className="flex items-center justify-center w-1/3 border-1 border-slate-300 rounded-md hover:border-slate-700">
                <img className="flex my-3 mx-4 h-14 " src={legorreta_cancer_center_logo}></img>
              </div>
              <div className="flex items-center justify-center w-1/3 border-1 border-slate-300 rounded-md hover:border-slate-700">
                <img className="flex my-2 mx-3 h-16" src={warren_alpert_medical_school_logo}></img>
              </div>
            </div>

            <div className="flex flex-col w-full">
                <div className="flex flex-row items-center justify-center w-full gap-4">
                  <div className="flex-grow w-full h-[1.5px] bg-slate-700"></div>
                  <text className="text-lg font-extralight text-slate-700">Contact</text>
                  <div className="flex-grow w-full h-[1.5px] bg-slate-700"></div>
                </div>
                <div className="flex flex-row w-full justify-evenly gap-2 mt-2">
                  <div className="flex flex-col w-full h-[4rem] border-1 border-slate-300 rounded-lg justify-center items-center">
                    <text>Alper Uzun, PhD</text>
                    <img src={alper_uzun_email} className="h-auto w-auto max-w-[170px] " />
                  </div>
                  <div className="flex flex-col w-full h-[4rem] border-1 border-slate-300 rounded-lg justify-center items-center">
                    <text>Jennifer Li </text>
                    <img src={jennifer_li_email} className="h-auto w-auto max-w-[170px] " />
                  </div>
                </div>
              </div>

          </div>


        </div>
      </div>

    </div>
  )
}

export default Welcome


// import React, { useEffect, useState, NavLink } from 'react'
// import { useNavigate } from 'react-router-dom'
// import legorreta_cancer_center_logo from './Images/legorreta_cancer_center_logo.png';
// import { AiOutlineFileAdd } from 'react-icons/ai';
// import { AiFillFileUnknown } from 'react-icons/ai';
// import warren_alpert_medical_school_logo from './Images/warren_alpert_medical_school_logo.png'
// import department_pathology_logo from './Images/department_pathology_logo.png'

// import icon1 from './Images/icon1.png';
// import icon2 from './Images/icon2.png';
// import icon3 from './Images/icon3.png';
// import icon4 from './Images/icon4.png';

// import jennifer_li_email from './Images/jennifer_li_email.png';
// import alper_uzun_email from './Images/alper_uzun_email.png';

// import { useStateContext } from '../contexts/ContextProvider';
// import { useDisplayContext } from '../contexts/DisplayContext';


// const Welcome = () => {

//   const navigate = useNavigate();
//   const { activeMenu, selected, setSelected, handleNewPath, refresh, setRefresh, setSearchGeneTerm, setSearchRangeTerm } = useStateContext();
//   const { handleClick } = useDisplayContext();
//   const [activeGenomeSelect, setActiveGenomeSelect] = useState(false);
//   const [genome, setGenome] = useState("Feb. 2009 (GRCh37/hg19)");
//   const [fileList, setFileList] = useState([]);
//   const [pathList, setPathList] = useState([]);
//   const [phenotypeList, setPhenotypeList] = useState([]);
//   const [phenotypePathList, setPhenotypePathList] = useState([]);


//   const handleVCFSelection = (file, path) => {
//     setFileList([...fileList, file]);
//     setPathList([...pathList, path]);
//     console.log("In handle selection!");
//     console.log(file);
//     console.log(path);
//     console.log(fileList);
//     console.log(pathList);
//   }

//   const handlePhenotypeSelection = (file, path, matchToVCF) => {
//     const updatedList = phenotypeList;
//     updatedList[pathList.indexOf(matchToVCF)] = file;

//     const updatedPathList = phenotypePathList;
//     updatedPathList[phenotypePathList.indexOf(matchToVCF.path)] = path;

//     setPhenotypeList(updatedList);
//     setPhenotypePathList(updatedPathList);
//     console.log("In handle selection!");
//     console.log(file);
//     console.log(path);
//     console.log(phenotypeList);
//     console.log(phenotypePathList);
//   }

//   const getFileSize = (size) => {
//     var fSExt = new Array('Bytes', 'KB', 'MB', 'GB');
//     var i = 0;

//     while (size > 900) {
//       size /= 1024;
//       i++;
//     }
//     var exactSize = (Math.round(size * 100) / 100) + ' ' + fSExt[i];
//     return 'File Size: ' + exactSize;
//   }

//   const PhenotypeSelector = (matchToVCF) => {
//     return (
//       <div className="flex w-full ">
//         <label className="flex flex-col">
//           <div className="hidden">
//             <input
//               type="file"
//               id="myfile"
//               onChange={e => {
//                 handlePhenotypeSelection(e.target.files[0], e.target.files[0].path, matchToVCF);
//                 console.log("Phenotype file being selected! Match to VCF is:");
//                 console.log(matchToVCF);
//               }}
//               name="myfile"
//               accept=".txt"
//               multiple />
//           </div>
//           <div className="flex p-2 h-6 w-60 bg-[#ffffff] items-center text-slate-500 border-1 border-slate-600 cursor-pointer justify-center">
//             Add Phenotype File
//           </div>
//         </label>
//       </div>
//     )
//   }

//   useEffect(() => {
//     console.log("here");
//     if (selected != undefined) {
//       handleClick('barGraph');
//       navigate("/bar_graph");

//     }

//   }, [selected])


//   return (
//     <div className="flex h-full w-full">
//       <div className="flex grow px-2 py-1.5 ">
//         <div className={`flex  flex-col w-full h-full bg-slate-100 drop-shadow-md`}>

//           <div className="flex w-full p-6 justify-center items-center flex-col">
//             {/* Topmost row */}
//             <div className="flex flex-row w-full gap-4">
//               {/* Visualization */}
//               <div className="flex w-2/3 flex-col gap-3 justify-center items-center ">
//                 <div className="flex flex-row items-center justify-center w-full gap-4">
//                   <div className="flex-grow w-full h-[1.5px] bg-slate-700"></div>
//                   <text className="text-lg font-extralight text-slate-700 whitespace-nowrap">Getting Started</text>
//                   <div className="flex-grow w-full h-[1.5px] bg-slate-700"></div>
//                 </div>

//                 <div className="flex flex-row w-full gap-2 px-2">
//                   <div className="flex flex-col w-full gap-2">
//                     <label className="flex w-full justify-center items-center rounded-lg cursor-pointer border-1 border-[#3f89c7] hover:bg-slate-200 transition-colors duration-500 text-slate-700">
//                       <div className="hidden">
//                         <input
//                           type="file"
//                           id="myfile"
//                           onChange={e => {
//                             handleNewPath(e.target.files[0]);
//                             setSelected(e.target.files[0].path);
//                             setSearchGeneTerm("");
//                             setSearchRangeTerm("");
//                             e.target.value = ''
//                           }}
//                           name="myfile"
//                           accept=".vcf"
//                           multiple />
//                       </div>
//                       <div className="flex p-1 gap-3 w-full h-24 justify-center items-center flex-row">
//                         <AiOutlineFileAdd className="w-16 h-full text-[#3f89c7]"/>
//                         <text className="flex text-slate-700">Upload VCF File</text>
//                       </div>
//                     </label>
//                     <div className="flex flex-row w-full gap-2">
//                       <div
//                       className="flex p-1 w-1/2 text-sm justify-center text-no-wrap rounded-lg cursor-pointer border-1 border-[#3f89c7] hover:bg-slate-200 transition-colors duration-500 text-slate-700"
//                       onClick={() => {
//                         const newWindow = window.open('https://github.com/alperuzun/VGC', '_blank');
//                         newWindow.opener = null; 
//                       }}
//                     >
//                       Small Example
//                     </div>
//                     <div
//                     className="flex p-1 w-1/2 text-sm justify-center text-no-wrap rounded-lg cursor-pointer border-1 border-[#3f89c7] hover:bg-slate-200 transition-colors duration-500 text-slate-700"
//                     onClick={() => {
//                       const newWindow = window.open('https://github.com/alperuzun/VGC', '_blank');
//                       newWindow.opener = null; 
//                     }}
//                     >
//                       Large Example
//                     </div>
//                     </div>
//                   </div>

//                   <div
//                     className="flex p-1 w-1/3 h-[8.5rem] text-sm justify-center items-center text-center flex-col rounded-lg cursor-pointer border-1 border-[#3f89c7] hover:bg-slate-200 transition-colors duration-500"
//                     onClick={() => {
//                       const newWindow = window.open('https://github.com/alperuzun/VGC', '_blank');
//                       newWindow.opener = null; 
//                     }}
//                   >
//                     <AiFillFileUnknown className="flex w-16 h-full text-[#3f89c7]"/>
//                     <text className="flex text-sm text-slate-700 ">View Documentation</text>
//                   </div>
//                 </div>
//               </div>
//               {/* </div> */}
//               {/* Contact */}
//               <div className="flex flex-col w-1/3">
//                 <div className="flex flex-row items-center justify-center w-full gap-4">
//                   <div className="flex-grow w-full h-[1.5px] bg-slate-700"></div>
//                   <text className="text-lg font-extralight text-slate-700">Contact</text>
//                   <div className="flex-grow w-full h-[1.5px] bg-slate-700"></div>
//                 </div>
//                 <div className="flex flex-col w-full h-[4rem] border-1 border-slate-300 rounded-lg mt-3 justify-center items-center">
//                   <text>Alper Uzun, PhD</text>
//                   <img src={alper_uzun_email} className="h-auto w-auto max-w-[170px] "/>
//                 </div>
//                 <div className="flex flex-col w-full h-[4rem] border-1 border-slate-300 rounded-lg mt-2 justify-center items-center">
//                   <text>Jennifer Li </text>
//                   <img src={jennifer_li_email} className="h-auto w-auto max-w-[170px] "/>
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-row items-center justify-center w-full gap-4 mt-6">
//               <div className="flex-grow w-full h-[1.5px] bg-slate-700"></div>
//               <text className="text-lg font-extralight text-slate-700">Features</text>
//               <div className="flex-grow w-full h-[1.5px] bg-slate-700"></div>
//             </div>
// {/* ${activeMenu ? 'lg:text-[15px] md:text-[13.5px] sm:text-[11px]' : ''} */}
//             <div className={`flex flex-row w-full mt-4 justify-evenly gap-2 text-slate-700 text-sm `}>
//               <div className="flex flex-col items-center w-1/4 border-1 border-slate-300 rounded-md ">
//                 <img className="w-12 h-12 mt-4" src={icon1}></img>
//                 <div className={`text-center ${activeMenu? "md:px-3 md:py-6 px-0.5 py-0.5" : "sm:px-3 sm:py-6 px-0.5 py-0.5"} `}> Rapid VCF file browsing with Histogram, Grid View, and Node Graph support</div>
//               </div>
//               <div className="flex flex-col items-center w-1/4 border-1 border-slate-300 rounded-md ">
//                 <img className="w-12 h-12 mt-4" src={icon2}></img>
//                 <div className={`text-center ${activeMenu? "md:px-3 md:py-6 px-0.5 py-0.5" : "sm:px-3 sm:py-6 px-0.5 py-0.5"} `}>Rapid identification and visualization of variant pathogenicity</div>
//               </div>
//               <div className="flex flex-col items-center w-1/4 border-1 border-slate-300 rounded-md ">
//                 <img className="w-12 h-12 mt-4" src={icon3}></img>
//                 <div className={`text-center ${activeMenu? "md:px-3 md:py-6 px-0.5 py-0.5" : "sm:px-3 sm:py-6 px-0.5 py-0.5"} `}>Integrated variant querying through Gnomad, MSigDB, and Clinvar databases</div>
//               </div>
//               <div className="flex flex-col items-center w-1/4 border-1 border-slate-300 rounded-md">
//                 <img className="w-12 h-12 mt-4" src={icon4}></img>
//                 <div className={`text-center ${activeMenu? "md:px-3 md:py-6 px-0.5 py-0.5" : "sm:px-3 sm:py-6 px-0.5 py-0.5"} `}>Displays variant-to-sample genotype relations of user-defined groups</div>
//               </div>
//             </div>

//             <div className="flex flex-row items-center justify-center w-full gap-4 mt-4">
//               <div className="flex-grow w-full h-[1.5px] bg-slate-700"></div>
//               <text className="text-slate-700 font-extralight text-lg">Acknowledgements</text>
//               <div className="flex-grow w-full h-[1.5px] bg-slate-700"></div>
//             </div>

//             <div className="flex flex-row items-center justify-center w-full gap-2 mt-4">
//               <div className="flex items-center justify-center w-1/3 border-1 border-slate-300 rounded-md hover:border-slate-700">
//                 <img className="flex m-2 h-16" src={department_pathology_logo}></img>
//               </div>
//               <div className="flex items-center justify-center w-1/3 border-1 border-slate-300 rounded-md hover:border-slate-700">
//                 <img className="flex my-3 mx-4 h-14 " src={legorreta_cancer_center_logo}></img>
//               </div>
//               <div className="flex items-center justify-center w-1/3 border-1 border-slate-300 rounded-md hover:border-slate-700">
//                 <img className="flex my-2 mx-3 h-16" src={warren_alpert_medical_school_logo}></img>
//               </div>
//             </div>

//           </div>


//         </div>
//       </div>

//     </div>
//   )
// }

// export default Welcome

