// game/NapCnGame.js
import path from 'path'
import { BaseGame } from './BaseGame'
import { execSync } from 'child_process'
import iconv from 'iconv-lite'

class NapCnGame extends BaseGame {
  static BASE_PATH = 'https://public-operation-nap.mihoyo.com/common/gacha_record/api/getGachaLog'
  static CACHE_PATH = path.join(
    'ZenlessZoneZero_Data',
    'webCaches',
    '2.23.0.0',
    'Cache',
    'Cache_Data',
    'data_2'
  )

  constructor() {
    super()
    // 部分参数
    this.gamePath = null
    this.authKey = null
    this.currentPath = null
  }

  // 获取游戏位置
  getGameLocation() {
    // 获取游戏位置
    this.#getNapCnPath()
  }

  // 获取认证密钥
  getAuthKey() {
    if (this.gamePath === null) {
      throw new Error('Game location must be set before getting auth key')
    }
    // 获取
    // console.log('getAuthKey()', this.gamePath)
    this.#getNapCnKey()
  }

  // 获取抽卡数据
  fetchGachaData() {
    if (!this.authKey) {
      throw new Error('Auth key must be set before fetching gacha data')
    }
    NapCnGame.BASE_URL
    console.log(`Fetching gacha data with auth key: ${this.authKey}`)
    // 这里实现获取抽卡数据的逻辑
  }

  // 获取zzz路径 - 私有方法
  #getNapCnPath() {
    try {
      const command = `reg query "HKEY_CURRENT_USER\\Software\\miHoYo\\HYP" /s`
      const outputBuffer = execSync(command)
      const result = iconv.decode(outputBuffer, 'cp936')
      const lines = result.split('\n')
      // 遍历每一行
      lines.forEach((line) => {
        // 如果行是一个子项路径，则更新currentKey
        if (line.trim().startsWith('HKEY_CURRENT_USER\\Software\\miHoYo\\HYP\\')) {
          this.currentPath = line.trim()
        } else if (line.includes('GameInstallPath')) {
          const parts = line.trim().split(/\s{3,}/) // 分隔符为至少三个空格
          if (parts.length === 3) {
            const [, , value] = parts
            // 根据路径结尾确定匹配的游戏
            if (this.currentPath.endsWith('nap_cn') && value.includes('ZenlessZoneZero Game')) {
              // 拼接游戏路径和游戏文件路径,此时已是完整路径,无需再修改
              this.gamePath = path.join(value, NapCnGame.CACHE_PATH)
              console.log(this.gamePath)
            }
          }
        }
      })
    } catch (error) {
      console.error('Error executing cmd command:', error)
      return 'null'
    }
  }

  // 获取authkey - 私有方法
  #getNapCnKey() {}
}

export { NapCnGame }
