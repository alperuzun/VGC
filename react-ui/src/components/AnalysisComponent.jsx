import React, {useState} from 'react'
import { useDisplayContext } from '../contexts/DisplayContext';
import { useStateContext } from '../contexts/ContextProvider';
import { BarChart, Bar, LabelList, Cell, Label, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BiCaretRight, BiCaretDown } from 'react-icons/bi'

const AnalysisComponent = ({ variant }) => {

  const { browserQuery, setBrowserQuery } = useDisplayContext();
  const { selected, pathList, refList } = useStateContext();
  const [showHidden, setShowHidden] = useState(false);

  const processExactTest = (matrixString) => {
    const values = matrixString.split(',');
    const data = [];
    let groupCounter = 0;

    for (let i = 0; i < values.length; i += 3) {
      const group = {
        name: `Group #${groupCounter}`,
        "0/0": parseInt(values[i], 10),
        '0/1': parseInt(values[i + 1], 10),
        "1/1": parseInt(values[i + 2], 10),
      };

      data.push(group);
      groupCounter++;
    }
    return data

  }

  const handleSignificanceNominal = (resultString) => {
    if (parseFloat(resultString.substring(17, 23)) <= 0.05) {
      return true;
    }
  }

  const handleSignificanceAdjusted = (resultString, n) => {
    if (parseFloat(resultString.substring(42, 48)) <= 0.05 / parseFloat(n)) {
      return true;
    }
  }


  const handleSetBrowserQuery = (setString) => {
    if (refList[pathList.indexOf(selected)] === "GRCh37") {
      setBrowserQuery(setString + "?dataset=gnomad_r2_1");
    } else {
      setBrowserQuery(setString + "?dataset=gnomad_r4");
    }
  }

  return (
    <div className="flex flex-col w-11/12 mt-2 bg-black">
      <div className="flex px-2 py-1 justify-center items-center  bg-[#ebebeb] hover:bg-[#f2f2f2] cursor-pointer" >
        <div class="flex-none  hover:text-slate-500 cursor-pointer" onClick={() => setShowHidden(!showHidden)}>
        {showHidden ? <BiCaretDown /> : <BiCaretRight />}
        </div>
        <div class="grow justify-between flex flex-col" onClick={() => handleSetBrowserQuery("region/" + variant.varChr + "-" + variant.varPos + "-" + variant.varPos)}>
        <text class="flex">Variant: {variant.varPos}</text>
        <div class="flex flex-row gap-3">
        <text className={`${ handleSignificanceNominal(variant.testResult[0]) ? " text-red-500" : " "} font-bold text-xs flex ml-auto`} >
          {variant.testResult[0].split('\t')[0]}
          </text>
          <text className={`${ handleSignificanceAdjusted(variant.testResult[0], variant.numVarInGene) ? " text-red-500" : " "} font-bold text-xs flex ml-auto`}>
          {variant.testResult[0].split('\t')[1]}
          </text>
          </div>
        </div>
      </div>
      <div className={`${showHidden ? "" : "hidden"} flex flex-col`}>
        <div className="flex w-full h-40 p-2">

          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={50}
              height={50}
              data={processExactTest(variant.rowsAsList)}
              margin={{
                top: 2,
                right: 10,
                left: 2,
                bottom: 2,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="0/0" stackId="a" fill="#64aec4" />
              <Bar dataKey="0/1" stackId="a" fill="#82ca9d" />
              <Bar dataKey="1/1" stackId="a" fill="#c8ca82" />

            </BarChart>
          </ResponsiveContainer>
        </div>
        {
          variant.testResult[0] === "Evaluation Error" &&
          <div className="flex px-4 text-[13px]">Evaluation Error: Equivalent GT for all samples</div>
        }
        {/* {variant.testResult.map((r) => (
          <div className="flex px-2 text-[13px]">{r}</div>
        ))} */}
      </div>
    </div>
  )
}

export default AnalysisComponent