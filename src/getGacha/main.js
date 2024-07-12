import { getAuthKey } from './getAuthKey'
import { getGameLocation } from './getGameLocation'
import { fetchGachaData } from './fetchtGacha'
import { sortGachaLog } from './sortGacha'

const size = 20
const inputFile = './data/input.json'
const outputFile = './data/output.json'

async function getGachaMain() {
  try {
    // 获取游戏路径
    const path = getGameLocation()

    // 获取authKey
    const authKey = getAuthKey(path)

    // 开始获取抽卡记录
    await fetchGachaData(authKey, inputFile, size)

    // 排序抽卡记录
    sortGachaLog(inputFile, outputFile)
  } catch (error) {
    console.error('An error occurred:', error)
  }
}

export { getGachaMain }
