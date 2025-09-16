const obsbot = require('../src/index');

function printObject(obj, indent = '  ') {
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null) {
      console.log(`${indent}${key}:`);
      printObject(value, indent + '  ');
    } else {
      console.log(`${indent}${key}: ${value}`);
    }
  }
}

function showDeviceInfo() {
  console.log('\n--- Refreshing Device List ---');
  const devices = obsbot.getDevList();

  if (devices.length === 0) {
    console.log('No OBSBOT devices found.');
  } else {
    console.log(`Found ${devices.length} device(s):`);
    for (const device of devices) {
      console.log('\n------------------------------------');
      console.log(`Device: ${device.getName()} (SN: ${device.getSn()})`);
      console.log('------------------------------------');

      console.log('\n[Basic Info]');
      console.log(`  Product Type: ${device.getProductType()}`);
      console.log(`  Video Path: ${device.getVideoDevPath()}`);

      console.log('\n[Capabilities]');
      const capabilities = device.getCapabilities();
      printObject(capabilities);

      if (device instanceof obsbot.TinyDevice) {
        console.log('\n[Tiny AI Status]');
        const aiStatus = device.getAiStatus();
        printObject(aiStatus);
        device.setHDR(true);
      } else if (device instanceof obsbot.MeetDevice) {
        console.log('\n[Meet Status]');
        const meetStatus = device.getStatus();
        printObject(meetStatus);
      }
    }
  }
}

async function main() {
  console.log('Initializing OBSBOT SDK...');
  const initResult = obsbot.initSDK();
  if (initResult !== 0) {
    console.error('Failed to initialize SDK, error code:', initResult);
    return;
  }

  // Set a callback to be notified when devices are attached or detached.
  // This is also called for devices that are already connected on startup.
  obsbot.setDevChangedCallback((sn, attached) => {
    console.log(`\n>>> Device event: SN=${sn}, Attached=${attached} <<<`);
    // Refresh the device list whenever a change occurs.
    showDeviceInfo();
  });

  console.log('\nWatching for device changes... Press Ctrl+C to exit.');

  // The script will now wait for device events.
  // We add a handler to gracefully shut down the SDK on exit.
  process.on('SIGINT', () => {
    console.log('\nDe-initializing SDK...');
    obsbot.deinitSDK();
    process.exit(0);
  });

  // Keep the process alive.
  setInterval(() => {}, 1000 * 60);
}

main().catch(console.error);
