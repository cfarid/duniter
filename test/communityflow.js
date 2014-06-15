var should   = require('should');
var assert   = require('assert');
var async    = require('async');
var sha1     = require('sha1');
var fs       = require('fs');
var mongoose = require('mongoose');
var parsers  = require('../app/lib/streams/parsers/doc');
var ucoin    = require('./..');

var CommunityFlow = mongoose.model('CommunityFlow', require('../app/models/communityflow'));
var rawCF = fs.readFileSync(__dirname + "/data/communityflows/cat.flow", "utf8") +
            fs.readFileSync(__dirname + "/data/communityflows/cat.flow.asc", "utf8");

describe('Community flow', function(){

  describe('signed by cat', function(){

    var entry;

    before(function(done) {
      var parser = parsers.parseCommunityFlow().asyncWrite(rawCF, function (err, obj) {
        entry = new CommunityFlow(obj);
        done(err);
      });
    });

    it('should be version 1', function(){
      assert.equal(entry.version, 1);
    });

    it('should have beta_brousoufs currency name', function(){
      assert.equal(entry.currency, 'beta_brousouf');
    });

    it('should have key', function(){
      assert.equal(entry.issuer, 'C73882B64B7E72237A2F460CE9CAB76D19A8651E');
    });

    it('should have date', function(){
      should.exist(entry.date);
    });

    it('its computed hash should be FEDBD536DC987968D36C2C69F7A3CC6698BFBADF', function(){
      assert.equal(entry.hash, 'FEDBD536DC987968D36C2C69F7A3CC6698BFBADF');
    });

    it('its manual hash should be A3EDCD9434938A0745C08DBD13FE436BE32053FB', function(){
      assert.equal(sha1(entry.getRaw()).toUpperCase(), 'A3EDCD9434938A0745C08DBD13FE436BE32053FB');
    });

    it('its manual signed hash should be FEDBD536DC987968D36C2C69F7A3CC6698BFBADF', function(){
      assert.equal(sha1(entry.getRawSigned()).toUpperCase(), 'FEDBD536DC987968D36C2C69F7A3CC6698BFBADF');
    });
  });
});

function loadFromFile(entry, file, done) {
  fs.readFile(file, {encoding: "utf8"}, function (err, data) {
    if(fs.existsSync(file + ".asc")){
      data += fs.readFileSync(file + '.asc', 'utf8');
    }
    // data = data.unix2dos();
    async.waterfall([
      function (next){
        entry.parse(data, next);
      },
      function (entry, next){
        entry.verify('beta_brousouf', next);
      }
    ], done);
  });
}
