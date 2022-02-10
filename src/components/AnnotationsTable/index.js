export default function AnnotationsTable({annotations, showAnnotation=()=>{}, deleteAnnotation=()=>{}, showTextPlaced=()=>{}, deleteTextPlaced=()=>{}}) {
  return <table style={{border: "1px solid black", borderSpacing: 0}}>
    <thead style={{border: "1px solid black"}}>
      <tr style={{border: "1px solid black"}}>
        <td style={{border: "1px solid black", margin: 0}}>Series name</td>
        <td style={{border: "1px solid black", margin: 0}}>From</td>
        <td style={{border: "1px solid black", margin: 0}}>To</td>
        <td style={{border: "1px solid black", margin: 0}}>Type</td>
        <td style={{border: "1px solid black", margin: 0}}>Show</td>
        <td style={{border: "1px solid black", margin: 0}}>Delete</td>
      </tr>
    </thead>
    <tbody>
      {annotations.length === 0 &&
        <tr><td style={{textAlign: 'center'}} colSpan={3}>No annotations</td></tr>
      }
      {annotations.map(({name, coord, from, to, value, type, show}, index) => {
        if (from !== undefined) {
          return <tr key={index} style={{color : show ? 'black' : 'gray'}}>
            <td>{name}</td>
            <td>{from}</td>
            <td>{to}</td>
            <td>{type}</td>
            <td><button onClick={() => showAnnotation(from,to,show)}>{show ? "Hide" : "Show"}</button></td>
            <td><button onClick={() => deleteAnnotation(from,to)}>Delete</button></td>
          </tr>
        } else {
          return <tr key={index}  style={{color : show ? 'black' : 'gray'}}>
            <td>{name}</td>
            <td>{coord}</td>
            <td>{value}</td>
            <td>{type}</td>
            <td><button onClick={() => showTextPlaced(coord,value,show)}>{show ? "Hide" : "Show"}</button></td>
            <td><button onClick={() => deleteTextPlaced(coord,value)}>Delete</button></td>
          </tr>
        }
      })}
    </tbody>
  </table>
}