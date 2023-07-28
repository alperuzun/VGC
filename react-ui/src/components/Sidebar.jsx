import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { link, useNavigate, NavLink } from 'react-router-dom';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { SiMicrogenetics } from 'react-icons/si';
import { BsArrowCounterclockwise, BsPencilFill } from 'react-icons/bs';
import { AiFillPropertySafety, AiOutlinePlus } from 'react-icons/ai';
import { BsChevronDown, BsChevronRight } from 'react-icons/bs';
import { useStateContext } from '../contexts/ContextProvider';
import  FileDeleter  from './FileDeleter'
import  UploadElement  from './UploadElement'

import FileService from '../services/FileService';
import { useDisplayContext } from '../contexts/DisplayContext';
import vgc_final from './Images/vgc_final.png';
import lines from './Images/lines.png';


const Sidebar = () => {

  const { selected, setSelected, activeMenu, setActiveMenu, screenSize, setScreenSize, pathList, setPathList, phenotypeList, setPhenotypeList, sizeList, setSizeList, handleNewPath, refresh, setRefresh, setSearchGeneTerm, setSearchRangeTerm } = useStateContext();


  const { browserQuery, setBrowserQuery, isClicked, setIsClicked, initialState, omimLink, setOmimLink, msigdbLink, setMsigdbLink } = useDisplayContext();

  const [uploadsHidden, setUploadsHidden] = useState(false);
  const [browserHidden, setBrowserHidden] = useState(false);
  const [analysisHidden, setAnalysisHidden] = useState(false);
  const [browserData, setBrowserData] = useState(undefined);
  const [fileDeleterToggle, setFileDeleterToggle] = useState(false)
  const [ready, setReady] = useState(false)

  const handleBrowserQuery = async () => {
    console.log("Calling handleBrowserQuery with: ")
    const retrievedData = await axios.get("https://gnomad.broadinstitute.org/");
    setBrowserData(retrievedData);
  }

  const handleCloseSideBar = () => {
    if (activeMenu && screenSize <= 700) {
      setActiveMenu(false)
    }
  }

  function handleEditToggle(cb) {
    console.log("editToggle clicked, new value = " + cb.checked);
    editToggle = !editToggle
  }

  function awaitStartUp() {
    return FileService.ready().then((response) => {
      if (!response) {
        return awaitStartUp();
      } else {
        setReady(true);
        return;
      }
    })
  }

  useEffect(() => {
    awaitStartUp();
    
    FileService.getFiles().then(items => {
      const pathArray = []
      const phenotypeArray = []
      const sizeArray = []
      // for (let i = 0; i < items.data.length; i++) {
      //   pathArray[i] = items.data[i].path
      //   phenotypeArray[i] = items.data[i].phenotypePath
      //   sizeArray[i] = items.data[i].size;
      // }
      setPathList(pathArray)
      setPhenotypeList(phenotypeArray);
      setSizeList(sizeArray);
      // console.log(items.data);
      // console.log(sizeArray);
      // console.log("All VCF Paths: ");
      // console.log(pathArray)
      // console.log("All Phenotype Paths: ");
      // console.log(phenotypeArray);
      // console.log("Items: ");
      // console.log(items);
    });
  }, []);

  if(!ready) {
    return (
    <div className={`${activeMenu ? '' : 'hidden'} p-2 h-full `}>
      <div className="flex justify-between w-full items-center px-1">
        <NavLink className="flex w-full justify-center items-center text-xl p-2"
          to="/home" onClick={() => { 
            setSelected(undefined); 
            setIsClicked(initialState);
            setSearchGeneTerm('');
            setSearchRangeTerm(''); }}>
          <div className="flex h-0.5 w-10 bg-black"></div>
          <div className="px-4">VariantGraphCraft</div>
          <div className="flex h-0.5 w-10 bg-black"></div>
        </NavLink>
      </div>
      Preparing backend to receive files...
    </div>
    )
  }

  return (
    <div className={`${activeMenu ? '' : 'hidden'} p-2 h-full `}>
      <div className="flex justify-between w-full items-center px-1">
        <NavLink className="flex w-full justify-center items-center text-xl p-2"
          to="/home" onClick={() => { 
            setSelected(undefined); 
            setIsClicked(initialState);
            setSearchGeneTerm('');
            setSearchRangeTerm(''); }}>
          <div className="flex h-0.5 w-10 bg-black"></div>
          <div className="px-4">VariantGraphCraft</div>
          <div className="flex h-0.5 w-10 bg-black"></div>
        </NavLink>
      </div>

      {/* Uploads Divider */}
      <div className="flex ml-2 mt-5 gap-3 items-center text-sm">
        <div className="flex-none hover:text-slate-400" onClick={() => setUploadsHidden(!uploadsHidden)}>
          <button>
            {uploadsHidden ? (<BsChevronRight />) : (<BsChevronDown />)}
          </button>
        </div>
        <span className="flex grow ">Uploads</span>
        <div className="flex-none">
        </div>
        <div className="flex-none">
          <FileDeleter fileDeleterToggle={fileDeleterToggle} setFileDeleterToggle={(bool) => setFileDeleterToggle(bool)} />
        </div>
        <div className="flex-none">
          <div className="flex flex-row">
            <label>
              <TooltipComponent content="Upload VCF" openDelay={1000} showTipPointer={false} offsetY={6} position="TopRight">
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
                <div className="flex mr-2 rounded-full p-1 hover:bg-slate-100 z-1 cursor-pointer">
                  <AiOutlinePlus />
                </div>
              </TooltipComponent>
            </label>
          </div >
        </div>
      </div>

      {/* Each upload object is maped to an UploadElement, with item.name as title. */}
      {!uploadsHidden &&
        <div>
          {pathList.map((item) => (
            <div className="flex flex-col w-full pt-1">
              <UploadElement path={item} fileDeleterToggle={fileDeleterToggle} size={sizeList[pathList.indexOf(item)]}/>
            </div>
          ))}
        </div>
      }

      {/* Gnomad and other browser queries */}
      <div className="flex ml-2 mt-5 gap-3 items-center text-sm">
        <div className="hover:text-slate-400 cursor-pointer" onClick={() => setBrowserHidden(!browserHidden)}>
          {browserHidden ? (<BsChevronRight />) : (<BsChevronDown />)}
        </div>
        <span>gnomAD Browser</span>
      </div>
      <div className={`flex min-h-[35rem] w-full mt-2 ${activeMenu && browserQuery != undefined && !browserHidden ? '' : 'hidden'} overflow-hidden`}>
        <iframe src={"https://gnomad.broadinstitute.org/" + browserQuery + "?dataset=gnomad_r2_1"} className="flex grow"></iframe>
      </div>
    </div>
  )
}

export var editToggle;
export default Sidebar;
