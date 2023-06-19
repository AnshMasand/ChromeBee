
import Typo from "./typo.js";


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'checkSpelling') {
      const word = request.word;
      if (!dictionary.check(word)) {
        const suggestions = dictionary.suggest(word);
        if (suggestions.length > 0) {
          sendResponse({ correctedWord: suggestions[0] });
        } else {
          sendResponse({ correctedWord: null });
        }
      } else {
        sendResponse({ correctedWord: null });
      }
    }
    return true; // Required for async response
  });
  


let dictionary = null;
fetch(chrome.runtime.getURL('en_US.dic'))
  .then(response => response.text())
  .then((dicData) => {
    fetch(chrome.runtime.getURL('en_US.aff'))
      .then(response => response.text())
      .then((affData) => {
        dictionary = new Typo('en_US', affData, dicData);
      });
  });

// Handle the requests
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request).then((response) => {
    if (response.type === 'basic' && response.headers.get('content-type').includes('text/html')) {
      return response.text().then((text) => {
        let words = text.split(' ');
        let correctedWords = words.map((word) => {
          if (!dictionary.check(word)) {
            let suggestions = dictionary.suggest(word);
            if (suggestions.length > 0) {
              let correctedWord = suggestions[0];
              chrome.storage.local.get(['wordPairs'], function(result) {
                let wordPairs = result.wordPairs || [];
                wordPairs.push([word, correctedWord]);
                chrome.storage.local.set({wordPairs: wordPairs});
              });
              return correctedWord;
            }
          }
          return word;
        });
        let correctedText = correctedWords.join(' ');
        let init = { "status" : 200 , "statusText" : "SuperSmashingGreat!" };
        return new Response(correctedText, init);
      });
    } else {
      return response;
    }
  }));
});