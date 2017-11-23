'use strict';

const sinon = require('sinon');
const Q = require ('q');
const uut = require('../home_actions_helper');

describe("HomeActionsHelper", function() {
  describe(".repeatCommands", function() {
    let callback = sinon.spy();
    let times = 1, delay = 100;

    beforeEach(function () {
      sinon.stub(process, 'nextTick').yields();
    });
    afterEach(function () {
      process.nextTick.restore();
    });

    describe("callback", function() {
      it("repeats the correct number of times", function() {
        uut.repeatCommands(times, delay, callback).then((a) => {
          expect(callback.callCount).toBe(times);
        });
      });
    });

    describe("delay", function() {
      let delaySpy = sinon.spy(Q, 'delay');
      it("executes without intial delay", function() {
        uut.repeatCommands(times, delay, callback).then((a) => {
          expect(delaySpy.withArgs(delay).callCount).toBe(times - 1);
        });
      });
   
      it("executes executes delay times - 1", function() {
        let times = 3;
        uut.repeatCommands(times, delay, callback).then((a) => {
          expect(delaySpy.withArgs(delay).callCount).toBe(times - 1);
        });
      });
    }); 
  });
});