const {
  makeConnectionString,
} = require('.');

/*
  username,
  pw,
  host,
  port,
  authDB
*/
describe('DB Setup', () => {
  describe('makeConnectionString', () => {
    describe('fails without', () => {
      describe('host & port, required always', () => {
        it('port', () => {
          const these = {};
          these.host = 'localhost';
          expect(() => {
            makeConnectionString(these);
          }).toThrow();
        });
        it('host', () => {
          const these = {};
          these.port = '27017';
          expect(() => {
            makeConnectionString(these);
          }).toThrow();
        });
      });
      const mockProps = {};
      mockProps.username = 'water';
      mockProps.pw = 'melon';
      mockProps.host = 'chicken';
      mockProps.port = 'gritz';
      it('authDB', () => {
        expect(() => {
          makeConnectionString(mockProps);
        }).toThrow();
      });
      it('pw', () => {
        const these = { ...mockProps };
        these.authDB = 'sauce';
        delete these.pw;
        expect(() => {
          makeConnectionString(these);
        }).toThrow();
      });
      it('username', () => {
        const these = { ...mockProps };
        these.authDB = 'sauce';
        delete these.username;
        expect(() => {
          makeConnectionString(these);
        }).toThrow();
      });
    });
    describe('succeeds', () => {
      it('AUTH with all props', () => {
        const mockProps = {};
        mockProps.username = 'water';
        mockProps.pw = 'melon';
        mockProps.host = 'chicken';
        mockProps.port = 'greitz';
        mockProps.authDB = 'qwer';
        const EXPECTED_STR = `mongodb://${mockProps.username}:${mockProps.pw}@${mockProps.host}:${mockProps.port}/?authSource=${mockProps.authDB}`;
        expect(makeConnectionString(mockProps)).toBe(EXPECTED_STR);
      });
      describe('UNAUTHD with no un/pw/authDB', () => {
        beforeEach(() => {
          process.env.MONGO_AUTH = false;
        });
        it('fails', () => {
          const mockProps = {};
          mockProps.host = 'chicken';
          mockProps.port = 'gritz';
          const EXPECTED_STR = `mongodb://${mockProps.host}:${mockProps.port}/?connectTimeoutMS=2500`;
          expect(makeConnectionString(mockProps)).toBe(EXPECTED_STR);
        });
      });
    });
  });
});
