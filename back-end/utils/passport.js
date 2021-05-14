const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const passport = require("passport");
const Users = require("../models/UsersModel");
require("dotenv").config();
const redis = require("redis");
const client = redis.createClient({ detect_buffers: true });

// Setup work and export for the JWT passport strategy
function auth() {
  var opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };

  // TODO:- Kafka Implementation of passport

  // passport.use(
  //   new JwtStrategy(opts, (jwtPayload, callback) => {
  //     const { _id } = jwtPayload;
  //     kafka.make_request(
  //       "reddit-auth-topic",
  //       { path: "user-auth", body: _id },
  //       function (err, results) {
  //         console.log("err ", err);
  //         console.log("result ", results);
  //         if (err) {
  //           console.log(err);
  //           return callback(err.data, false);
  //         } else {
  //           console.log("********* passport auth!!! ******");
  //           return callback(null, true);
  //         }
  //       }
  //     );
  //   })
  // );

  // Without kafka Implementation
  passport.use(
    new JwtStrategy(opts, (decodedPayload, callback) => {
      console.log(decodedPayload);
      const user_id = decodedPayload._id;
      client.get(user_id, function (err, user) {
        console.log("REDIS", user);
        console.log(user_id);
        if (user) {
          console.log("Coming here ", user);
          user = JSON.parse(user);
          callback(null, user);
          return;
        }
        Users.findById(user_id, "name email", (error, user) => {
          console.log(user, "HERE");
          if (error) {
            return callback(error, false);
          } else if (user) {
            //client.setex("user",6000,user);
            console.log("Key not found ", user);
            client.set(user_id, JSON.stringify(user));
            callback(null, user);
          } else {
            callback(null, false);
          }
        });
      });
    })
  );
}

// Appending the user data in all incoming requests to backend
const checkAuth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (error, user, info) => {
    if (error || !user) {
      const error = {
        errorMessage: "Please login to continue",
      };
      return res.status(401).json(error);
    } else {
      req.user = user;
    }
    return next();
  })(req, res, next);
};

exports.auth = auth;
exports.checkAuth = checkAuth;
