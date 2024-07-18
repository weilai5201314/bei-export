// GameManager.js

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
