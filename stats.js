// creates an object of the most-frequent words occuring
function getWordsByCount(srcWordArr) {
  let freqUsedWords = [];
  srcWordArr.forEach(function(singleWord){
      let thisIndex = null
      // check if this word is already   in array
      if (freqUsedWords.some((arrObj, arrObjInd) => {
            if(arrObj.word == singleWord.toLowerCase()){
              thisIndex = arrObjInd
            }
            return arrObj.word == singleWord.toLowerCase()
          })
      ) {
        freqUsedWords[thisIndex].occurances +=1
      } else {
        freqUsedWords.push({word: singleWord.toLowerCase(), occurances: 1})
      }
  });

  freqUsedWords.sort((a, b) => b.occurances - a.occurances)
  return freqUsedWords;
}

function getWordsByLength(srcWordArr){
  let wordsByLength = [];

  srcWordArr.forEach(function(singleWord){
      let thisIndex = null
      // check if this word is already in array
      let thisWordLength = singleWord.length
      if (wordsByLength.some((arrObj, arrObjInd) => {
            if(arrObj.size == thisWordLength){
              thisIndex = arrObjInd
            }
            return arrObj.size == thisWordLength
          })
      ) {
        wordsByLength[thisIndex].occurances +=1
      } else {
        wordsByLength.push({size: thisWordLength, occurances: 1})
      }
  });

  return wordsByLength.sort((a,b) => b.occurances - a.occurances).slice(0,5);
}

function getLongestThirty(arr){
 
  //make NO REPEATS
  let uniqueWords = Array.from(new Set(arr));
  
  //sort the word by longest-at-the-top
  uniqueWords.sort(function(a, b){

    // DESC  sorting -> b.length - a.length
    return b.length - a.length;
  
  });

  let topTewnty = uniqueWords.slice(0,30);

  return topTewnty;
}

function ingWords(str){
  
  let findEndingInING = /\w*ing\b/g;
  let res = str.match(findEndingInING);
  return res;
}

function ingWordsAndNextWord(str){
  let regex = /\w*ing\b\s*(\S+)/g;
  return str.match(regex)
}

function getSentences(srcTxt){
  let sentences = srcTxt.match(/([^\.!\?]+[\.!\?]+)|([^\.!\?]+$)/g);
  return sentences
}

module.exports = { 
  getLongestThirty, 
  getWordsByCount, 
  getWordsByLength, 
  ingWords,
  getSentences
}