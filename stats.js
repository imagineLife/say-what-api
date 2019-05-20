// creates an object of the most-frequent words occuring
function getWordsByCount(srcWordArr) {
  var freqUsedWords = [];
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

function getLongestTwenty(arr){
 
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

module.exports = { getLongestTwenty, getWordsByCount }