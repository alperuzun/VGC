import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { link, useNavigate, NavLink } from 'react-router-dom';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { SiMicrogenetics } from 'react-icons/si';
import { BsArrowCounterclockwise, BsPencilFill } from 'react-icons/bs';
import { AiFillPropertySafety, AiOutlinePlus } from 'react-icons/ai';
import { BsChevronDown, BsChevronRight } from 'react-icons/bs';
import { useStateContext } from '../contexts/ContextProvider';
import FileDeleter from './FileDeleter'
import UploadElement from './UploadElement'
import logo_final from './Images/logo_final.png';


import FileService from '../services/FileService';
import { useDisplayContext } from '../contexts/DisplayContext';
import vgc_final from './Images/vgc_final.png';
import lines from './Images/lines.png';


const Sidebar = () => {

  const { selected, setSelected, activeMenu, setActiveMenu, screenSize, setScreenSize, pathList, setPathList, phenotypeList, setPhenotypeList, sizeList, setSizeList, refList, setRefList, handleNewPath, refresh, setRefresh, setSearchGeneTerm, setSearchRangeTerm } = useStateContext();


  const { browserQuery, setBrowserQuery, isClicked, setIsClicked, initialState, omimLink, setOmimLink, msigdbLink, setMsigdbLink } = useDisplayContext();

  const [uploadsHidden, setUploadsHidden] = useState(false);
  const [browserHidden, setBrowserHidden] = useState(false);
  const [analysisHidden, setAnalysisHidden] = useState(false);
  const [browserData, setBrowserData] = useState(undefined);
  const [fileDeleterToggle, setFileDeleterToggle] = useState(false)
  const [ready, setReady] = useState(false)
  const [activeFilterSelect, setActiveFilterSelect] = useState(false);


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
      const refArray = []
      setPathList(pathArray)
      setPhenotypeList(phenotypeArray);
      setSizeList(sizeArray);
      setRefList(refArray);

    });
  }, []);

  if (!ready) {
    return (
      <div className={`${activeMenu ? '' : 'hidden'} p-2 h-full `}>
        <div className="flex justify-between w-full items-center px-1">
          <NavLink className="flex w-full justify-center items-center text-xl p-2"
            to="/home" onClick={() => {
              setSelected(undefined);
              setIsClicked(initialState);
              setSearchGeneTerm('');
              setSearchRangeTerm('');
            }}>
            <img className="w-56" src={logo_final}></img>
          </NavLink>
        </div>
        Preparing backend to receive files...
      </div>
    )
  }

  return (
    <div className={`${activeMenu ? '' : 'hidden'} p-2 h-full `}>
      <div className="flex rounded-lg  justify-between w-full items-center px-1">
        <NavLink className="flex w-full justify-center items-center text-xl p-2"
          to="/home" onClick={() => {
            setSelected(undefined);
            setIsClicked(initialState);
            setSearchGeneTerm('');
            setSearchRangeTerm('');
          }}>
          <img className="w-80" src={logo_final}></img>
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
          <div className="flex flex-row gap-1">
            <label className="flex flex-row gap-1 ">
              <TooltipComponent content="Upload VCF for GRCh37" openDelay={1000} showTipPointer={false} offsetY={6} position="TopRight">
                <div className="hidden">
                  <input
                    type="file"
                    id="myfile37"
                    onChange={e => {
                      handleNewPath(e.target.files[0], "GRCh37");
                      setSelected(e.target.files[0].path);
                      setSearchGeneTerm("");
                      setSearchRangeTerm("");
                      e.target.value = ''
                    }}
                    name="myfile37"
                    accept=".vcf"
                    multiple />
                </div>
                <div className="w-20 flex text-xs justify-center cursor-pointer bg-slate-100 hover:bg-slate-200  py-0.5">
                  GRCh37
                </div>
              </TooltipComponent>
              </label>
              <label className="flex flex-row gap-1 ">
              <TooltipComponent content="Upload VCF for GRCh38" openDelay={1000} showTipPointer={false} offsetY={6} position="TopRight">
                <div className="hidden">
                  <input
                    type="file"
                    id="myfile38"
                    onChange={e => {
                      handleNewPath(e.target.files[0], "GRCh38");
                      setSelected(e.target.files[0].path);
                      setSearchGeneTerm("");
                      setSearchRangeTerm("");
                      e.target.value = ''
                    }}
                    name="myfile38"
                    accept=".vcf"
                    multiple />
                </div>
                <div className="w-20 flex text-xs justify-center cursor-pointer bg-slate-100 hover:bg-slate-200  py-0.5">
                  GRCh38
                </div>
              </TooltipComponent>
            </label>
          </div >
        </div>
        <div className="flex-none">
        <FileDeleter fileDeleterToggle={fileDeleterToggle} setFileDeleterToggle={(bool) => setFileDeleterToggle(bool)} />
      </div>
      </div>


      {/* Each upload object is maped to an UploadElement, with item.name as title. */}
      {!uploadsHidden &&
        <div>
          {pathList.map((item) => (
            <div className="flex flex-col w-full pt-1">
              <UploadElement path={item} fileDeleterToggle={fileDeleterToggle} size={sizeList[pathList.indexOf(item)]} refGenome={refList[pathList.indexOf(item)]} />
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
      <div className={`flex grow w-full h-full mt-2 ${activeMenu && browserQuery != undefined && !browserHidden ? '' : 'hidden'} overflow-hidden`}>
        <iframe src={"https://gnomad.broadinstitute.org/" + browserQuery} className="flex-1"></iframe>
      </div>
    </div>
  )
}

export var editToggle;
export default Sidebar;
