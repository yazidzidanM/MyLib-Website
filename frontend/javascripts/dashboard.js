

async function loadLaporan() {
  try {
    const [books, loans, members] = await Promise.all([
      fetch("http://localhost:5001/MyLib/books"),
      fetch("http://localhost:5001/MyLib/loans"),
      fetch("http://localhost:5001/MyLib/users"),
    ]);

    const book = await books.json();
    const loan = await loans.json();
    const member = await members.json();

    animateCount("bookCount", book.total || 0);
    animateCount("borrowCount", loan.data.length || 0);
    animateCount("memberCount", (member.total - 1) || 0);
  } catch (err) {
    console.error("failed to get report:", err);
  }
}

/**
 * @param {string} id 
 * @param {number} target 
 * @param {number} duration 
 */
function animateCount(id, target, duration = 1000) {
  const el = document.getElementById(id);
  if (!el) return;

  const start = 0;
  const range = target - start;
  const startTime = performance.now();

  function update(timestamp) {
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const value = Math.floor(progress * range + start);
    el.textContent = value.toLocaleString("id-ID");
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

loadLaporan();
