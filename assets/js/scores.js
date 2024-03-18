var HighscoreManager = (function() {
  function printHighscores() {
    var highscores = JSON.parse(window.localStorage.getItem('highscores')) || [];
    highscores.sort(function(a, b) {
      return b.score - a.score;
    });

    var olEl = document.getElementById('highscores');
    olEl.innerHTML = ''; // Clear existing entries

    for (var i = 0; i < highscores.length; i += 1) {
      var liTag = document.createElement('li');
      liTag.textContent = highscores[i].initials + ' - ' + highscores[i].score;
      olEl.appendChild(liTag);
    }
  }

  function clearHighscores() {
    window.localStorage.removeItem('highscores');
    printHighscores(); // Update UI after clearing
  }

  document.getElementById('clear').addEventListener('click', clearHighscores);

  // Expose the printHighscores function to be accessible from outside
  return {
    printHighscores: printHighscores
  };
})();

// Run printHighscores when the page loads
document.addEventListener('DOMContentLoaded', HighscoreManager.printHighscores);
