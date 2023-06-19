// Send a message to the background script to check the spelling of a word
function checkSpelling(word) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ action: 'checkSpelling', word: word }, (response) => {
        resolve(response.correctedWord);
      });
    });
  }
  
  // Correct the text in an input field or text area
  async function correctText(element) {
    const words = element.value.split(' ');
    const correctedWords = [];
  
    for (const word of words) {
      const correctedWord = await checkSpelling(word);
      correctedWords.push(correctedWord || word);
    }
  
    element.value = correctedWords.join(' ');
  }
  
  // Listen for input events on input fields and text areas
  document.addEventListener('input', (event) => {
    const target = event.target;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      correctText(target);
    }
  });
  