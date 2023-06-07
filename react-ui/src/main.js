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
  //JAR will need to be updated manually if backend code is updated.
  console.log("path is: ", app.getAppPath())

  const jarFilePath = path.join(app.getAppPath(), 'jars', 'variantgraphcraft-backend-0.0.1-SNAPSHOT.jar');


  child = require('child_process').exec(`java -jar ${jarFilePath} --server.port=${port}`);
  pid = child.pid

  // Handle the output
  child.stdout.on('data', (data) => {
    console.log(`Backend stdout: ${data}`);
  });

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
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });


  // Enable CORS for Electron
  // mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
  //   callback({
  //     responseHeaders: {
  //       ...details.responseHeaders,
  //       'Access-Control-Allow-Origin': '*',
  //       'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  //       'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
  //     },
  //   });
  // });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);


  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    // FOR DEPLOYMENT -- COMMENT IF TESTING BACKEND
    if (pid != null) {
      kill(pid);
    }
  })
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {
  // Create window first to show splash before starting server
  // createWindow();
  findPort(8080, function(err, port) {
    console.log(`Starting server at port ${port}`)
    createWindow(port);
    startServer(port);
    // loadHomePage(`http://localhost:${port}/#/`)
  });
});

// app.on('will-quit', () => {
//   if (serverProcess) {
//     console.log(`Killing server process ${serverProcess.pid}`);
//     const kill = require('tree-kill');
//     kill(serverProcess.pid, 'SIGTERM', function (err) {
//       console.log('Server process killed');
//         serverProcess = null;
//     });
//   }
// });

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (pid != null) {
    kill(pid);
  }
  app.quit();

  // if (process.platform !== 'darwin') {
  //   app.quit();
  // }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
