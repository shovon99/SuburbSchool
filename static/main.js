async function compareSuburbs() {
    const suburb1 = document.getElementById("suburb1").value.trim();
    const suburb2 = document.getElementById("suburb2").value.trim();
  
    if (!suburb1 || !suburb2) {
      alert("Please enter two suburbs to compare!");
      return;
    }
  
    const res = await fetch(`/compare?suburb1=${encodeURIComponent(suburb1)}&suburb2=${encodeURIComponent(suburb2)}`);
    const data = await res.json();
  
    document.getElementById("results").style.display = "block";
    document.getElementById("comparison-title").textContent = `${data.suburb1} vs ${data.suburb2}`;
  
    document.getElementById("s1").textContent = data.suburb1;
    document.getElementById("s2").textContent = data.suburb2;
    document.getElementById("s1-naplan").textContent = data.summary1.avg_naplan;
    document.getElementById("s1-att").textContent = data.summary1.avg_attendance;
    document.getElementById("s2-naplan").textContent = data.summary2.avg_naplan;
    document.getElementById("s2-att").textContent = data.summary2.avg_attendance;
  
    const ctx = document.getElementById('comparisonChart').getContext('2d');
    if (window.myChart) window.myChart.destroy();
  
    window.myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Avg NAPLAN', 'Attendance %', 'Public %', 'Private %'],
        datasets: [
          {
            label: data.suburb1,
            data: [
              data.summary1.avg_naplan,
              data.summary1.avg_attendance,
              data.summary1.public,
              data.summary1.private
            ],
            backgroundColor: 'rgba(54, 162, 235, 0.6)'
          },
          {
            label: data.suburb2,
            data: [
              data.summary2.avg_naplan,
              data.summary2.avg_attendance,
              data.summary2.public,
              data.summary2.private
            ],
            backgroundColor: 'rgba(255, 99, 132, 0.6)'
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
  