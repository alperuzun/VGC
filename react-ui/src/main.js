const { app, BrowserWindow } = require('electron');
const path = require('path');
var findPort = require("find-free-port");
const fs = require('fs');
var kill  = require('tree-kill');


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let child;
let pid;

const startServer = (port) => {
  // JAR will need to be updated manually if backend code is updated.
  // console.log("path is: ", app.getAppPath())

  const jarFilePath = path.join(app.getAppPath(), 'jars', 'variantgraphcraft-backend-0.0.1-SNAPSHOT.jar');


  child = require('child_process').exec(`java -jar ${jarFilePath} --server.port=${port}`);
  pid = child.pid

  // Handle the output
  // child.stdout.on('data', (data) => {
  //   console.log(`Backend stdout: ${data}`);
  // });

  child.stderr.on('data', (data) => {
    console.error(`Backend stderr: ${data}`);
  });

  child.on('close', (code) => {
    console.log(`Backend process exited with code ${code}`);
  });

  if (child.pid) {
    console.log('Server PID: ' + child.pid);
  } else {
    console.log('Failed to launch server process.');
  }
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 1000,
    minWidth: 1150,
    minHeight: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);


  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    // FOR DEPLOYMENT 
    if (pid != null) {
      kill(pid);
    }
  })
};

app.on('ready', function () {
  findPort(8080, function(err, port) {
    console.log(`Starting server at port ${port}`)
    createWindow(port);
    startServer(port);
  });
});

app.on('window-all-closed', () => {
  if (pid != null) {
    kill(pid);
  }
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

