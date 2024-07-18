import { NapCnGame } from './games/NapCnGame'

async function getGachaMain() {
  try {
    // new
    const napCnGame = new NapCnGame()
    napCnGame.getGameLocation()
    napCnGame.getAuthKey()
  } catch (error) {
    console.error('An error occurred:', error)
  }
}

export { getGachaMain }
