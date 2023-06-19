document.getElementById('download').addEventListener('click', function() {
  chrome.storage.local.get(['wordPairs'], function(result) {
    let csvContent = "data:text/csv;charset=utf-8,";
    result.wordPairs.forEach(function(pair) {
      csvContent += pair[0] + "," + pair[1] + "\r\n";
    });

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "spelling_mistakes.csv");
    link.click();
  });
});