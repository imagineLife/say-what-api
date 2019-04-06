function getWordCount(txt){
    //'whatever' and 'whatever.'
    //replace removes "\n"s
    return txt.replace(/(\\n(\\n)?)/g," ").split(" ").length;
}

module.exports = { getWordCount }