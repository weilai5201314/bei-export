import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { join } from 'path'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

const { execSync } = require('child_process')
const iconv = require('iconv-lite')

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))
  // ipcMain.on('getLocation', () => )
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

// 构造 cmd 命令，查询 Uninstall 键下所有子项
const command = `reg query "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall"`

try {
  // 执行 cmd 命令获取所有子项
  const outputBuffer = execSync(command)
  const result = iconv.decode(outputBuffer, 'cp936')
  const lines = result.split('\n')

  // 过滤出子项路径
  const keys = lines.filter((line) => line.startsWith('HKEY_LOCAL_MACHINE'))

  console.log('Registry Key Values:')
  let foundSoftware = false

  // 遍历每个子项路径
  keys.some((key) => {
    try {
      // 查询每个子项的所有值
      const subCommand = `reg query "${key.trim()}"`
      const subOutputBuffer = execSync(subCommand)
      const subResult = iconv.decode(subOutputBuffer, 'cp936')
      const subLines = subResult.split('\n')

      let softwareInfo = {}

      // 提取子项的所有属性和对应的值
      subLines.forEach((line) => {
        const parts = line.trim().split(/\s{3,}/) // 修改分隔符为至少三个空格
        if (parts.length === 3) {
          const [name, , value] = parts
          softwareInfo[name] = value
        }
      })

      // 如果找到 DisplayName 包含 "米哈游启动器"，则输出所有内容并结束循环
      if (softwareInfo['DisplayName'] && softwareInfo['DisplayName'].includes('米哈游启动器')) {
        console.log(`Key: ${key.trim()}`)
        // for (let prop in softwareInfo) {
        // console.log(`${prop}: ${softwareInfo[prop]}`);
        console.log(`DisplayName:${softwareInfo['DisplayName']}`)
        console.log(`InstallPath:${softwareInfo['InstallPath']}`)
        // }
        console.log('-----------------------------------')
        foundSoftware = true
        return true // 结束循环
      }
    } catch (subError) {
      // 处理每个子项查询中的错误
      console.error(`Error querying subkey ${key.trim()}:`, subError)
    }
  })

  if (!foundSoftware) {
    console.log('没找到')
  }
} catch (error) {
  console.error('Error executing cmd command:', error)
}
