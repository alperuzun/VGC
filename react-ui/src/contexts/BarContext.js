import React, {createContext, useContext, useState} from 'react';

const StateContext = createContext();



export const BarContext = ({children}) => {

    const [histogramData, setHistogramData] = useState(undefined);
    const [barHistory, setBarHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(undefined);
    const [barInfo, setBarInfo] = useState(undefined);
    const [geneHistory, setGeneHistory] = useState([]);
    const [mapHistory, setMapHistory] = useState([]);
    const [passFilter, setPassFilter] = useState("ALL");
    const [GSError, setGSError] = useState(false);
    const [RSError, setRSError] = useState(false);
    const [selectedBarEntry, setSelectedBarEntry] = useState(undefined);



    const handleBarAction = (newDataObj, processedGeneData, newMap) => {
        if (historyIndex == undefined) {
            setBarHistory([newDataObj]);
            setGeneHistory([processedGeneData]);
            setMapHistory([newMap]);
            setHistoryIndex(0);
        } else if (historyIndex == barHistory.length - 1) {
            setBarHistory([...barHistory, newDataObj]);
            setGeneHistory([...geneHistory, processedGeneData]);
            setMapHistory([...mapHistory, newMap]);
            setHistoryIndex(historyIndex + 1);
        } else {
            // console.log("here");
            setBarHistory(barHistory.splice(historyIndex + 1));
            setGeneHistory(geneHistory.splice(historyIndex + 1));
            setMapHistory(mapHistory.splice(historyIndex + 1));

            setBarHistory([...barHistory, newDataObj]);
            setGeneHistory([...geneHistory, processedGeneData]);
            setMapHistory([...mapHistory, newMap]);

            setHistoryIndex(barHistory.length);
        }
    }


    return(
        <StateContext.Provider
        value={{
            histogramData, 
            setHistogramData,
            barHistory,
            setBarHistory,
            handleBarAction,
            historyIndex,
            setHistoryIndex,
            barInfo,
            setBarInfo,
            geneHistory,
            setGeneHistory,
            mapHistory,
            setMapHistory,
            passFilter,
            setPassFilter,
            GSError, setGSError,
            RSError, setRSError,
            selectedBarEntry, setSelectedBarEntry
        }}>
            {children}
        </StateContext.Provider>
    )

}

export const useBarContext = () => useContext(StateContext);


// const handleBarAction = (currDataObj, newDataObj) => {
//     if (currDataObj === undefined) {
//         setBarHistory([...barHistory, newDataObj]);
//         setHistoryIndex(0);
//     } else if (barHistory[barHistory.length - 1] == currDataObj) {
//         setBarHistory([...barHistory, newDataObj]);
//         setHistoryIndex(historyIndex + 1);
//     } else {
//         setBarHistory(barHistory.slice(0, barHistory.indexOf(currDataObj)));
//         setBarHistory([...barHistory, newDataObj]);
//         setHistoryIndex(barHistory.length - 1);
//     }
// }