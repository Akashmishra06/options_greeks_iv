import React from 'react'

const parseCsv = (rawCsv) => {
  const [headerLine, ...lines] = rawCsv.trim().split('\n')
  const headers = headerLine.split(',')
  const rows = lines.map(line => line.split(','))
  return { headers, rows }
}

export default function DataTable({ rawCsv }) {
  const { headers, rows } = parseCsv(rawCsv)

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>{headers.map(h => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
