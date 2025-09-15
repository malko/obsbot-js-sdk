const obsbot = require('../src/index.js');

describe('Device Classes', () => {
  let tinyDevice;
  let meetDevice;

  beforeAll(() => {
    const devices = obsbot.getDevList();
    tinyDevice = devices.find(d => d instanceof obsbot.TinyDevice);
    meetDevice = devices.find(d => d instanceof obsbot.MeetDevice);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('BaseDevice', () => {
    it('should call native getSn', () => {
      const sn = tinyDevice.getSn();
      expect(tinyDevice._native.getSn).toHaveBeenCalledTimes(1);
      expect(sn).toBe('TINY1234567890');
    });

    it('should call native getCapabilities', () => {
      const caps = tinyDevice.getCapabilities();
      expect(tinyDevice._native.getCapabilities).toHaveBeenCalledTimes(1);
      expect(caps).toHaveProperty('zoom');
    });
  });

  describe('TinyDevice', () => {
    it('should have Tiny-specific methods', () => {
      expect(tinyDevice.setAiMode).toBeInstanceOf(Function);
    });

    it('should not have Meet-specific methods', () => {
      expect(tinyDevice.setMediaMode).toBeUndefined();
    });

    it('should call native setAiMode', () => {
      tinyDevice.setAiMode(obsbot.TinyDevice.AiWorkMode.Human);
      expect(tinyDevice._native.setAiMode).toHaveBeenCalledWith(2, undefined);
    });
  });

  describe('MeetDevice', () => {
    it('should have Meet-specific methods', () => {
      expect(meetDevice.setMediaMode).toBeInstanceOf(Function);
    });

    it('should not have Tiny-specific methods', () => {
      expect(meetDevice.setAiMode).toBeUndefined();
    });

    it('should call native setMediaMode', () => {
      meetDevice.setMediaMode(obsbot.MeetDevice.MediaMode.AutoFrame);
      expect(meetDevice._native.setMediaMode).toHaveBeenCalledWith(2);
    });
  });
});
