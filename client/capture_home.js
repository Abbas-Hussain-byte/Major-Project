import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ARTIFACT_DIR = "C:\\Users\\Awes\\.gemini\\antigravity-ide\\brain\\f918895d-f413-429b-b4f1-52befd3581b9";

async function capture() {
  console.log('Spawning Chrome...');
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=390,844'
  ]);

  // Wait for Chrome to listen on 9222
  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9222/json/list');
    const tabs = await listRes.json();
    const wsUrl = tabs[0]?.webSocketDebuggerUrl;
    if (!wsUrl) throw new Error('No webSocketDebuggerUrl found');

    const ws = new WebSocket(wsUrl);
    await new Promise((res, rej) => {
      ws.onopen = res;
      ws.onerror = rej;
    });

    let msgId = 1;
    function sendCommand(method, params = {}) {
      return new Promise((res, rej) => {
        const id = msgId++;
        const handler = (evt) => {
          const msg = JSON.parse(evt.data);
          if (msg.id === id) {
            ws.removeEventListener('message', handler);
            if (msg.error) rej(msg.error);
            else res(msg.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await sendCommand('Page.enable');
    await sendCommand('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });

    // 1. Capture Dashboard (After)
    console.log('Navigating to Dashboard (?step=4)...');
    await sendCommand('Page.navigate', { url: 'http://localhost:5173/?step=4' });
    await new Promise(r => setTimeout(r, 1500));
    const dashShot = await sendCommand('Page.captureScreenshot', { format: 'png' });
    const dashPath = path.join(ARTIFACT_DIR, 'home_after_390x844.png');
    fs.writeFileSync(dashPath, Buffer.from(dashShot.data, 'base64'));
    console.log('Saved:', dashPath);

    // 2. Capture Onboarding (Before / Step 1)
    console.log('Navigating to Onboarding (?step=1)...');
    await sendCommand('Page.navigate', { url: 'http://localhost:5173/?step=1' });
    await new Promise(r => setTimeout(r, 1500));
    const onbShot = await sendCommand('Page.captureScreenshot', { format: 'png' });
    const onbPath = path.join(ARTIFACT_DIR, 'home_before_390x844.png');
    fs.writeFileSync(onbPath, Buffer.from(onbShot.data, 'base64'));
    console.log('Saved:', onbPath);

    ws.close();
  } finally {
    chrome.kill();
  }
}

capture().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
