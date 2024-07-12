import { execSync } from 'child_process'
import iconv from 'iconv-lite'

function getGameLocation() {
  try {
    // 构造 cmd 命令，查询 Uninstall 键下所有子项
    const command = `reg query "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall"`

    // 执行 cmd 命令获取所有子项
    const outputBuffer = execSync(command)
    const result = iconv.decode(outputBuffer, 'cp936')
    const lines = result.split('\n')

    // 过滤出子项路径
    const keys = lines.filter((line) => line.startsWith('HKEY_LOCAL_MACHINE'))

    // console.log("Registry Key Values:");
    let foundSoftware = false
    let gameLocation = ''

    // 遍历每个子项路径
    keys.some((key) => {
      try {
        // 查询每个子项的所有值
        const subCommand = `reg query "${key.trim()}"`
        const subOutputBuffer = execSync(subCommand)
        const subResult = iconv.decode(subOutputBuffer, 'cp936')
        const subLines = subResult.split('\n')

        let softwareInfo = {}

        // 提取子项的所有属性和对应的值
        subLines.forEach((line) => {
          const parts = line.trim().split(/\s{3,}/) // 修改分隔符为至少三个空格
          if (parts.length === 3) {
            const [name, , value] = parts
            softwareInfo[name] = value
          }
        })
        // 如果找到 DisplayName 包含 "米哈游启动器"，则输出所有内容并结束循环
        if (softwareInfo['DisplayName'] && softwareInfo['DisplayName'].includes('米哈游启动器')) {
          foundSoftware = true
          gameLocation = softwareInfo['InstallPath']
          return true // 结束循环
        }
      } catch (subError) {
        // 处理每个子项查询中的错误
        console.error(`Error querying subkey ${key.trim()}:`, subError)
      }
    })
    if (!foundSoftware) {
      console.log('没找到')
    }
    // 最后返回
    return gameLocation
  } catch (error) {
    console.error('Error executing cmd command:', error)
  }
}

export { getGameLocation }
