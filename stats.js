function txtToArr(txt){ return txt.replace(/(\\n(\\n)?)/g," ").split(" ") }

function getWordCount(txt){
    //'whatever' and 'whatever.'
    //replace removes "\n"s
    return txtToArr(txt).length;
}

// creates an object of the USEFUL words occuring most freuqntly
function frequentUsedWords(wordarr) {
  var freqUsedWords = {};
  wordarr.forEach(function(singleWord){
      if (freqUsedWords.hasOwnProperty(singleWord)) {
        freqUsedWords[singleWord] +=1
      } else {
        freqUsedWords[singleWord] = 1
      }
  });
  return freqUsedWords;
}

module.exports = { getWordCount }