// 30
import { execSync } from 'child_process'
import iconv from 'iconv-lite'

function getGameLocations() {
  try {
    // 构造 cmd 命令，查询 HYP 键下所有子项及其值
    const command = `reg query "HKEY_CURRENT_USER\\Software\\miHoYo\\HYP" /s`

    // 执行 cmd 命令获取所有子项
    const outputBuffer = execSync(command)
    const result = iconv.decode(outputBuffer, 'cp936')
    const lines = result.split('\n')

    // 初始化变量存储GameInstallPath值
    let napCnPath = ''
    let hk4eCnPath = ''
    let hkrpgCnPath = ''

    // 临时变量存储当前子项路径
    let currentKey = ''

    // 遍历每一行
    lines.forEach((line) => {
      // 如果行是一个子项路径，则更新currentKey
      if (line.trim().startsWith('HKEY_CURRENT_USER\\Software\\miHoYo\\HYP\\')) {
        currentKey = line.trim()
      } else if (line.includes('GameInstallPath')) {
        const parts = line.trim().split(/\s{3,}/) // 分隔符为至少三个空格
        if (parts.length === 3) {
          const [, , value] = parts
          // 根据路径结尾确定匹配的游戏
          if (currentKey.endsWith('nap_cn') && value.includes('ZenlessZoneZero Game')) {
            napCnPath = value
          } else if (currentKey.endsWith('hkrpg_cn') && value.includes('Star Rail Game')) {
            hkrpgCnPath = value
          } else if (currentKey.endsWith('hk4e_cn') && value.includes('Genshin Impact Game')) {
            hk4eCnPath = value
          }
        }
      }
    })

    // 返回提取的路径
    return { hk4eCnPath, hkrpgCnPath, napCnPath }
  } catch (error) {
    console.error('Error executing cmd command:', error)
    return { hk4eCnPath: 'null', hkrpgCnPath: 'null', napCnPath: 'null' }
  }
}

export { getGameLocations }
