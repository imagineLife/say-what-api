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

  return wordsByLength.sort((a,b) => b.occurances - a.occurances).slice(0,8);
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
  
  let findEnding = /\w*ing\b/g;
  let res = str.match(findEnding);
  return res;
}

function edWords(str){
  
  let findEnding = /\w*ed\b/g;
  let res = str.match(findEnding).sort();
  return res;
}

function ingWordsAndNextWord(str){
  let regex = /\w*ing\b\s*(\S+)/g;
  return str.match(regex)
}

function getSentences(srcTxt){

  /*gets rid of line-break or \n etc.
    \s => space-character (tab, new-line, carraige return etc)
    * =>  0x or more (two line-breaks & a space, two-line-breaks etc)
    $ => at end of line
    ()? => optional, was (^)?\s*$/gm but the m makes this redundant

   /\s*m/gm

  /*removes double \n 
   OR
  \n @ beginng
   OR 
   \n at end
  
    \s{2} == \n\n
    ^\s   == beginning with whitespace

    m flag == multi-line, each line is a new instance to treat separately

   ([?!.]\s.)
    ==> find a ?!. if it has a space behind it, thats ok :)
    MATCH 


  */  
  // let twoWhiteSpaces = /(\s{2})/gm;
  // let standarizeWS = /([?!.]\s)(.)/gm;
  /*
    needs updating to deal with  ==> "blah blah blah D.C.,"
    maybe convert * to + (+ at least 1 exists), converting OPTIONAL spae to REQUIRED space
    * = 0 or more
    + = 1 or more

  */
  let standarizeWS = /([?!.]\s+)(.)/gm;

  //
  /*
  
  LAST SHOT => [\s\S].$

  
    1. @ beginning
      anything accept ., !, or ?
    2. [find-anything-in-here]
      2b. [^find-anything-ACCEPT-these-chars]
    3.+ mean make the match at least 1x
    4. overall 1-3 - find 2 chars in a row that aren't . ! ?
    5.| OR
    6. find one char that is NOT a . ! ? @ the end
      6b. +$ that is right before the end of the line
    () => are capture groups

    ^ means...
      INSIDE a [^etc...] DONT FIND
      /^etc... start @ beginning of the line (the first character)


  when character-counting sentences, remove whitespaces!
  */
  
  // needs updating, stop breaking D.C., into 3 arrays
  // let sentRegex = /([^\.!\?]+[\.!\?]+)|([^\.!\?]+$)/g;
  // plus a negative lookahead and add * 
  let sentRegex = /\.~x~/g;

  // let sentences = srcTxt.replace(twoWhiteSpaces, "").replace(standarizeWS, ". $2").match(sentRegex);
  let sentences = srcTxt.replace(standarizeWS, ".~x~$2").match(sentRegex);
  return sentences
}

module.exports = { 
  getLongestThirty, 
  getWordsByCount, 
  getWordsByLength, 
  ingWords,
  edWords,
  getSentences
}