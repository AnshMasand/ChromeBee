// We can use an open-source library like Typo.js (https://github.com/cfinke/Typo.js) for spell checking

const typo = new Typo("en_US");

function checkSpelling(text) {
  const words = text.split(/\s+/);
  const misspelledWords = [];

  for (const word of words) {
    if (!typo.check(word)) {
      const suggestions = typo.suggest(word);
      if (suggestions.length > 0) {
        misspelledWords.push({ incorrect: word, correct: suggestions[0] });
      }
    }
  }

  return misspelledWords;
}

document.addEventListener("input", (event) => {
  const target = event.target;
  if (target.tagName === "TEXTAREA" || (target.tagName === "INPUT" && target.type === "text")) {
    const misspelledWords = checkSpelling(target.value);
    if (misspelledWords.length > 0) {
      chrome.storage.local.get("misspelledWords", (data) => {
        const storedWords = data.misspelledWords || [];
        const updatedWords = storedWords.concat(misspelledWords);
        chrome.storage.local.set({ misspelledWords: updatedWords });
      });
    }
  }
});
