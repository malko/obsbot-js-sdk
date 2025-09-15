const mockTinyDevice = {
    getSn: jest.fn(() => 'TINY1234567890'),
    getName: jest.fn(() => 'OBSBOT Tiny 4K'),
    getProductType: jest.fn(() => 1), // ObsbotProdTiny4k
    gimbalReset: jest.fn(() => 0),
    setAiMode: jest.fn(() => 0),
    getCapabilities: jest.fn(() => ({
        zoom: { min: 100, max: 400, default: 100, step: 1 },
        brightness: { min: 0, max: 100, default: 50, step: 1 },
    })),
};

const mockMeetDevice = {
    getSn: jest.fn(() => 'MEET1234567890'),
    getName: jest.fn(() => 'OBSBOT Meet 4K'),
    getProductType: jest.fn(() => 6), // ObsbotProdMeet4k
    gimbalReset: jest.fn(() => 0),
    setMediaMode: jest.fn(() => 0),
    getCapabilities: jest.fn(() => ({
        zoom: { min: 100, max: 200, default: 100, step: 1 },
        brightness: { min: 0, max: 100, default: 50, step: 1 },
    })),
};

const mockDevices = [mockTinyDevice, mockMeetDevice];

module.exports = {
    initSDK: jest.fn(() => 0),
    deinitSDK: jest.fn(() => 0),
    getDevList: jest.fn(() => mockDevices),
    setDevChangedCallback: jest.fn(),
    Device: jest.fn(), // Mock constructor
};
