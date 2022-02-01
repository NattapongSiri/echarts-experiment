export default function AnnotationsTable({annotations}) {
  return <table style={{border: "1px solid black", borderSpacing: 0}}>
    <thead style={{border: "1px solid black"}}>
      <tr style={{border: "1px solid black"}}>
        <td style={{border: "1px solid black", margin: 0}}>Series name</td>
        <td style={{border: "1px solid black", margin: 0}}>From</td>
        <td style={{border: "1px solid black", margin: 0}}>To</td>
      </tr>
    </thead>
    <tbody>
      {annotations.length === 0 &&
        <tr><td style={{textAlign: 'center'}} colSpan={3}>No annotations</td></tr>
      }
      {annotations.map(({name, coord, from, to, value}, index) => {
        if (from !== undefined) {
          return <tr key={index}>
            <td>{name}</td>
            <td>{from}</td>
            <td>{to}</td>
          </tr>
        } else {
          return <tr key={index}>
            <td>{name}</td>
            <td>{coord}</td>
            <td>{value}</td>
          </tr>
        }
      })}
    </tbody>
  </table>
}