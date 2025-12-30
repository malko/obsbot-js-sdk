import { osbotSdk as obsbot} from '../src/index.ts';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

describe('OBSBOT SDK Module', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should initialize and de-initialize the SDK', () => {
    expect(obsbot.init).not.toHaveBeenCalled();
    obsbot.init();
    expect(obsbot.native.initSDK).toHaveBeenCalledTimes(1);

    expect(obsbot.release).not.toHaveBeenCalled();
    obsbot.release();
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
