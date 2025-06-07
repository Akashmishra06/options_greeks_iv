import React, { useEffect, useRef } from 'react'
import { Chart } from 'chart.js/auto'

const parseCsv = (rawCsv) => {
  const [headerLine, ...lines] = rawCsv.trim().split('\n')
  const headers = headerLine.split(',')
  const rows = lines.map(line => line.split(','))
  return { headers, rows }
}

export default function IVChart({ rawCsv }) {
  const chartRef = useRef(null)
  const { rows } = parseCsv(rawCsv)

  useEffect(() => {
    const labels = [], ivCall = [], ivPut = []
    rows.forEach(row => {
      labels.push(row[1].slice(11))
      ivPut.push(parseFloat(row[5]) || 0)
      ivCall.push(parseFloat(row[7]) || 0)
    })

    const ctx = chartRef.current.getContext('2d')
    if (window.myChart) window.myChart.destroy()

    window.myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'IV Call',
            data: ivCall,
            borderColor: 'blue',
            backgroundColor: 'rgba(0,0,255,0.2)',
            fill: true
          },
          {
            label: 'IV Put',
            data: ivPut,
            borderColor: 'green',
            backgroundColor: 'rgba(0,255,0,0.2)',
            fill: true
          }
        ]
      },
      options: { responsive: true }
    })
  }, [rawCsv])

  return <canvas ref={chartRef} />
}
