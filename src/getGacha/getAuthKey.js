import fs from 'fs'
import path from 'path'

function getAuthKey(gamePath) {
  // 文件路径
  const filePath = path.join(
    gamePath,
    'games',
    'ZenlessZoneZero Game',
    'ZenlessZoneZero_Data',
    'webCaches',
    '2.23.0.0',
    'Cache',
    'Cache_Data',
    'data_2'
  )
  const listFilePath = path.join(__dirname, 'list.txt') // list.txt的路径

  // 定义基础URL
  let key = ''

  // 读取文件内容并处理
  function processFile() {
    try {
      let data = fs.readFileSync(filePath, 'utf8')

      // 清理数据，去除不可见字符和换行符
      // eslint-disable-next-line no-control-regex
      data = data.replace(/[\u0000-\u001F\u007F-\u009F]/g, '')

      // 正则表达式匹配包含基础URL的完整URL
      const urlRegex = new RegExp(
        `https:\\/\\/public-operation-nap\\.mihoyo\\.com\\/common\\/gacha_record\\/api\\/getGachaLog\\?(?=.*\\bauthkey_ver\\b)(?=.*\\bsign_type\\b)(?=.*\\bauth_appid\\b)(?=.*\\bwin_mode\\b)(?=.*\\bgacha_id\\b)(?=.*\\btimestamp\\b)(?=.*\\binit_log_gacha_type\\b)(?=.*\\binit_log_gacha_base_type\\b)(?=.*\\bui_layout\\b)(?=.*\\bbutton_mode\\b)(?=.*\\bplat_type\\b)(?=.*\\bauthkey\\b)(?=.*\\blang\\b)(?=.*\\bregion\\b)(?=.*\\bgame_biz\\b)(?=.*\\bpage\\b)(?=.*\\bsize\\b)(?=.*\\bgacha_type\\b)(?=.*\\breal_gacha_type\\b)(?=.*\\bend_id\\b).*`,
        'g'
      )
      const matches = data.match(urlRegex)

      if (matches && matches.length > 0) {
        // 在匹配到的URL中匹配authkey参数名及其参数值
        const authkeyRegex = /(?:\?|&)authkey=([^&]*)/g
        const authkeys = []
        matches.forEach((url) => {
          let match
          while ((match = authkeyRegex.exec(url)) !== null) {
            authkeys.push(match[1])
          }
        })
        return authkeys[authkeys.length - 1]
      } else {
        console.log('未找到匹配的URL')
        // 如果需要，也可以清空list.txt文件
        fs.writeFileSync(listFilePath, '')
        return null
      }
    } catch (err) {
      console.error('读取文件出错:', err)
      return null
    }
  }

  key = processFile()
  return key
}

export { getAuthKey }
