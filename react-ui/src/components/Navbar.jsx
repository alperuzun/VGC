import React, { useEffect, useState, useRef } from 'react'
import { link, useNavigate, NavLink } from 'react-router-dom';
import { AiOutlineMenu } from 'react-icons/ai';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { GoGraph, GoTriangleRight } from 'react-icons/go';
import { GrGraphQl } from 'react-icons/gr'
import { CgOpenCollective, CgViewGrid } from 'react-icons/cg';

import { BiGitCompare } from 'react-icons/bi';
import { HiLightBulb } from 'react-icons/hi';
import { useStateContext } from '../contexts/ContextProvider';
import SearchBar from './SearchBar';
import { useDisplayContext } from '../contexts/DisplayContext';



const Navbar = ({ handleHelpClick }) => {

  const { activeMenu, setActiveMenu, screenSize, setScreenSize, selected, pathList, currentlyViewing, setSearchRangeTerm, setPosFileUpload} = useStateContext();
  const { isClicked, setIsClicked, handleClick, checkClicked} = useDisplayContext();

  const NavButton = ({ title, keyName, customFunc, icon, color, path}) => {
    return (
        <div className="flex flex-row items-center h-7 m-1">
          <NavLink to={`/${path}`}>
            <button
              type="button"
              onClick={customFunc}
              style={{ color }}
              className={`text-lg overflow-clip h-full rounded-full border-1 border-slate-300 ${activeMenu ? '2xl:px-8 xl:px-5 lg:px-3 md:px-2 sm:px-1' : 'xl:px-10 lg:px-10 md:px-6 sm:px-4 px-2'} hover:border-slate-500 transition-transform transform hover:scale-[1.02] active:scale-100 font-normal ${isClicked[keyName] ? 'bg-slate-100 shadow-sm border-slate-500' : 'hover:bg-slate-100'}`}
            >
              <div className={`flex flex-row p-0.25 items-center group-hover:scale-100 ${isClicked[keyName] ? ' font-bold' : ''}`}>
                {icon}
                <span className={`${window.innerWidth < 700 ? 'hidden px-4' : ''} xl:text-[14px] lg:text-[14px] md:text-[13px] sm:text-[12px] text-[12px] ml-2`}>{title}</span>
              </div>
            </button>
          </NavLink>
        </div>
    )
  }

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);



  return (

    <div class="navbar" className="flex flex-col p-1 justify-between relative z-60">

      <div class="menubutton" className="flex flex-row ">
        <button
          type="button"
          onClick={() => {setActiveMenu((prevActiveMenu) => (!prevActiveMenu)); console.log(activeMenu)}}
          className={`relative text-xl rounded-md py-1 px-3`}
        >
          <div className={`flex flex-row items-center`}>
            <AiOutlineMenu />
          </div>
        </button>
        <SearchBar />
      </div>

      <div class="navbuttons" className="flex flex-row ml-10">
        <NavButton
          title="Bar Graph"
          keyName='barGraph'
          customFunc={() => {
            handleClick('barGraph');
          }}
          color="#3b3b3b"
          icon={<GoGraph />}
          path="bar_graph"
        />
        <NavButton
          title="Variant Data"
          keyName='variantData'
          customFunc={() => {
            handleClick('variantData');
          }}
          color="#3b3b3b"
          icon={<CgViewGrid />}
          path="variant_data"
        />
        <NavButton
          title="Node Graph"
          keyName='nodeGraph'
          customFunc={() => {
            handleClick('nodeGraph');

          }}
          color="#3b3b3b"
          icon={<GrGraphQl />}
          path="node_graph"
        />
        <NavButton
          title="Compare Samples"
          keyName='compareSamples'
          customFunc={() => {
            handleClick('compareSamples');
          }}
          color="#3b3b3b"
          icon={<BiGitCompare />}
          path="compare_samples"
        />
        <NavButton
          title="Gene Data"
          keyName='geneData'
          customFunc={() => {
            handleClick('geneData');
            setSearchRangeTerm('');
            setPosFileUpload(undefined);
          }}
          color="#3b3b3b"
          icon={< HiLightBulb />}
          path="gene_data"
        />


      </div>
    </div>
  )
}

export default Navbar

