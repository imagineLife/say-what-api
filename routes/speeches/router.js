const express = require('express');
const router = express.Router();
const {Stat} = require('./models');
const passport = require('passport');
const {router: jwtStrategy} = require('../auth');
const fs = require('fs');
passport.use(jwtStrategy);
var path = require('path');

const { 
  getLongestThirty, 
  getWordsByCount, 
  getWordsByLength, 
  ingWords,
  edWords,
  getSentences } = require('../../stats')

//Get Default Trump 2017 Speech
router.get('/default', (req,res) => {
	Stat
		.findById("5a1ad99f978ca2681f42df12")
		.then(stat => res.status(200).json(stat.apiRepr()))
		.catch(err => {
			console.log(err);
			res.status(500).json({message: 'Handwritten Error :/'})
		});
});


//Get TEXT of speech by given speech ID
router.get('/text/default', 
  (req, res) => {
  Stat
    .findById("5a1ad99f978ca2681f42df12", ['title', 'speechTextLink'], (err, docs) => {
    })
    .exec()
    .then((stat) =>  {
     return ({
      text  : fs.readFileSync(path.join(__dirname, '../'+stat.speechTextLink), 'utf8'),
      title : stat.title 
     })
    })
    .then(speechText => res.status(200).json(speechText))
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went horribly awry'});
    });
});


/*

  speech/:id 

    **import stats js file @ top
  
  

  router.get(speech/id:stats=wawebrfaf,
    - get speech from db
    - .then => res
      pass speech text to statsFn(res)
      .then(res.status(200)
  )

*/

//Get speech List
router.get('/speechList',
  passport.authenticate('jwt', { session: false }),
 (req,res) => {
  Stat
    .find().select('_id title Orator Date').sort({Date: -1}) //LOCAL
    .then(stat => res.json(stat))
    .catch(err => {
      console.log(err);
      res.status(500).json({message: 'Handwritten Error :/'})
    });
});

//Get stat comparison
router.get('/compare',
  // passport.authenticate('jwt', { session: false }),
 (req,res) => {
  let speechList = null;
  Stat
    .find().select('_id Orator speechTextLink')
    .exec()
    .then(stats => {
      
      let newStats = stats.map(singleStat => {

        //make new obj
        /*
          Why do i need _doc?!
        */
        let newSingleStat = Object.assign({}, {orator: singleStat._doc.Orator });
        
        //get && prep text-to-mostUsedWords
        let thisText = fs.readFileSync(path.join(__dirname, '../'+singleStat._doc.speechTextLink), 'utf8')
        
        //remove some punc
        let puncRegEx = /[\?;".,-]/g
        //gets rid of line-break or whatever
        let newReg = /(^)?\s*$/gm;
        
        //apply regex's to text
        const regexTxt = thisText.replace(newReg," ").replace(puncRegEx, "")
        const arrOfText =  regexTxt.split(" ")
        newSingleStat.wordsByCount = getWordsByCount(arrOfText)
        return newSingleStat
      })
      
      res.json(newStats)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({message: 'Handwritten Error :/'})
    });
});

//Get Stats By speech-ID
router.get('/:id', 
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
  Stat
    .findById(req.params.id)
    .exec()
    .then(stat => {

      //store the result
      const srcResult = stat.apiRepr();

      //get speech text from text file
      srcResult.text = fs.readFileSync(path.join(__dirname, '../'+srcResult.speechTextLink), 'utf8')

      //gets rid of line-break or whatever
      let newReg = /(^)?\s*$/gm;

      let uniqueWordRegex = /([a-z]\w+)(?![\s\S]*\1)/gi

      //remove some punc
      let puncRegEx = /[.,-]/g


      const regexTxt = srcResult.text.replace(newReg," ").replace(puncRegEx, "")
      const uniqueWordCount = srcResult.text.match(uniqueWordRegex).length
      
      let arrOfText =  regexTxt.split(" ")
      
      return res.status(200).json({
        id: srcResult.id,
        title: srcResult.title,
        Orator: srcResult.Orator,
        Date: srcResult.Date,
        speechTextLink: srcResult.speechTextLink,
        imageLink: srcResult.imageLink,
        eventOverview: srcResult.eventOverview,
        numberOfWords : {uniqueWords: uniqueWordCount, wordCount : arrOfText.length},
        bigWords: getLongestThirty(arrOfText).slice(0,12),
        mostUsedWords: getWordsByCount(arrOfText).slice(0,8),
        wordsBySize: getWordsByLength(arrOfText),
        actionWords: getWordsByCount(ingWords(srcResult.text)),
        pastTenseWords: getWordsByCount(edWords(srcResult.text)),
        sentences: getSentences(srcResult.text),
        sentenceCount: getSentences(srcResult.text).length
      })
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went horribly awry'});
    });
});


//Get TEXT of speech by given speech ID
router.get('/text/:id', 
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
  Stat
    .findById(req.params.id)
    .exec()
    .then((stat) =>  {
     return ({
      text  : fs.readFileSync(path.join(__dirname, '../'+stat.speechTextLink), 'utf8'),
      title : stat.title 
     })
    })
    .then(speechText => res.json(speechText))
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went horribly awry'});
    });
});

//Get Default
router.get('/', 
  (req, res) => {
    let queryParams = req.query
    
    Stat
    .findById("5a1ad99f978ca2681f42df12")
    .then(stat => {
      
      //store the result
      const srcResult = stat.apiRepr();

      //get speech text from text file
      srcResult.text = fs.readFileSync(path.join(__dirname, '../'+srcResult.speechTextLink), 'utf8')

      //gets rid of line-break or whatever
      let newReg = /(^)?\s*$/gm;

      let uniqueWordRegex = /([a-z]\w+)(?![\s\S]*\1)/gi

      //remove some punc
      let puncRegEx = /[.,-]/g


      const regexTxt = srcResult.text.replace(newReg," ").replace(puncRegEx, "")
      const uniqueWordCount = srcResult.text.match(uniqueWordRegex).length
      
      let arrOfText =  regexTxt.split(" ")
      
      return res.status(200).json({
        id: srcResult.id,
        title: srcResult.title,
        Orator: srcResult.Orator,
        Date: srcResult.Date,
        speechTextLink: srcResult.speechTextLink,
        imageLink: srcResult.imageLink,
        eventOverview: srcResult.eventOverview,
        numberOfWords : {uniqueWords: uniqueWordCount, wordCount : arrOfText.length},
        bigWords: getLongestThirty(arrOfText).slice(0,12),
        mostUsedWords: getWordsByCount(arrOfText).slice(0,8),
        wordsBySize: getWordsByLength(arrOfText),
        actionWords: getWordsByCount(ingWords(srcResult.text)),
        pastTenseWords: getWordsByCount(edWords(srcResult.text)),
        sentences: getSentences(srcResult.text),
        sentenceCount: getSentences(srcResult.text).length
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({message: 'Handwritten Error :/'})
    });
});

router.post('/',
  passport.authenticate('jwt', {session: false}),
  (req, res) => {

    //validate required fields
    const requiredFields = ['author', 'text'];
    requiredFields.forEach(field => {
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`;
        console.error(message);
        return res.status(418).send(message);
      }
    });

    return res.status(200).send('Valid request');
    
  })

module.exports = router;