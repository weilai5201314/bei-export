import fs from 'fs'
import axios from 'axios'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const fetchGachaData = async (authKey, inputFileName, size = 20) => {
  const baseURL = 'https://public-operation-nap.mihoyo.com/common/gacha_record/api/getGachaLog'
  let page = 1
  let endId = ''
  fs.mkdir('./data', (err) => {
    if (err) {
      console.log('文件夹创建失败 ！')
      return
    }
    console.log('文件夹创建成功 ！')
  })

  const readExistingRecords = () => {
    if (fs.existsSync(inputFileName)) {
      const data = fs.readFileSync(inputFileName, 'utf-8')
      try {
        return JSON.parse(data)
      } catch (error) {
        console.error('Error parsing existing records:', error)
        return []
      }
    }
    return []
  }

  const writeRecordsToFile = (inputFileName, records) => {
    fs.writeFileSync(inputFileName, JSON.stringify(records, null, 2), 'utf-8')
    console.log('Gacha records have been written to input.json file')
  }

  const fetchPage = async () => {
    const params = {
      authkey_ver: 1,
      sign_type: 2,
      auth_appid: 'webview_gacha',
      win_mode: 'fullscreen',
      gacha_id: '2c1f5692fdfbb733a08733f9eb69d32aed1d37',
      timestamp: Math.floor(Date.now() / 1000),
      init_log_gacha_type: 2001,
      init_log_gacha_base_type: 2,
      ui_layout: '',
      button_mode: 'default',
      plat_type: 3,
      authkey: authKey,
      lang: 'zh-cn',
      region: 'prod_gf_cn',
      game_biz: 'nap_cn',
      page: page,
      size: size,
      gacha_type: 2001,
      real_gacha_type: 2,
      end_id: endId
    }

    const urlParams = Object.keys(params)
      .map((key) => {
        if (key === 'authkey') {
          return `${key}=${authKey}`
        }
        return `${key}=${encodeURIComponent(params[key])}`
      })
      .join('&')

    const url = `${baseURL}?${urlParams}`

    try {
      const response = await axios.get(url)
      console.log('Request successful:', response.data)

      const data = response.data
      if (data.retcode === 0 && data.message === 'OK') {
        const list = data.data.list

        const existingRecords = readExistingRecords()
        const updatedRecords = existingRecords.concat(list)
        writeRecordsToFile(inputFileName, updatedRecords)

        if (list.length > size - 1) {
          endId = list[list.length - 1].id
          page++
          await delay(500)
          await fetchPage()
        }
      } else {
        console.log('Request error:', data.message)
      }
    } catch (error) {
      console.error('Request failed:', error)
    }
  }

  await fetchPage()
}

export { fetchGachaData }