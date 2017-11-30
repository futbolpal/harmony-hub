'use strict';

const Q = require("q");
const rewire = require("rewire");
const sinon = require('sinon');

const uut = rewire('../hub_state')

const stubResolvedPromise = (resolveWith) => {
  return () => {
    let d = Q.defer();
    d.resolve(resolveWith);
    return d.promise;
  }
}
const stubRejectedPromise = (rejectWith) => {
  return () => {
    let d = Q.defer();
    d.reject(rejectWith);
    return d.promise;
  }
}

describe("HubState", function() {
  let sandbox = sinon.sandbox.create();
  let hub;

  beforeEach(function(){
    hub  = {
      state : {
        devices: [{id: 'device-id', label: 'device-name'}]
      }
    } 
  });

  afterEach(function(){
    sandbox.restore();
  });

  describe("#executeCommand", function() {
    let executeCommand = uut.__get__("executeCommand");
   
    let device = 'TV';
    let command = 'PowerOn';   
    let isDevice = true;

    it("does not executeCommand when in simulation", function(done){
      let simulation = true;
      executeCommand(hub, simulation, isDevice, device, command).then((result) => {
        expect(result).toEqual("Simulated command");
        done();
      });
    });

    it("executes command", function(){
      let simulation = false;
      hub.executeCommand = sandbox.stub();
      executeCommand(hub, simulation, isDevice, device, command);
      expect(hub.executeCommand.withArgs(isDevice, device, command).calledOnce).toBeTrue(); 
    });
  });

  describe("#deviceById", function() {
    let deviceById = uut.__get__("deviceById");
    it("returns null when device is not found", function(){
      expect(deviceById(hub, 'some-id')).toBeNull();
    });

    it("returns a device object when the device is found", function(){
      expect(deviceById(hub, 'device-id')).toBe(hub.state.devices[0]);
    });
  });

  describe("#deviceByName", function() {
    let deviceByName = uut.__get__("deviceByName");
 
    it("returns null when device is not found", function(){
      expect(deviceByName(hub, 'some-name')).toBeNull();
    });
    it("returns a device object when the device is found", function(){
      expect(deviceByName(hub, 'device-name')).toBe(hub.state.devices[0]);
    });
  });

  describe("#forceDefaultRemote", function() {
    let forceDefaultRemote = uut.__get__("forceDefaultRemote");
    let currentActivity;

    beforeEach(function(){
      hub.readCurrentActivity = sandbox.stub().callsFake(() => {
        return stubResolvedPromise(currentActivity)();
      });
      hub.executeActivity = sandbox.stub().callsFake(stubResolvedPromise('i did it'));
    });

    describe("when activity is 'PowerOff'", function(){
      beforeEach(function(){
        currentActivity = "PowerOff";
      });

      it("changes the activity to Default", function(done){
        forceDefaultRemote(hub).then(() => {
          expect(hub.executeActivity.withArgs("Default").calledOnce).toBeTrue();
          done();
        });
      });
    });

    describe("when activity is not 'PowerOff'", function(){
      beforeEach(function(){
        currentActivity = "MyCrazyActivity";
      });

      it("does not change the activity", function(done){
        forceDefaultRemote(hub).fail(() => {
          expect(hub.executeActivity.notCalled).toBeTrue();
          done();
        });
      });
    });
  });

  describe("#listDevices", function() {
    let listDevices = uut.__get__("listDevices");
    let getAvailableCommandsResponse = {
      device: []
    }

    beforeEach(function(){
      hub._harmonyClient = {
        getAvailableCommands: sandbox.stub().callsFake(stubResolvedPromise(getAvailableCommandsResponse))
      }
    }); 
    it("returns a promise", function(){
      expect(listDevices(hub)).toBePromise();
    });

    describe("when promise resolves", function(){
      it("returns an array of devices", function(done){
        listDevices(hub).then((devices) => {
          expect(devices).toEqual([]);
          done();
        });
      });
    });
  });

  describe(".init", function() {
    it("returns a promise", function(){
      expect(uut.init('my-ip')).toBePromise();
    });

    describe("when hub fails to initialize", function(){
    });

    describe("when hub initializes", function(){
    });
  });
}); 
