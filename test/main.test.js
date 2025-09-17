const obsbot = require('../src/index.ts');

describe('OBSBOT SDK Module', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should initialize and de-initialize the SDK', () => {
    expect(obsbot.initSDK).not.toHaveBeenCalled();
    obsbot.initSDK();
    expect(obsbot.native.initSDK).toHaveBeenCalledTimes(1);

    expect(obsbot.deinitSDK).not.toHaveBeenCalled();
    obsbot.deinitSDK();
    expect(obsbot.native.deinitSDK).toHaveBeenCalledTimes(1);
  });

  it('should return a list of wrapped device objects', () => {
    const devices = obsbot.getDevList();
    expect(obsbot.native.getDevList).toHaveBeenCalledTimes(1);
    expect(devices).toHaveLength(2);
    expect(devices[0]).toBeInstanceOf(obsbot.TinyDevice);
    expect(devices[1]).toBeInstanceOf(obsbot.MeetDevice);
  });

  it('should expose the low-level native API', () => {
    expect(obsbot.native).toBeDefined();
    expect(obsbot.native.getDevList).toEqual(expect.any(Function));
  });
});
