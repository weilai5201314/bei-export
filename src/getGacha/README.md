```shell
getGacha/
│
├── games/
│   ├── BaseGame.js       // 游戏基类
│   ├── HK4eCnGame.js     // 原神 (hk4eCn) 游戏类
│   ├── HkRpgCnGame.js    // 星穹铁道 (hkrpgCn) 游戏类
│   └── NapCnGame.js      // 崩坏 (napCn) 游戏类
│
├── manager/
│   └── GameManager.js    // 游戏管理类
│
├── sortGacha/
│   ├── sortGachaLog.js
│   └── GachaSorter.js
│
├── utils/
│   ├── utilityFunctions.js
│   └── ...
│
├── errors.js
└── main.js               // 主入口文件
```

```javascript
// GameManager.js
import GenshinImpact from './GenshinImpact'
import StarRail from './StarRail'

class GameManager {
  constructor() {
    this.games = []
  }

  addGame(game) {
    this.games.push(game)
  }

  async fetchAllGachaData() {
    for (const game of this.games) {
      const gamePath = game.getGameLocation()
      const authKey = game.getAuthKey(gamePath)
      await game.fetchGachaData(authKey, `./data/${game.name}_input.json`, 20)
    }
  }
}

export default GameManager

// main.js
import GameManager from './GameManager'
import GenshinImpact from './GenshinImpact'
import StarRail from './StarRail'
import { sortGachaLog } from './sortGacha'

async function main() {
  const gameManager = new GameManager()

  // 添加游戏实例
  gameManager.addGame(new GenshinImpact())
  gameManager.addGame(new StarRail())

  // 获取所有游戏的抽卡数据
  await gameManager.fetchAllGachaData()

  // 整理抽卡记录
  sortGachaLog('./data/input.json', './data/output.json')
}

main()
```
