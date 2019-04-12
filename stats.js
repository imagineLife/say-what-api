// function txtToArr(txt){ return txt.replace(/(\\n(\\n)?)/g," ").split(" ") }

function getWordCount(txt){
    //'whatever' and 'whatever.'
    //replace removes "\n"s
    return txtToArr(txt).length;
}

// creates an object of the USEFUL words occuring most freuqntly
function getFreqUsedWords(wordarr) {
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

function makeTop20LongestWords(arr){
 
  //make NO REPEATS
  let uniqueWords = Array.from(new Set(arr));
  
  //sort the word by longest-at-the-top
  uniqueWords.sort(function(a, b){

    // DESC  sorting -> b.length - a.length
    return b.length - a.length;
  
  });

  let topTewnty = uniqueWords.slice(0,20);
  console.log('sorted array is =>',topTewnty);

  return topTewnty;
}

module.exports = { getWordCount }