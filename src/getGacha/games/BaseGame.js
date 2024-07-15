// game/BaseGame.js
class BaseGame {
  constructor() {
    if (new.target === BaseGame) {
      throw new TypeError('Cannot construct BaseGame instances directly')
    }
  }

  getGameLocation() {
    throw new Error('getGameLocation() must be implemented by subclass')
  }

  getAuthKey(gamePath) {
    this._gamePath = gamePath
    throw new Error('getAuthKey() must be implemented by subclass')
  }

  fetchGachaData(authKey) {
    this._authKey = authKey
    throw new Error('fetchGachaData() must be implemented by subclass')
  }
}

export { BaseGame }
