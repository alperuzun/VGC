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
            selectedBarEntry, setSelectedBarEntry
        }}>
            {children}
        </StateContext.Provider>
    )

}

export const useBarContext = () => useContext(StateContext);
