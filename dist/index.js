(() => {
  const e = {
      372: (e, t, o) => {
        const { MongoClient: r } = o(13);
          const { GLOBAL_STATE: s } = o(97);
          const { DB: n } = o(103);
        e.exports = {
          makeConnectionString ({
            username: e,
            pw: t,
            host: o,
            port: r,
            authDB: s,
          }) {
            if (void 0 === o || void 0 === r)
              throw (
                (console.log(`missing vars: host: ${o}, port: ${r}`),
                'Cannot create db connection with missing param')
              );
            if (!(process.env.MONGO_AUTH || (e && t && s)))
              throw (
                (console.log('Expected auth connection to db'),
                'Cannot create db connection with missing param')
              );
            return process?.env?.MONGO_AUTH?.toString() === 'false'
              ? `mongodb://${o}:${r}/?connectTimeoutMS=2500`
              : `mongodb://${e}:${t}@${o}:${r}/?authSource=${s}`;
          },
        };
      },
      343: (e) => {
        e.exports = {
          routes: {
            HEALTH_CHECK: '/health-check',
            DB: {
              KILL: '/kill',
              RESTART: '/restart',
              ROOT: '/db',
              STATUS: '/status',
            },
            USERS: { ROOT: '/users', BY_ID: '/:userId', AUTH: '/auth' },
            SPEECHES: { ROOT: '/speeches', BY_ID: '/:speechId' },
          },
          db: {
            NAME: 'SayWhat',
            collections: { USERS: 'Users', SPEECHES: 'Speeches' },
          },
        };
      },
      305: (e, t, o) => {
        const { EventEmitter: r } = o(239);
          const s = o(607);
        function n(e) {
          s.MONGO_CONNECTED = e;
        }
        const c = new r();
        c.on('DB_DISCONNECT', n),
          c.on('DB_CONNECT', n),
          (e.exports = { ServicesEmitter: c, setConnected: n });
      },
      97: (e, t, o) => {
        const r = o(607);
          const s = o(305);
          const n = o(343);
        e.exports = { GLOBAL_STATE: r, ServicesEmitter: s, routes: n.routes };
      },
      607: (e) => {
        e.exports = {
          MONGO_CONNECTED: !1,
          MONGO_CLIENT: null,
          DBS: { SayWhat: !1 },
          Collections: { Users: !1, Speeches: !1 },
        };
      },
      614: (e, t, o) => {
        const r = o(260);
        e.exports = { twoAreEqual: r };
      },
      260: (e) => {
        e.exports = function (e, t) {
          return e === t;
        };
      },
      10: (e, t, o) => {
        e = o.nmd(e);
        const { twoAreEqual: r } = o(614);
          const { expressObj: s, startServer: n, setupDB: c } = o(687);
          const { Crud: a } = o(103);
          const { ServicesEmitter: i } = o(97);
          const {
            db: {
              NAME: l,
              collections: { USERS: u },
            },
          } = o(343);
        const h = o(97);
        async function p() {
          try {
            if (!process.env.DB || !0 === process.env.DB) {
              const e = {
                username: process.env.MONGO_DB_USER,
                pw: process.env.MONGO_DB_PW,
                host: process.env.MONGO_DB_HOST,
                port: process.env.MONGO_DB_PORT,
                authDB: process.env.MONGO_DB_AUTH_DB,
              };
              const t = (await c({ ...e })).registerDB(process.env.DB_NAME || l);
                const o = new a({ db: t, collection: u });
              h.GLOBAL_STATE.Collections.Users = o;
            }
            n(s);
          } catch (e) {
            console.log(e);
          }
        }
        r(o.c[o.s], e) && p(), (e.exports = { startServer: n, startApi: p });
      },
      778: (e) => {
        e.exports = {
          assertParams (e) {
            return function (t, o, r) {
              try {
                const s = Object.keys(e);
                for (let r = 0; r < s.length; r++) {
                  const n = s[r];
                    const c = e[n];
                  for (let e = 0; e < c.length; e++) {
                    const r = c[e];
                    if (!t[n][r])
                      return o
                        .status(422)
                        .json({ Error: 'missing required params' });
                  }
                }
                return r();
              } catch (e) {
                throw (
                  (console.log('assertParams Error:'),
                  console.log(e.message),
                  console.log(e),
                  new Error(e))
                );
              }
            };
          },
        };
      },
      653: (e) => {
        e.exports = function (e, t, o) {
          console.log('adminAuth MW'), o();
        };
      },
      161: (e) => {
        e.exports = function (e, t, o) {
          console.log('auth mw'), o();
        };
      },
      533: (e, t, o) => {
        const r = o(653);
          const s = o(161);
        e.exports = { adminAuth: r, auth: s };
      },
      961: (e, t, o) => {
        const { GLOBAL_STATE: r } = o(97);
        e.exports = {
          checkForDbConnection (e, t, o) {
            const s = !e.path.match('^/db');
              const n = !e.path.match('^/health-check');
              const c = !0 !== r?.MONGO_CLIENT?.topology?.isConnected();
            if (s && n && c)
              return t
                .status(500)
                .send({ Error: 'Server Error, try again shortly' });
            o();
          },
        };
      },
      546: (e, t, o) => {
        const { assertParams: r } = o(778);
          const { auth: s, adminAuth: n } = o(533);
          const { checkForDbConnection: c } = o(961);
        e.exports = {
          adminAuth: n,
          assertParams: r,
          auth: s,
          checkForDbConnection: c,
        };
      },
      180: (e, t, o) => {
        const { DB: r } = o(135);
        e.exports = {
          Crud: class extends r {
            constructor(e) {
              super(e),
                (this.db = e.db),
                (this.collectionName = e.collection),
                (this.collection = this.db.collection(e.collection));
            }

            nowUTC() {
              return new Date(new Date().toUTCString());
            }

            async createOne(e) {
              try {
                return await this.collection.insertOne(e);
              } catch (e) {
                throw (
                  (console.log(`${this.collectionName} createOne error`),
                  new Error(e))
                );
              }
            }

            async readOne(e, t = {}) {
              try {
                return await this.collection.findOne(e, { projection: t });
              } catch (e) {
                throw (
                  (console.log(`${this.collectionName} readOne error`),
                  new Error(e))
                );
              }
            }

            async readMany(e = {}, t = {}) {
              try {
                const o = await this.collection.find(e, { projection: t });
                return await o.toArray();
              } catch (e) {
                throw (
                  (console.log(`${this.collectionName} readMany error`),
                  new Error(e))
                );
              }
            }

            async updateOne(e, t) {
              if (!e || !t)
                throw new Error(
                  `Cannot call ${this.collectionName}.updateOne without 2 object params: 1 the find obj, 2 the update obj`
                );
              try {
                return await this.collection.updateOne(e, t);
              } catch (e) {
                throw (
                  (console.log(`${this.collectionName} updateOne error`),
                  new Error(e))
                );
              }
            }

            async deleteOne(e) {
              if (!e)
                throw new Error(
                  `Cannot call ${this.collectionName}.deleteOne without an object param`
                );
              if (!e.id)
                throw new Error(
                  `Cannot call ${this.collectionName}.deleteOne without 'id' key`
                );
              try {
                return await this.collection.deleteOne({ _id: e.id });
              } catch (e) {
                throw (
                  (console.log(`${this.collectionName} deleteOne error`),
                  new Error(e))
                );
              }
            }

            async remove() {
              try {
                return await this.collection.drop();
              } catch (e) {
                throw (
                  (console.log(`${this.collectionName} drop error`),
                  new Error(e))
                );
              }
            }
          },
        };
      },
      135: (e, t, o) => {
        const { MongoClient: r } = o(13);
          const { GLOBAL_STATE: s } = o(97);
        e.exports = {
          DB: class {
            constructor({ connectionObj: e }) {
              (this.connectionObj = e), (this.client = null), (this.db = null);
            }

            async connect() {
              try {
                const e = o(372).makeConnectionString(this.connectionObj);
                return (
                  (this.client = new r(e)),
                  await this.client.connect(),
                  (s.MONGO_CONNECTED = !0),
                  (s.MONGO_CLIENT = this.client),
                  console.log(
                    `SERVER: Connected to mongo db on ${this.connectionObj.host}:${this.connectionObj.port}`
                  ),
                  this.client
                );
              } catch (e) {
                console.log('DB Class connect method error:'), console.log(e);
              }
            }

            async close() {
              await this.client.close(),
                console.log(
                  `CLOSED db connection on ${this.connectionObj.host}:${this.connectionObj.port}`
                );
            }

            registerDB(e) {
              if (!this.client)
                throw new Error(
                  'attempted to registerDB without building a client: use setupDB or "new DB()" to connect to a mongo instance'
                );
              if (!e) throw new Error('missing db name string param');
              return (this.db = this.client.db(e)), this.db;
            }

            async getAndLogDBs() {
              const e = await this.client.db().admin().listDatabases();
              const { databases: t } = e;
              return console.table(t), t;
            }
          },
        };
      },
      103: (e, t, o) => {
        const { DB: r } = o(135);
          const { Crud: s } = o(180);
          const { UserAuth: n } = o(917);
        e.exports = { DB: r, Crud: s, UserAuth: n };
      },
      917: (e, t, o) => {
        const { Crud: r } = o(180);
          const s = o(113);
        e.exports = {
          UserAuth: class extends r {
            constructor(e) {
              super(e),
                (this.db = e.db),
                (this.collectionName = e.collection),
                (this.registration_exp_duration = 36e5),
                (this.hashType = 'sha512');
            }

            async createOne(e) {
              if (!this.isAnEmailString(e.email))
                throw new Error(
                  'Cannot call UserAuth createOne without a valid email address'
                );
              try {
                return await this.collection.insertOne({ ...e, _id: e.email });
              } catch (e) {
                throw (
                  (console.log(`${this.collectionName} createOne error`),
                  new Error(e))
                );
              }
            }

            isAnEmailString(e) {
              return String(e)
                .toLowerCase()
                .match(
                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                );
            }

            oneHourFromNow() {
              const e = this.nowUTC();
                const t = Date.parse(e) + this.registration_exp_duration;
              return new Date(t);
            }

            registrationExpired(e) {
              const t = this.nowUTC();
              return (
                Date.parse(e) < Date.parse(t) - this.registration_exp_duration
              );
            }

            async registerEmail({ email: e }) {
              if (!this.isAnEmailString(e))
                throw new Error(
                  'Cannot call registerEmail without a valid email address'
                );
              try {
                return await this.createOne({
                  email: e,
                  created_date: this.nowUTC(),
                  registration_expires: this.oneHourFromNow(),
                });
              } catch (e) {
                throw (
                  (console.log('userAuth registerEmail Error'),
                  console.log(e.message),
                  console.log(e),
                  new Error(e))
                );
              }
            }

            hashVal(e) {
              return s.createHash(this.hashType).update(e).digest('hex');
            }

            async validateEmail({ email: e }) {
              if (!this.isAnEmailString(e))
                throw new Error(
                  'Cannot call validateEmail without a valid email address'
                );
              const t = await this.readOne(
                { _id: e },
                { registration_expires: 1 }
              );
              return (
                !!t &&
                (!t?.registration_expires ||
                  !this.registrationExpired(t.registration_expires) ||
                  'expired')
              );
            }

            async setPW(e) {
              if (!e.email || !e.pw)
                throw new Error(
                  'cannot call UserAuth.setPW without email or pw'
                );
              const t = this.nowUTC();
                const o = this.hashVal(e.pw);
                const r = { _id: e.email };
                const s = [
                  { $set: { lats_updated: t, pw: o } },
                  { $unset: 'registration_expired' },
                ];
              try {
                return await this.updateOne(r, s);
              } catch (e) {
                throw (console.log('UserAuth setPW Error'), new Error(e));
              }
            }

            async validatePW(e) {
              if (!e.email || !e.pw)
                throw new Error(
                  'cannot call UserAuth.validatePW without email or pw'
                );
              return (
                this.hashVal(e.pw) ==
                (await this.readOne({ _id: e.email }, { _id: 0, pw: 1 })).pw
              );
            }

            requestPwReset() {
              return 'UserAuth requestPwReset Here';
            }
          },
        };
      },
      225: (e, t, o) => {
        const r = o(45);
          const s = o(319);
          const n = o(805);
          const c = o(860).Router();
          const {
            routes: {
              DB: { KILL: a, RESTART: i, STATUS: l },
            },
          } = o(343);
        c.get(l, n), c.get(a, r), c.get(i, s), (e.exports = c);
      },
      45: (e, t, o) => {
        const { ServicesEmitter: r } = o(305);
          const s = o(607);
        e.exports = async function (e, t, o) {
          r.emit('DB_DISCONNECT', !1),
            await s.MONGO_CLIENT.topology.close(),
            t
              .status(200)
              .send({ MONGO_CONNECTED: s.MONGO_CLIENT.topology.isConnected() });
        };
      },
      319: (e, t, o) => {
        const { ServicesEmitter: r } = o(305);
          const s = o(607);
        e.exports = async function (e, t) {
          try {
            await s.MONGO_CLIENT.connect(),
              r.emit('DB_CONNECT', !0),
              t
                .status(200)
                .send({
                  MONGO_CONNECTED:
                    s.MONGO_CLIENT.topology.s.state === 'connected',
                });
          } catch (e) {
            console.log('restart handler err:'),
              console.log(e),
              t.status(500).send({ Error: 'server error' });
          }
        };
      },
      805: (e, t, o) => {
        const r = o(607);
        e.exports = function (e, t, o) {
          t.status(200).send({
            MONGO_CONNECTED: r.MONGO_CLIENT.topology.isConnected(),
          });
        };
      },
      820: (e, t, o) => {
        const r = o(860).Router();
        r.get('/', (e, t) => {
          t.status(200).send('server is up & running!');
        }),
          (e.exports = r);
      },
      310: (e, t, o) => {
        const r = o(860).Router();
          const {
            routes: { DB: s, HEALTH_CHECK: n, SPEECHES: c, USERS: a },
          } = o(343);
          const i = o(820);
          const l = o(225);
          const u = o(342);
          const h = o(408);
        r.use(s.ROOT, l),
          r.use(n, i),
          r.use(c.ROOT, u),
          r.use(a.ROOT, h),
          (e.exports = r);
      },
      626: (e, t, o) => {
        const {
            GLOBAL_STATE: { Collections: r },
          } = o(97);
          const s = o(13).ObjectId;
        e.exports = async function (e, t, o) {
          try {
            const { speechId: o } = e.params;
              const n = await r.Speeches.readOne({ _id: s(o) });
            return delete n._id, t.status(200).json(n);
          } catch (e) {
            return (
              console.log('getById Error'),
              console.log(e),
              t.status(500).json({ Error: 'get speech by id' })
            );
          }
        };
      },
      249: (e, t, o) => {
        const r = o(860).Router({ mergeParams: !0 });
          const s = o(626);
        r.get('/', s), (e.exports = r);
      },
      342: (e, t, o) => {
        const r = o(860).Router({ mergeParams: !0 });
          const {
            routes: { SPEECHES: s },
          } = o(343);
          const n = o(695);
          const c = o(249);
        r.use('/:speechId', c), r.use('/?', n), (e.exports = r);
      },
      734: (e, t, o) => {
        const { GLOBAL_STATE: r } = o(97);
        e.exports = async function (e, t, o) {
          try {
            const e = await r.Collections.Speeches.readMany();
            return t.status(200).json(e);
          } catch (e) {
            return (
              console.log('getSpeeches Error:'),
              console.log(e),
              t.status(500).json({ Error: 'get Speeches error' })
            );
          }
        };
      },
      695: (e, t, o) => {
        const r = o(860).Router();
          const s = o(734);
          const n = o(12);
          const { assertParams: c } = o(546);
        r.get('/', s),
          r.post('/', c({ body: ['orator', 'date', 'text'] }), n),
          (e.exports = r);
      },
      12: (e, t, o) => {
        const {
          GLOBAL_STATE: { Collections: r },
        } = o(97);
        e.exports = async function (e, t, o) {
          try {
            const { orator: o, text: s, date: n } = e.body;
            console.log({ orator: o, text: s, date: n }),
              console.log('Collections.Speeches'),
              console.log(r.Speeches);
            const c = await r.Speeches.createOne({ orator: o, text: s, date: n });
            return (
              console.log('dbRes'),
              console.log(c),
              t.status(200).json('success')
            );
          } catch (e) {
            return (
              console.log('post speeches Error'),
              console.log(e.message),
              t.status(500).json({ Error: 'Server error' })
            );
          }
        };
      },
      210: (e) => {
        e.exports = function (e, t, o) {
          return t.status(200).json(`getById: ${e.params.userId}`);
        };
      },
      7: (e, t, o) => {
        const r = o(860).Router({ mergeParams: !0 });
          const s = o(210);
          const n = o(363);
        r.get('/', s), r.patch('/', n), (e.exports = r);
      },
      363: (e) => {
        e.exports = function (e, t, o) {
          return t.status(200).send('post user by id');
        };
      },
      408: (e, t, o) => {
        const r = o(860).Router({ mergeParams: !0 });
          const {
            routes: { USERS: s },
          } = o(343);
          const n = o(475);
          const c = o(7);
        r.use(s.BY_ID, c), r.use('/?', n), (e.exports = r);
      },
      398: (e) => {
        e.exports = function (e, t, o) {
          return t.status(200).send('get users');
        };
      },
      475: (e, t, o) => {
        const r = o(860).Router({ mergeParams: !0 });
          const s = o(398);
          const n = o(171);
          const { assertParams: c } = o(546);
        r.get('/', s),
          r.post('/', c({ body: ['email', 'first'] }), n),
          (e.exports = r);
      },
      171: (e, t, o) => {
        const {
          GLOBAL_STATE: { Collections: r },
        } = o(97);
        e.exports = async function (e, t, o) {
          try {
            const {
                body: { first: o, email: s },
              } = e;
              const { Users: n } = r;
            return (
              await n.createOne({ email: s, first: o }),
              t.status(200).json({ works: 'qwer' })
            );
          } catch (e) {
            console.log('postUsers error:'),
              console.log(e.message),
              t.status(500).json({ Error: 'postUsers error' });
          }
        };
      },
      937: (e, t, o) => {
        const r = o(860);
          const s = o(310);
          const n = o(986);
          const { GLOBAL_STATE: c, ServicesEmitter: a } = o(97);
          const { checkForDbConnection: i } = o(546);
          const l = (r.Router(), r());
        l.use(r.static('./../static')),
          l.use(n.urlencoded({ extended: !1 })),
          l.use(n.json()),
          l.use(i),
          l.use('/', s),
          (e.exports = { expressObj: l });
      },
      687: (e, t, o) => {
        const { expressObj: r } = o(937);
          const { startServer: s, stopServer: n, logIfTrue: c, setupDB: a } = o(442);
        e.exports = {
          expressObj: r,
          startServer: s,
          stopServer: n,
          logIfTrue: c,
          setupDB: a,
        };
      },
      442: (e, t, o) => {
        e = o.nmd(e);
        const { twoAreEqual: r } = o(614);
          const { DB: s } = o(103);
          const { GLOBAL_STATE: n } = o(97);
          const c = process.env.PORT || 3e3;
        function a(e, t, o) {
          r(e, t) && console.log(o);
        }
        async function i(t) {
          return (
            console.log('CLOSING SERVER'),
            await t.close(a(o.c[o.s], e, 'HTTP Graceful Shutdown'))
          );
        }
        console.log('----startup env vars----'),
          console.table({ NODE_ENV: 'production', PORT: process.env.PORT }),
          (e.exports = {
            async startServer (e) {
              return (
                process.on('SIGTERM', () => {
                  i(e);
                }),
                e.listen(c, () => {
                  console.log(`SERVER: http server listening on ${c}`);
                })
              );
            },
            stopServer: i,
            logIfTrue: a,
            async setupDB (e) {
              try {
                const t = new s({
                  connectionObj: { host: e.host, port: e.port },
                });
                return await t.connect(), t;
              } catch (e) {
                console.log('setupDB fn error:'), console.log(e);
              }
            },
          });
      },
      986: (e) => {
        
        e.exports = require('body-parser');
      },
      239: (e) => {
        
        e.exports = require('events');
      },
      860: (e) => {
        
        e.exports = require('express');
      },
      13: (e) => {
        
        e.exports = require('mongodb');
      },
      113: (e) => {
        
        e.exports = require('crypto');
      },
    };
    const t = {};
  function o(r) {
    const s = t[r];
    if (void 0 !== s) return s.exports;
    const n = (t[r] = { id: r, loaded: !1, exports: {} });
    return e[r](n, n.exports, o), (n.loaded = !0), n.exports;
  }
  (o.c = t),
    (o.nmd = (e) => ((e.paths = []), e.children || (e.children = []), e)),
    o((o.s = 10));
})();
