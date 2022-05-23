/*
  asserts a request includes expected parameters
  in
    req.body
  and/or in
    req.params

  example uses:
    - router.post('the-route', assertParams({query: 'qwer'}), routeHandler);

    - body must require dog
      assertParams({
        body: ['dog']
      })

    - query must compare cat
      assertParams({
        query: ['cat']
      })
*/

function assertParams(paramsObj) {
  return function reqHandler(req, res, next) {
    try {
      const requiredReqParts = Object.keys(paramsObj);

      // loop through params sources (body && params, both optional)
      for (let i = 0; i < requiredReqParts.length; i += 1) {
        const thisSource = requiredReqParts[i];
        const expectedKeys = paramsObj[thisSource];

        /*
          loop through expected keys
          && assure the expected key is present in request source data
        */
        for (let ek = 0; ek < expectedKeys.length; ek += 1) {
          const thisExpectedKey = expectedKeys[ek];
          if (!req[thisSource][thisExpectedKey]) {
            return res.status(422).json({ Error: 'missing required params' });
          }
        }
      }
      return next();
    } catch (error) {
      console.log('assertParams Error:');
      console.log(error.message);
      console.log(error);

      throw new Error(error);
    }
  };
}

module.exports = {
  assertParams,
};
