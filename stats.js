function txtToArr(txt){ return txt.replace(/(\\n(\\n)?)/g," ").split(" ") }

function getWordCount(txt){
    //'whatever' and 'whatever.'
    //replace removes "\n"s
    return txtToArr(txt).length;
}

module.exports = { getWordCount }