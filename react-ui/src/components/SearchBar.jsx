import React, { useEffect } from 'react'
import { link, useNavigate } from 'react-router-dom';
import { AiOutlineMenu } from 'react-icons/ai';
import { IoMdSearch } from 'react-icons/io'
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { useStateContext } from '../contexts/ContextProvider';
import { useDisplayContext } from '../contexts/DisplayContext';

const NavButton = ({ title, customFunc, icon, color, dotColor, text, disabled }) => (
  <TooltipComponent content={title} position="BottomCenter">
    <div className="flex flex-row items-center p-1">
      <button type="button" onClick={customFunc} disabled={disabled}
        style={{ color }} className="relative text-xl rounded-md ">
        <div className={`flex flex-row items-center p-2 ${disabled ? "" : "hover:bg-slate-100 "} rounded-full`}>
          <span style={{ background: dotColor }} className="absolute inline-flex rounded-full h-2 w-2 right-1 top-1" />
          {icon}
        </div>
      </button>
    </div>
  </TooltipComponent>
)

const SearchBar = () => {

  const { selected, setSelected, searchRangeTerm, setSearchRangeTerm, searchGeneTerm, setSearchGeneTerm, geneFileUpload, setGeneFileUpload, posFileUpload, setPosFileUpload, toggleRS, setToggleRS, toggleGS, setToggleGS, refresh, setRefresh } = useStateContext();
  const { isClicked, setIsClicked, checkClicked } = useDisplayContext();

  const geneFileUploadOnly = geneFileUpload !== null && geneFileUpload !== undefined;
  const posFileUploadOnly = posFileUpload !== null && posFileUpload !== undefined;

  const handleKeyDownGQ = (e) => {
    if (e.keyCode === 13) {
      if (selected === null || selected === undefined) {
        alert("Upload a VCF file to query.");
      } else {
        var element = document.getElementById('geneQuery');
        var event = new Event('change');
        element.dispatchEvent(event);
        e.target.blur()
        setToggleGS(true);
        setToggleRS(false);
        setGeneFileUpload(undefined);
        setPosFileUpload(undefined);
        setRefresh(!refresh);
      }
    }
  }

  const handleKeyDownRQ = (e) => {
    if (e.keyCode === 13) {
      if (selected === null || selected === undefined) {
        alert("Upload a VCF file to query.");
      } else {
        var element = document.getElementById('rangeQuery');
        var event = new Event('change');
        element.dispatchEvent(event);
        e.target.blur()
        setToggleRS(true);
        setToggleGS(false);
        setGeneFileUpload(undefined);
        setPosFileUpload(undefined);
        setRefresh(!refresh);
      }
    }

  }

  const geneFileNotSupported = isClicked['barGraph'] || isClicked['variantData'] || checkClicked();
  const rangeFileNotSupported = isClicked['geneData'] || isClicked['barGraph'] || isClicked['variantData'] || checkClicked();
  const noFileSelected = selected === null || selected === undefined;

  useEffect(() => {
    window.addEventListener('error', e => {
      if (e.message === 'ResizeObserver loop limit exceeded') {
        const resizeObserverErrDiv = document.getElementById(
          'webpack-dev-server-client-overlay-div'
        );
        const resizeObserverErr = document.getElementById(
          'webpack-dev-server-client-overlay'
        );
        if (resizeObserverErr) {
          resizeObserverErr.setAttribute('style', 'display: none');
        }
        if (resizeObserverErrDiv) {
          resizeObserverErrDiv.setAttribute('style', 'display: none');
        }
      }
    });
  }, []);


  return (
    <div className="flex flex-row items-center ml-6 w-full">

      <div className="flex flex-row items-center w-full">
        <input
          id="geneQuery"
          type="text"
          onChange={(e) => setSearchGeneTerm(e.target.value)}
          placeholder={`${geneFileUpload !== undefined ? "File: " + geneFileUpload : "Search by gene, ex: PLOD1"} `}
          value={searchGeneTerm}
          onKeyDown={(e) => handleKeyDownGQ(e)}
          className={`p-3 w-full outline-1 rounded-lg border-1 border-slate-300 hover:border-slate-500 text-sm outline-slate-200 h-8 ${geneFileUploadOnly ? "bg-slate-300" : "bg-white"} ${toggleGS === true ? "border-1 border-[#3f89c7]" : "bg-white"}`}
        />
        <NavButton
          title="Search"
          customFunc={() => {
            if (selected === null || selected === undefined) {
              alert("Upload a VCF file to query.")
            } else {
              setToggleGS(true);
              setToggleRS(false);
              setGeneFileUpload(undefined);
              setPosFileUpload(undefined);
              setRefresh(!refresh);
            }
          }}
          icon={<IoMdSearch />}
          color="#3b3b3b"
          dotColor="#3f89c7"
          disabled={false}
        />
        <label>
          <div className="hidden">
            <input type="file"
              onChange={e => {
                setGeneFileUpload(e.target.files[0].path);
                setPosFileUpload(undefined);
                setToggleGS(true);
                setSearchGeneTerm("");
                setToggleRS(false);
                setRefresh(!refresh);
                e.target.value = null;
              }}
              disabled={geneFileNotSupported || noFileSelected} 
              accept=".txt"
              />
          </div>
          <div className={`flex p-1 bg-slate-200 w-24 text-sm justify-center text-no-wrap rounded-lg ${geneFileNotSupported || noFileSelected ? '' : 'hover:border-1 hover:border-slate-500 cursor-pointer'}`} onClick={() => {
            if (geneFileNotSupported) {
              alert("Bar Graph and Variant Data visualizations do not support gene file upload. ")
            } else if (noFileSelected) {
              alert("Upload a VCF File to query a gene. ")
            }
          }}>
            Upload File
          </div>
        </label>
      </div>






      <div className="flex flex-row items-center w-full ml-6">
        <input
          id="rangeQuery"
          type="text"
          onChange={(e) => setSearchRangeTerm(e.target.value)}
          placeholder={
            posFileUpload === undefined
              ? !isClicked['geneData']
                ? "Search range, ex: 1:12030000-12040000"
                : "Range query not supported for Gene Data"
              : "File: " + posFileUpload
          }
          value={searchRangeTerm}
          className={`p-3 w-full rounded-lg border-slate-300 text-sm h-8 ${isClicked['geneData'] ? "bg-slate-200" : " outline-1 border-1 hover:border-slate-500 outline-slate-200"} ${posFileUploadOnly ? "bg-slate-300" : "bg-white"} ${toggleRS === true ? "border-1 border-[#3f89c7]" : "bg-white"}`}
          disabled={isClicked['geneData']}
          onKeyDown={(e) => handleKeyDownRQ(e)}
        />
        <NavButton
          title="Search"
          customFunc={() => {
            if (selected === null || selected === undefined) {
              alert("Upload a VCF file to query.")
            } else {
              setToggleRS(true);
              setToggleGS(false);
              setGeneFileUpload(undefined);
              setPosFileUpload(undefined);
              setRefresh(!refresh);
            }
          }}
          icon={<IoMdSearch />}
          color="#3b3b3b"
          dotColor="#3f89c7"
          disabled={isClicked['geneData']}
        />
        <label>
          <div className="hidden">
            <input type="file"
              onChange={e => {
                setPosFileUpload(e.target.files[0].path);
                setGeneFileUpload(undefined)
                setSearchRangeTerm("");
                setToggleRS(true);
                setToggleGS(false);
                setRefresh(!refresh);
                e.target.value = null;
              }}
              accept=".txt"
              disabled={rangeFileNotSupported || noFileSelected}
            />
          </div>
          <div className={`flex p-1 bg-slate-200 w-24 text-sm justify-center text-no-wrap rounded-lg ${rangeFileNotSupported || noFileSelected ? '' : 'hover:border-1 hover:border-slate-500 cursor-pointer'}`} onClick={() => {
            if (rangeFileNotSupported) {
              alert("Bar Graph, Variant Data, and Gene Data visualizations do not support range file upload. ")
            } else if (noFileSelected) {
              alert("Upload a VCF File to query a range. ")
            }
          }}>
            Upload File
          </div>
        </label>

      </div>
    </div>
  )
}

export default SearchBar