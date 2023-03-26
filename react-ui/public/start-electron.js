//  windows, linux, & mac -- try running on all three

const electron = require('electron'),
  app = electron.app,
  BrowserWindow = electron.BrowserWindow;

//FOR DEPLOYMENT -- COMMENT BEFORE EDITING
// var kill  = require('tree-kill');
//   
const path = require('path');
const isDev = require('electron-is-dev');
let mainWindow;
let child;

//FOR DEPLOYMENT -- NO NEED TO COMMENT IF TESTING BACKEND
const startServer = () => {
  //JAR will need to be updated manually if backend code is updated.
  child = require('child_process').exec('java -jar updated-variantgraphcraft-backend-0.0.1-SNAPSHOT.jar', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });

  if (child.pid) {
    console.log('Server PID: ' + child.pid);
  } else {
    console.log('Failed to launch server process.');
  }
}
//

const createWindow = () => {
  mainWindow = new BrowserWindow({ width: 480, height: 320})
  const appUrl = isDev ? 'http://localhost:3000' : 
    `file://${path.join(__dirname, '../build/index.html')}`
  console.log("appUrl: " + appUrl);
  mainWindow.loadURL(appUrl)
  mainWindow.maximize()
  mainWindow.setFullScreen(true)
  mainWindow.on('closed', () => {
    // FOR DEPLOYMENT -- COMMENT IF TESTING BACKEND
    // kill(child.pid);
    //
    mainWindow = null
  })
}


app.on('ready', function () {
  // FOR DEPLOYMENT -- COMMENT IF TESTING BACKEND
  // startServer(); //try using delay time? w/ load bar.
  //
  createWindow();
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') { app.quit() }
})

app.on('activate', () => {
  if (mainWindow === null) { createWindow() }
})
