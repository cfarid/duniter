var should   = require('should');
var mongoose = require('mongoose');
var assert   = require('assert');
var async    = require('async');
var sha1     = require('sha1');
var fs       = require('fs');
var parsers  = require('../../app/lib/streams/parsers/doc');
var ucoin    = require('../..');

var Voting = mongoose.model('Voting', require('../../app/models/voting'));
var rawVoting = "" +
  "Version: 1\r\n" +
  "Currency: beta_brousouf\r\n" +
  "Registry: VOTING\r\n" +
  "Issuer: 405715EC64289D1F43808F57EC51F273CBC0FA17\r\n" +
  "Date: 1402836803\r\n" +
  "AmendmentNumber: 0\r\n" +
  "AmendmentHash: 1F747250395C6AE7C3CF4BB094F007151D5AB188\r\n";

describe('Voting', function(){

  var vt;

  before(function(done) {
    var parser = parsers.parseVoting().asyncWrite(rawVoting, function (err, obj) {
      vt = new Voting(obj);
      done(err);
    });
  });

  it('should be version 1', function(){
    assert.equal(vt.version, 1);
  });

  it('should have beta_brousoufs currency name', function(){
    assert.equal(vt.currency, 'beta_brousouf');
  });

  it('should have registry VOTING', function(){
    assert.equal(vt.type, 'VOTING');
  });

  it('should have good issuer', function(){
    assert.equal(vt.issuer, '405715EC64289D1F43808F57EC51F273CBC0FA17');
  });

  it('should have good date', function(){
    assert.equal(vt.date.timestamp(), 1402836803);
  });

  it('its computed hash should be CEA87B744CE437CE2E8FE09AFCA028950C32D15A', function(){
    assert.equal(vt.hash, 'CEA87B744CE437CE2E8FE09AFCA028950C32D15A');
  });

  it('its manual hash should be CEA87B744CE437CE2E8FE09AFCA028950C32D15A', function(){
    assert.equal(sha1(vt.getRaw()).toUpperCase(), 'CEA87B744CE437CE2E8FE09AFCA028950C32D15A');
  });
});
