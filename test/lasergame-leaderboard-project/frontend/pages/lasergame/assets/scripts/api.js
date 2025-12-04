class Api {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async saveScore(scoreData) {
    try {
      const response = await fetch(`${this.baseURL}/api/leaderboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scoreData),
      });

      if (!response.ok) {
        throw new Error('Failed to save score');
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving score:', error);
    }
  }

  async getLeaderboard() {
    try {
      const response = await fetch(`${this.baseURL}/api/leaderboard`);

      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  }
}

// Usage example
const api = new Api('http://localhost:5000'); // Adjust the base URL as needed

// Save score example
document.getElementById("save-score").addEventListener("click", async () => {
  const name = document.getElementById("player-name").value || "Anonyme";
  const score = parseInt(document.getElementById("score").innerText, 10);
  
  await api.saveScore({ name, score });
});

// Load leaderboard example
async function loadLeaderboard() {
  const leaderboard = await api.getLeaderboard();
  const list = document.getElementById("leaderboard-list");
  list.innerHTML = "";

  leaderboard.forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = `${entry.name} : ${entry.score} pts`;
    list.appendChild(li);
  });
}

// Call loadLeaderboard on page load or after saving a score
document.addEventListener("DOMContentLoaded", loadLeaderboard);