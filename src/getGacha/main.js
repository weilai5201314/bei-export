// import { getAuthKey } from './old/getAuthKey'
// import { getGameLocations } from './old/getGameLocation'
// import { fetchGachaData } from './old/fetchtGacha'
// import { sortGachaLog } from './old/sortGacha'

import { NapCnGame } from "./games/NapCnGame";

// const size = 20
// const inputFile = './data/input.json'
// const outputFile = './data/output.json'

async function getGachaMain() {
  try {
    // // 获取游戏路径
    // const path = getGameLocations()
    // // 获取authKey
    // const authKey = getAuthKey(path)
    // // 开始获取抽卡记录
    // await fetchGachaData(authKey, inputFile, size)
    // //
    // // 排序抽卡记录
    // sortGachaLog(inputFile, outputFile)

    // new
    const napCnGame = new NapCnGame();
    napCnGame.getGameLocation();
    napCnGame.getAuthKey();

  } catch (error) {
    console.error("An error occurred:", error);
  }
}

export { getGachaMain };
