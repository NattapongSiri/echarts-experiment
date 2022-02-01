import { useState } from "react"

export default function AnnotationToolbox({seriesNames, defaultSeries, onChange, onLabelChange, onPlaceText}) {
  let [selected, setSelected] = useState(defaultSeries)
  let [label, setLabel] = useState("")
  return <>
    <span>Attach annotation to series :</span>
    <select value={selected} onChange={({target: {value}}) => {setSelected(value); onChange(value)}}>
      <option value={""}>None</option>
      {seriesNames.map(name => (
        <option key={name} value={name}>
          {name}
        </option>
      ))}
    </select>
    <input placeholder="Type text to be placed here" type="text" value={label} onChange={({target: {value}}) => setLabel(value)}/>
    <input type="button" value="Place text" onClick={() => {onPlaceText(label)}}/>
  </>
}