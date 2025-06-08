const datePicker = document.getElementById('datePicker');
const chartCanvas = document.getElementById('ivChart');
const tableContainer = document.getElementById('tableContainer');
const errorMsg = document.getElementById('errorMsg');
let ivChartInstance;

datePicker.addEventListener('change', () => {
  const selectedDate = datePicker.value;
  if (!selectedDate) return;

  const filePath = `/data/${selectedDate}.csv`;

  fetch(filePath)
    .then(response => {
      if (!response.ok) throw new Error("File not found or inaccessible");
      return response.text();
    })
    .then(rawText => {
      errorMsg.textContent = '';
      const lines = rawText.trim().split('\n').filter(line => line.trim() !== '');
      const headers = lines[0].split(',').map(h => h.trim());
      const rows = lines.slice(1).map(line => line.split(',').map(cell => cell.trim()));

      const labels = [], ivCall = [], ivPut = [], callChange = [], putChange = [], priceChange = [];

      rows.forEach(parts => {
        if (parts.length >= 12) {
          labels.push(parts[1].slice(11));
          ivCall.push(parseFloat(parts[7]) || 0);
          ivPut.push(parseFloat(parts[5]) || 0);
          callChange.push(parseFloat(parts[9]) || 0);
          putChange.push(parseFloat(parts[10]) || 0);
          priceChange.push(parseFloat(parts[11]) || 0);
        }
      });

      const ctx = chartCanvas.getContext('2d');
      const gradientCall = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
      gradientCall.addColorStop(0, 'rgba(0, 123, 255, 0.85)');
      gradientCall.addColorStop(1, 'rgba(0, 123, 255, 0)');

      const gradientPut = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
      gradientPut.addColorStop(0, 'rgba(40, 167, 69, 0.85)');
      gradientPut.addColorStop(1, 'rgba(40, 167, 69, 0)');

      if (ivChartInstance) ivChartInstance.destroy();

      ivChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            { label: 'IV Call (%)', data: ivCall, borderColor: '#007bff', backgroundColor: gradientCall, fill: true, tension: 0.3 },
            { label: 'IV Put (%)', data: ivPut, borderColor: '#28a745', backgroundColor: gradientPut, fill: true, tension: 0.3 },
            { label: 'Call IV Change', data: callChange, borderColor: '#ffc107', borderDash: [5, 5], fill: false, tension: 0.2 },
            { label: 'Put IV Change', data: putChange, borderColor: '#dc3545', borderDash: [5, 5], fill: false, tension: 0.2 },
            { label: 'sumOfPriceChange', data: priceChange, borderColor: '#a64aff', borderDash: [4, 4], fill: false, tension: 0.25 }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { labels: { color: '#cfd8dc' }},
            tooltip: { backgroundColor: '#222', bodyColor: '#eee' }
          },
          scales: {
            x: { ticks: { color: '#ccc' }, grid: { color: 'rgba(255,255,255,0.1)' }},
            y: { ticks: { color: '#ccc' }, grid: { color: 'rgba(255,255,255,0.1)' }}
          }
        }
      });

      // Populate table
      tableContainer.innerHTML = '';
      const table = document.createElement('table');
      const thead = document.createElement('thead');
      const tbody = document.createElement('tbody');

      const headerRow = document.createElement('tr');
      headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);

      rows.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
          const td = document.createElement('td');
          td.textContent = cell;
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });

      table.appendChild(thead);
      table.appendChild(tbody);
      tableContainer.appendChild(table);
    })
    .catch(err => {
      errorMsg.textContent = `❌ Could not load data for ${selectedDate}. Make sure the file exists.`;
      if (ivChartInstance) ivChartInstance.destroy();
      tableContainer.innerHTML = '';
    });
});
