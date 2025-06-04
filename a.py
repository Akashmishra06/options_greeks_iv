<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Premium IV Chart (Call vs Put) + Toggle Data Table</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

    body {
      font-family: 'Poppins', sans-serif;
      background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
      color: #e0e6f0;
      padding: 2rem;
      margin: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
      user-select: none;
    }

    h2 {
      font-weight: 600;
      font-size: 2.5rem;
      margin-bottom: 1.5rem;
      text-shadow: 0 0 8px rgba(255, 255, 255, 0.15);
      letter-spacing: 0.05em;
      text-align: center;
    }

    .container {
      max-width: 960px;
      width: 95vw;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 20px;
      box-shadow: 0 12px 24px rgba(0,0,0,0.4);
      padding: 2rem 2.5rem 3rem;
      backdrop-filter: blur(15px);
      -webkit-backdrop-filter: blur(15px);
      margin-bottom: 3rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    input[type="file"] {
      display: block;
      margin: 1rem auto 2.5rem;
      background: #1a73e8;
      color: white;
      font-weight: 600;
      padding: 0.6rem 1.6rem;
      border-radius: 12px;
      border: none;
      box-shadow: 0 4px 15px rgba(26, 115, 232, 0.6);
      cursor: pointer;
      transition: background 0.3s ease;
      font-size: 1rem;
      user-select: none;
    }
    input[type="file"]:hover {
      background: #155ab6;
      box-shadow: 0 6px 20px rgba(21, 90, 182, 0.8);
    }

    button#toggleTableBtn {
      background: #28a745;
      color: white;
      font-weight: 600;
      padding: 0.7rem 1.8rem;
      border-radius: 14px;
      border: none;
      box-shadow: 0 5px 18px rgba(40, 167, 69, 0.7);
      cursor: pointer;
      font-size: 1.1rem;
      user-select: none;
      transition: background 0.3s ease;
      margin-bottom: 2rem;
    }
    button#toggleTableBtn:hover {
      background: #218838;
      box-shadow: 0 7px 24px rgba(33, 136, 56, 0.9);
    }

    canvas {
      display: block;
      max-width: 100%;
      width: 100%;
      height: 55vh;
      border-radius: 20px;
      box-shadow: 0 10px 40px rgba(0, 123, 255, 0.3);
      background: linear-gradient(135deg, #0d1523 10%, #162a48 90%);
      padding: 1.2rem 1.5rem 1.5rem;
      margin: 0 auto;
    }

    /* Table styles */
    table {
      width: 100%;
      border-collapse: collapse;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      font-size: 0.9rem;
    }

    thead {
      background: linear-gradient(90deg, #007bff, #28a745);
    }

    thead th {
      color: #f0f8ff;
      padding: 0.8rem 1rem;
      text-align: left;
      font-weight: 600;
      user-select: none;
      border-bottom: 2px solid rgba(255, 255, 255, 0.2);
    }

    tbody tr:nth-child(even) {
      background: rgba(255, 255, 255, 0.02);
    }

    tbody tr:hover {
      background: rgba(255, 255, 255, 0.08);
      cursor: default;
    }

    tbody td {
      padding: 0.6rem 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      color: #c0cbdc;
      white-space: nowrap;
    }

    .table-container {
      max-width: 960px;
      width: 95vw;
      overflow-x: auto;
      margin-bottom: 3rem;
      display: none; /* hidden initially */
    }

  </style>
</head>
<body>
  <h2>📈 Premium IV Chart (Call vs Put) + Toggle Data Table</h2>
  <div class="container">
    <input type="file" id="fileInput" accept=".csv" />
    <canvas id="ivChart"></canvas>
    <button id="toggleTableBtn" style="display:none;">Show Data Table</button>
  </div>

  <div class="table-container" id="tableContainer"></div>

  <script>
    const toggleBtn = document.getElementById('toggleTableBtn');
    const tableContainer = document.getElementById('tableContainer');

    toggleBtn.addEventListener('click', () => {
      if (tableContainer.style.display === 'none' || tableContainer.style.display === '') {
        tableContainer.style.display = 'block';
        toggleBtn.textContent = 'Hide Data Table';
      } else {
        tableContainer.style.display = 'none';
        toggleBtn.textContent = 'Show Data Table';
      }
    });

    document.getElementById('fileInput').addEventListener('change', function (event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (e) {
        const rawText = e.target.result;
        const lines = rawText.trim().split('\n');
        if (lines.length < 2) return;

        // Parse CSV headers and rows
        const headers = lines[0].split(',');
        const rows = lines.slice(1).map(line => line.split(','));

        // Prepare chart data arrays
        const labels = [];
        const ivCall = [];
        const ivPut = [];

        rows.forEach(parts => {
          if (parts.length >= 8) {
            labels.push(parts[0].slice(11));  // time only from datetime
            ivCall.push(parseFloat(parts[7]));
            ivPut.push(parseFloat(parts[5]));
          }
        });

        // Draw Chart
        const ctx = document.getElementById('ivChart').getContext('2d');
        const canvasHeight = ctx.canvas.height;

        const gradientCall = ctx.createLinearGradient(0, 0, 0, canvasHeight);
        gradientCall.addColorStop(0, 'rgba(0, 123, 255, 0.85)');
        gradientCall.addColorStop(0.7, 'rgba(0, 123, 255, 0.3)');
        gradientCall.addColorStop(1, 'rgba(0, 123, 255, 0)');

        const gradientPut = ctx.createLinearGradient(0, 0, 0, canvasHeight);
        gradientPut.addColorStop(0, 'rgba(40, 167, 69, 0.85)');
        gradientPut.addColorStop(0.7, 'rgba(40, 167, 69, 0.3)');
        gradientPut.addColorStop(1, 'rgba(40, 167, 69, 0)');

        // Destroy previous chart if any
        if (window.ivChartInstance) {
          window.ivChartInstance.destroy();
        }

        window.ivChartInstance = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'IV Call (%)',
                data: ivCall,
                borderColor: '#007bff',
                backgroundColor: gradientCall,
                fill: true,
                tension: 0.3,
                borderWidth: 1.5,
                pointRadius: 3,
                pointHoverRadius: 6,
                pointBackgroundColor: '#0d6efd',
              },
              {
                label: 'IV Put (%)',
                data: ivPut,
                borderColor: '#28a745',
                backgroundColor: gradientPut,
                fill: true,
                tension: 0.3,
                borderWidth: 1.5,
                pointRadius: 3,
                pointHoverRadius: 6,
                pointBackgroundColor: '#198754',
              }
            ]
          },
          options: {
            responsive: true,
            animation: {
              duration: 1200,
              easing: 'easeOutQuart'
            },
            interaction: {
              mode: 'nearest',
              intersect: false,
              axis: 'x'
            },
            plugins: {
              legend: {
                labels: {
                  font: {
                    family: 'Poppins',
                    weight: '600',
                    size: 14,
                  },
                  color: '#c0cbdc',
                }
              },
              tooltip: {
                enabled: true,
                backgroundColor: 'rgba(0,0,0,0.8)',
                titleFont: { weight: '600', size: 14 },
                bodyFont: { size: 13 },
                cornerRadius: 6,
                displayColors: true,
                mode: 'nearest',
                intersect: false,
                callbacks: {
                  label: ctx => ctx.dataset.label + ': ' + ctx.parsed.y + '%',
                }
              }
            },
            scales: {
              x: {
                ticks: {
                  color: '#b0bbd6',
                  maxRotation: 40,
                  minRotation: 40,
                  maxTicksLimit: 20,
                },
                grid: {
                  display: false,
                }
              },
              y: {
                ticks: {
                  color: '#b0bbd6',
                  font: { weight: '500' },
                  callback: val => val + '%',
                  maxTicksLimit: 8,
                },
                grid: {
                  color: 'rgba(255,255,255,0.08)',
                  borderDash: [4, 8],
                },
                beginAtZero: true,
              }
            }
          }
        });

        // Show toggle button
        toggleBtn.style.display = 'inline-block';

        // Build data table
        let tableHtml = '<table><thead><tr>';
        headers.forEach(h => tableHtml += `<th>${h.trim()}</th>`);
        tableHtml += '</tr></thead><tbody>';
        rows.forEach(r => {
          tableHtml += '<tr>';
          r.forEach(cell => {
            tableHtml += `<td>${cell.trim()}</td>`;
          });
          tableHtml += '</tr>';
        });
        tableHtml += '</tbody></table>';

        tableContainer.innerHTML = tableHtml;
        tableContainer.style.display = 'none';  // keep hidden initially
        toggleBtn.textContent = 'Show Data Table';
      };

      reader.readAsText(file);
    });
  </script>
</body>
</html>
