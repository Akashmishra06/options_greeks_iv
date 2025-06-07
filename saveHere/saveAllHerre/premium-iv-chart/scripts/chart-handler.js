document.getElementById('fileInput').addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const rawText = e.target.result;
    const lines = rawText.trim().split('\n');
    if (lines.length < 2) return;

    const headers = lines[0].split(',');
    const rows = lines.slice(1).map(line => line.split(','));

    const labels = [], ivCall = [], ivPut = [], callChange = [], putChange = [], priceChange = [];

    rows.forEach(parts => {
      if (parts.length >= 12) {
        labels.push(parts[1].slice(11));
        ivCall.push(parseFloat(parts[7]));
        ivPut.push(parseFloat(parts[5]));
        callChange.push(parts[9] ? parseFloat(parts[9]) : null);
        putChange.push(parts[10] ? parseFloat(parts[10]) : null);
        priceChange.push(parts[11] ? parseFloat(parts[11]) : null);
      }
    });

    const ctx = document.getElementById('ivChart').getContext('2d');
    const gradientCall = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    gradientCall.addColorStop(0, 'rgba(0, 123, 255, 0.85)');
    gradientCall.addColorStop(0.7, 'rgba(0, 123, 255, 0.3)');
    gradientCall.addColorStop(1, 'rgba(0, 123, 255, 0)');

    const gradientPut = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    gradientPut.addColorStop(0, 'rgba(40, 167, 69, 0.85)');
    gradientPut.addColorStop(0.7, 'rgba(40, 167, 69, 0.3)');
    gradientPut.addColorStop(1, 'rgba(40, 167, 69, 0)');

    if (window.ivChartInstance) window.ivChartInstance.destroy();

    window.ivChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: 'IV Call (%)', data: ivCall, borderColor: '#007bff', backgroundColor: gradientCall, fill: true, tension: 0.3, borderWidth: 1.5, pointRadius: 2.5, pointHoverRadius: 5, pointBackgroundColor: '#0d6efd' },
          { label: 'IV Put (%)', data: ivPut, borderColor: '#28a745', backgroundColor: gradientPut, fill: true, tension: 0.3, borderWidth: 1.5, pointRadius: 2.5, pointHoverRadius: 5, pointBackgroundColor: '#198754' },
          { label: 'Call IV Change', data: callChange, borderColor: '#ffc107', borderDash: [5, 5], fill: false, tension: 0.2, borderWidth: 1.8, pointRadius: 2, pointHoverRadius: 4 },
          { label: 'Put IV Change', data: putChange, borderColor: '#dc3545', borderDash: [5, 5], fill: false, tension: 0.2, borderWidth: 1.8, pointRadius: 2, pointHoverRadius: 4 },
          { label: 'sumOfPriceChange', data: priceChange, borderColor: '#a64aff', borderDash: [4, 4], fill: false, tension: 0.25, borderWidth: 1.8, pointRadius: 2, pointHoverRadius: 4 }
        ]
      },
      options: {
        responsive: true,
        animation: { duration: 1200, easing: 'easeOutQuart' },
        interaction: { mode: 'nearest', intersect: false, axis: 'x' },
        plugins: {
          legend: {
            labels: {
              color: '#cfd8dc',
              font: { size: 15, weight: '600' }
            }
          },
          tooltip: {
            enabled: true,
            backgroundColor: '#222',
            titleColor: '#fff',
            bodyColor: '#ddd',
            borderColor: '#444',
            borderWidth: 1,
            cornerRadius: 6,
            displayColors: true,
            mode: 'nearest',
            intersect: false,
            padding: 10,
            bodyFont: { size: 13 }
          }
        },
        scales: {
          x: {
            ticks: {
              color: '#a0b0c0',
              font: { size: 12, weight: '500' },
              maxRotation: 45,
              minRotation: 30,
              autoSkipPadding: 8
            },
            grid: { color: 'rgba(255, 255, 255, 0.1)' }
          },
          y: {
            ticks: {
              color: '#a0b0c0',
              font: { size: 13, weight: '500' },
              beginAtZero: false
            },
            grid: { color: 'rgba(255, 255, 255, 0.1)' }
          }
        }
      }
    });

    const tableContainer = document.getElementById('tableContainer');
    tableContainer.innerHTML = '';
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const headerRow = document.createElement('tr');
    headers.forEach(header => {
      const th = document.createElement('th');
      th.textContent = header.trim();
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    rows.forEach(row => {
      const tr = document.createElement('tr');
      row.forEach(cell => {
        const td = document.createElement('td');
        td.textContent = cell.trim();
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    tableContainer.appendChild(table);
  };

  reader.readAsText(file);
});
