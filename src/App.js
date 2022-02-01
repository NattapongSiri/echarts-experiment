import './App.css';
import {useMemo, useState} from 'react'
import AnnotatableChart from './components/AnnotatableChart';
import { generateRandomSeries, generateSequence } from './utils/data_generator';
import AnnotationToolbox from './components/AnnotationToolbox';
import { useCallback } from 'react/cjs/react.development';
import AnnotationsTable from './components/AnnotationsTable';
const seriesConfigs = {
  "seriesA": {},
  "seriesB": {min: 10, max: 15}
}
function App() {
  let series = useMemo(() => {
    let temp = {
      "index": generateSequence()
    }
    for (let [key, value] of Object.entries(seriesConfigs)) {
      temp[key] = generateRandomSeries(value)
    }
    return temp
  }, [])
  const [selectedSeries, setSelectedSeries] = useState(Object.keys(seriesConfigs)[0])
  const selectedSeriesIndex = useMemo(() => Object.keys(seriesConfigs).findIndex(name => name === selectedSeries), [selectedSeries])

  let changeHandler = useCallback(seriesName => {
    setSelectedSeries(seriesName)
  }, [setSelectedSeries])

  const [annotations, setAnnotations] = useState([])
  const onAnnotationDraw = useCallback((from, to) => {
    setAnnotations([...annotations, {
      name: selectedSeries,
      from,
      to
    }])
  }, [annotations, selectedSeries])
  const [textToBePlaced, setTextToBePlaced] = useState(undefined)
  const onTextPlaced = useCallback((coord, text) => {
    setAnnotations([...annotations, {
      name: selectedSeries,
      coord,
      value: text
    }])
    setTextToBePlaced(undefined)
  }, [annotations, setAnnotations, selectedSeries, setTextToBePlaced])

  return (
    <div className="App">
      <AnnotationToolbox seriesNames={Object.keys(seriesConfigs)} defaultSeries={selectedSeries} onChange={changeHandler} onPlaceText={txt => setTextToBePlaced(txt)} />
      <AnnotatableChart annotatingIndex={selectedSeriesIndex} annotatingType={textToBePlaced === undefined?'line':'text'} series={series} onAnnotationDraw={onAnnotationDraw} placeText={textToBePlaced} onTextPlaced={onTextPlaced}/>
      <AnnotationsTable annotations={annotations}/>
    </div>
  );
}

export default App;
