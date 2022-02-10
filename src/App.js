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
      to,
      show: true,
    }])
  }, [annotations, selectedSeries])
  const onShowAnnotation = useCallback((from, to, show) => {
    let newState = annotations.map(obj =>
      obj.from === from && obj.to === to ? { ...obj, show: !show } : obj
    );
    setAnnotations(newState)
  },[annotations, setAnnotations])
  const onDeleteAnnotation = useCallback((from, to) => {
    let filtered = annotations.filter(annotation => annotation.from !== from && annotation.to !== to)
    setAnnotations(filtered)
  },[annotations, setAnnotations])

  const [textToBePlaced, setTextToBePlaced] = useState(undefined)
  const onTextPlaced = useCallback((coord, text) => {
    setAnnotations([...annotations, {
      name: selectedSeries,
      coord,
      value: text,
      show: true
    }])
    setTextToBePlaced(undefined)
  }, [annotations, setAnnotations, selectedSeries, setTextToBePlaced])
  const onShowTextPlaced = useCallback((coord,value, show) => {
    let newState = annotations.map(obj =>
      obj.coord === coord && obj.value === value ? { ...obj, show: !show } : obj
    );
    setAnnotations(newState)
  },[annotations, setAnnotations])
  const onDeleteTextPlaced = useCallback((coord,value) => {
    let filtered = annotations.filter(annotation => annotation.coord !== coord && annotation.value !== value)
    setAnnotations(filtered)
  },[annotations, setAnnotations])

  return (
    <div className="App">
      <AnnotationToolbox seriesNames={Object.keys(seriesConfigs)} defaultSeries={selectedSeries} onChange={changeHandler} onPlaceText={txt => setTextToBePlaced(txt)} />
      <AnnotatableChart annotatingIndex={selectedSeriesIndex} annotatingType={textToBePlaced === undefined?'line':'text'} series={series} curAnnotations={annotations} onAnnotationDraw={onAnnotationDraw} placeText={textToBePlaced} onTextPlaced={onTextPlaced}/>
      <AnnotationsTable annotations={annotations} deleteAnnotation={onDeleteAnnotation} deleteTextPlaced={onDeleteTextPlaced} showAnnotation={onShowAnnotation} showTextPlaced={onShowTextPlaced}/>
    </div>
  );
}

export default App;
