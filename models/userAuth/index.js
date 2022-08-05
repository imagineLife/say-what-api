const crypto = require('crypto');
const { Crud } = require('../crud');

class UserAuth extends Crud {
  constructor(props) {
    super(props);
    this.db = props.db;
    this.collectionName = props.collection;
    this.registration_exp_duration = 60 * 60 * 1000;
    this.hashType = 'sha512';
    this.isAnEmailString = (str) =>
      String(str)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    this.requestPwReset = () => `UserAuth requestPwReset Here`;
  }

  async createOne(obj) {
    if (!this.isAnEmailString(obj.email)) {
      throw new Error(
        `Cannot call UserAuth createOne without a valid email address`
      );
    }
    try {
      return await this.collection.insertOne({
        ...obj,
        _id: obj.email,
      });
    } catch (e) {
      console.log(`${this.collectionName} createOne error`);
      throw new Error(e);
    }
  }

  oneHourFromNow() {
    const now = this.nowUTC();
    const nowParsed = Date.parse(now);
    const inOneHour = nowParsed + this.registration_exp_duration;
    return new Date(inOneHour);
  }

  registrationExpired(timeToCheck) {
    const curTime = this.nowUTC();
    return (
      Date.parse(timeToCheck) <
      Date.parse(curTime) - this.registration_exp_duration
    );
  }

  /*
    Allow user-registration (see functionalities/USER_REGISTRATION.md) for more deets
    FIRST STEP in user-registration
    - Create a user account
    - create a registration_expires date
    - create an registration_token or something...
    - send an email to the user with a unique code for them to enter here
  */
  async registerEmail({ email }) {
    if (!this.isAnEmailString(email)) {
      throw new Error(
        `Cannot call registerEmail without a valid email address`
      );
    }

    try {
      const newUser = await this.createOne({
        email,
        created_date: this.nowUTC(),
        registration_expires: this.oneHourFromNow(),
      });

      return newUser;
    } catch (e) {
      console.log('userAuth registerEmail Error');
      console.log(e.message);
      console.log(e);
      throw new Error(e);
    }
  }

  hashVal(str) {
    return crypto.createHash(this.hashType).update(str).digest('hex');
  }

  /*
    SECOND STEP in user-registration process
    - check token match
    - check time is before registration_expires date
    - creates create_pw_token or something...

    ALSO
    - used when user "forgets" or wants to "reset" their pw...hmm
  */
  async validateEmail({ email }) {
    if (!this.isAnEmailString(email)) {
      throw new Error(
        `Cannot call validateEmail without a valid email address`
      );
    }

    const foundUser = await this.readOne(
      { _id: email },
      { registration_expires: 1 }
    );

    if (!foundUser) return false;

    // check if this is during registration workflow
    if (
      foundUser?.registration_expires &&
      this.registrationExpired(foundUser.registration_expires)
    ) {
      return 'expired';
    }
    return true;
  }

  /*
    Create a pw
    - sets pw field in user
    - sets last_updated
  */
  async setPW(params) {
    if (!params.email || !params.pw) {
      throw new Error('cannot call UserAuth.setPW without email or pw');
    }

    /*
      - remove registrationExpired field
      - set pw with hashed val
      - set last_updated to now
      - set last_updated_by ?!
    */
    const now = this.nowUTC();
    const newPW = this.hashVal(params.pw);

    // mongo docs
    const selectDoc = { _id: params.email };
    const updateDoc = [
      {
        $set: {
          lats_updated: now,
          pw: newPW,
        },
      },
      {
        $unset: 'registration_expired',
      },
    ];

    try {
      return await this.updateOne(selectDoc, updateDoc);
    } catch (e) {
      console.log(`UserAuth setPW Error`);
      throw new Error(e);
    }
  }

  async validatePW(params) {
    if (!params.email || !params.pw) {
      throw new Error('cannot call UserAuth.validatePW without email or pw');
    }

    const userPW = this.hashVal(params.pw);
    const res = await this.readOne({ _id: params.email }, { _id: 0, pw: 1 });
    return userPW === res.pw;
  }

  /*
    SIMILAR to the "validateEmail" 
      but instead of registration_expires
      use pw_reset_expires
    - sets account_locked
    - set a pw_reset_token
    - set pw_reset_expires
    - sends email with button to reset pw or something?!
  */
  // requestPwReset() {
  //   return `UserAuth requestPwReset Here`;
  // }
}

module.exports = {
  UserAuth,
};
