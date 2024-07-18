<script setup>
import Versions from './components/Versions.vue'

const ipcHandle = () => window.electron.ipcRenderer.send('ping')
const ipcTest = () => window.electron.ipcRenderer.send('getGachaMain')
</script>

<template>
  <img alt="logo" class="logo" src="./assets/electron.svg" />
  <div class="creator">Powered by electron-vite</div>
  <div class="text">
    Build an Electron app with
    <span class="vue">Vue</span>
  </div>
  <p class="tip">Please try pressing <code>F12</code> to open the devTool</p>
  <div class="actions">
    <div class="action">
      <el-button type="primary" @click="ipcTest">生成抽卡记录</el-button>
    </div>
    <div class="action">
      <el-button type="danger" @click="ipcHandle">Send IPC</el-button>
    </div>
  </div>
  <Versions />
</template>
