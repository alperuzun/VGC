import React, { useEffect, useState } from 'react'
import { link, useNavigate, NavLink } from 'react-router-dom';
import { AiOutlineMenu } from 'react-icons/ai';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { GoGraph, GoTriangleRight } from 'react-icons/go';
import { GrGraphQl } from 'react-icons/gr'
import { CgViewGrid } from 'react-icons/cg';

import { BiGitCompare } from 'react-icons/bi';
import { HiLightBulb } from 'react-icons/hi';
import { useStateContext } from '../contexts/ContextProvider';
import SearchBar from './SearchBar';
import { useDisplayContext } from '../contexts/DisplayContext';



const Navbar = ({ handleHelpClick }) => {

  const { activeMenu, setActiveMenu, screenSize, setScreenSize, selected, pathList, currentlyViewing } = useStateContext();
  const { isClicked, setIsClicked, handleClick, checkClicked, mouseOver, setMouseOver, dropdown, setDropdown } = useDisplayContext();

  const NavButton = ({ title, keyName, customFunc, icon, color, path, onMouseEnterFunc, onMouseLeaveFunc }) => {

    // ${isClicked[keyName] ? ' text-slate-100 hover:text-slate-100' : 'hover:bg-light-gray '}
    // ${activeMenu ? 'xl:px-5 lg:px-2' : ''}
    // {isClicked[keyName] ? ' text-slate-100 hover:text-slate-200' : 'hover:bg-light-gray'}
    return (
      <div className="flex flex-row items-center h-6">
        <NavLink
          to={`/${path}`}>
          <button
            type="button"
            onClick={customFunc}
            style={{ color }}
            className={`text-xl rounded-t-lg ${activeMenu ? '2xl:px-8 xl:px-5 lg:px-3 md:px-2 sm:px-1 ' : 'xl:px-10 lg:px-10 md:px-6 sm:px-4 px-2'} ${isClicked[keyName] ? 'bg-[#3f89c7] hover:text-slate-50' : 'hover:bg-slate-100'}`}
            onMouseEnter={onMouseEnterFunc}
            onMouseLeave={onMouseLeaveFunc}>
            <div className={`flex flex-row items-center ${isClicked[keyName] ? ' text-slate-100 hover:text-slate-200' : ''}`}>
              {icon}
                <span className={`${activeMenu ? 'text-[16px]' : 'xl:text-[16px] lg:text-[16px] md:text-[16px] sm:text-[14px] text-sm'}  ml-2`}>{title}</span>
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

  useEffect(() => {
    if (screenSize <= 700) {
      setActiveMenu(false);
    } 
  }, [screenSize]);

  useEffect(() => {
    if (currentlyViewing === undefined) {
      console.log(true);
      // handleClick('barGraph');
      setDropdown(false);
    }

  }, [selected])

  return (

    <div class="navbar" className="flex flex-col p-1 justify-between relative ">

      <div class="menubutton" className="flex flex-row ">
        <button
          type="button"
          onClick={() => setActiveMenu((prevActiveMenu) => (!prevActiveMenu))}
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
          customFunc={() => handleClick('variantData')}
          color="#3b3b3b"
          icon={<CgViewGrid />}
          path="variant_data"
        />
        <NavButton
          title="Node Graph"
          keyName='nodeGraph'
          customFunc={() => handleClick('nodeGraph')}
          color="#3b3b3b"
          icon={<GrGraphQl />}
          path="node_graph"
        />
        <NavButton
          title="Compare Samples"
          keyName='compareSamples'
          customFunc={() => handleClick('compareSamples')}
          color="#3b3b3b"
          icon={<BiGitCompare />}
          path="compare_samples"
        />
        <NavButton
          title="Gene Data"
          keyName='geneData'
          customFunc={() => handleClick('geneData')}
          color="#3b3b3b"
          icon={< HiLightBulb />}
          path="gene_data"
        />
        {/* <div className="flex grow items-center justify-end px-2">
          <button onClick={handleHelpClick}><IoMdHelpCircle /></button>
        </div> */}

        {/* <div className="flex items-center ml-20">
        <button
          type="button"
          onClick={() => {}}
          className={`relative text-sm text-white h-8 bg-[#3f89c7] p-2`}
        >
          <div className="flex h-full items-center">
          Download
          </div>
        </button>
        </div> */}

      </div>
    
      <div className="flex bg-[#3f89c7] w-full h-0.5">
      </div>
    </div>
  )
}

export default Navbar