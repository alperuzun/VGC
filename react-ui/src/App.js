import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { Sidebar, Navbar, Display, Table, Graph, Gene, Compare, Welcome, Help } from './components';
import { useStateContext } from './contexts/ContextProvider';
import { DisplayContext } from './contexts/DisplayContext';
import { CompareContext } from './contexts/CompareContext';
import { GeneContext } from './contexts/GeneContext';
import { IoMdHelpCircle } from 'react-icons/io';



import { AboutPane, DisplayPane, ParentPane, SimplePane } from './components/Panes';
import { BarContext, useBarContext } from './contexts/BarContext';
import { NodeContext } from './contexts/NodeContext';
import { TableContext } from './contexts/TableContext';
import './App.css';

const App = () => {
  const { activeMenu } = useStateContext();
  const [showHelp, setShowHelp] = useState(false);



  return (
    <DisplayContext >
      <div>
        <BrowserRouter>
          <div className="flex relative dark:bg-main-dark-bg h-screen w-screen overflow-clip">
            {/* <Help onClose={() => setShowHelp(false)} visible={showHelp} /> */}

            <div className="flex flex-col w-full fixed z-10">
              <div className={`dark:bg-main-dark-bg flex flex-row bg-main-bg min-h ${activeMenu ? 'ml-96' : 'flex-2'}`
              }>
                <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
                  <Navbar />
                </div>
              </div>
            </div>

            {activeMenu ? (
              <div className="w-96 fixed sidebar dark:bg-secondary-dark-bg bg-white z-20 h-full">
                <Sidebar />
              </div>
            ) : (
              <div className="w-0 dark:bg-secondary-dark-bg z-20">
                <Sidebar />
              </div>
            )}



            <ParentPane>
              {/* <DisplayPane > */}
                <Routes>
                  <Route path="/home" element={(<Welcome />)} />
                  <Route path="/" element={<Navigate to="/home" />} />
                  <Route path="/bar_graph" element={(<BarContext><Display /></BarContext>)} />
                  <Route path="/variant_data" element={<TableContext><Table /></TableContext>} />
                  <Route path="/node_graph" element={<NodeContext><Graph /></NodeContext>} />
                  <Route path="/compare_samples" element={<CompareContext><Compare /></CompareContext>} />
                  <Route path="/gene_data" element={<GeneContext><Gene /></GeneContext>} />
                </Routes>
              {/* </DisplayPane> */}
            </ParentPane>

          </div>
        </BrowserRouter>
      </div>
    </DisplayContext>
  )
}



export default App


