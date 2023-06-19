function downloadCSV(misspelledWords) {
  const csvContent = "data:text/csv;charset=utf-8," + misspelledWords.map((wordPair) => `${wordPair.incorrect},${wordPair.correct}`).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "misspelled_words.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

document.getElementById("download-csv").addEventListener("click", () => {
  chrome.storage.local.get("misspelledWords", (data) => {
    const misspelledWords = data.misspelledWords || [];
    downloadCSV(misspelledWords);
  });
});