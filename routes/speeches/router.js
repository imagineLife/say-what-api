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
  ingWords } = require('../../stats')

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

//Get Default
router.get('/', 
  (req, res) => {
    let queryParams = req.query
    
    /*
      NEED TO
      hanlde optional parameters
      - GET speech Text
      -  IF no parameters, process & return ALL stats
      - If parameters, get ONLY passed parameters
    */

    //stole from default, will need some re-modeling
    /*
      returns ... 
      {
        "id": "5a1ad99f978ca2681f42df12",
        "title": "Inaugural Address",
        "Orator": "Donald Trump",
        "Date": "2017-01-20T05:00:00.000Z",
        "speechTextLink": "../speechText/t2017.txt",
        "imageLink": "../../imgs/trump.jpg",
        "eventOverview": "Donald Trump marks the commencement of a new four-year term as the President of the United States"
        "stats" : {
          "wordCount" : ,
          "longestWords" : ,
        }
      }
    */
    Stat
    .findById("5a1ad99f978ca2681f42df12")
    .then(stat => {
      
      //store the result
      const srcResult = stat.apiRepr();

      //get speech text from text file
      srcResult.text = fs.readFileSync(path.join(__dirname, '../'+srcResult.speechTextLink), 'utf8')

      /*
        () ===> a capture group
        / ( \\n (\\n) ?) /
      */

      let reg = /^\s*$/gm;
      /**/
      let regStart = /(\\n(\\n)?)/g;

      //gets rid of line-break or whatever
      let newReg = /(^)?\s*$/gm;
      // let newReg = /[([.,-])((^)?\s*$)]/gm;


      //remove some punc
      let puncRegEx = /[.,-]/g


      const regexTxt = srcResult.text.replace(newReg," ").replace(puncRegEx, "")
      
      let arrOfText =  regexTxt.split(" ")

      //build stats object
      srcResult.stats = {
       wordCount : arrOfText.length,
       longestTwenty: getLongestThirty(arrOfText),
       frequentWords: getWordsByCount(arrOfText).slice(0,30),
       wordsByLength: getWordsByLength(arrOfText),
       actonWords: ingWords(srcResult.text),
        //etc
      }
      /*
          speech stats magic
          - take stat.apiRepr()
          - append "stats" : {}

      */
      return res.status(200).json(srcResult)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({message: 'Handwritten Error :/'})
    });

    /*
    add in stats
    - 
    */
});

//Get Stats By speech-ID
router.get('/:id', 
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
  Stat
    .findById(req.params.id)
    .exec()
    .then(stat => res.json(stat.apiRepr()))
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