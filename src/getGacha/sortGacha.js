// 40
import fs from 'fs'
import path from 'path'

// 确保目录存在的函数
function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath)
  if (fs.existsSync(dirname)) return true // 如果存在，返回 true
  ensureDirectoryExistence(dirname) // 递归调用，确保父目录存在
  fs.mkdirSync(dirname)
}

// 去重 Gacha 记录的函数
function deduplicateRecords(records) {
  // 初始化一个 Set 来跟踪已看到的记录
  let seen = new Set()
  // 过滤掉重复的记录
  return records.filter((record) => {
    // 将记录转换为字符串
    let recordString = JSON.stringify(record)
    // 检查记录是否已经存在
    let duplicate = seen.has(recordString)
    // 将记录添加到已看到的集合中
    seen.add(recordString)
    return !duplicate
  })
}

function sortGachaLog(inputFile, outputFile) {
  try {
    let gachaRecords = []
    // 检查输入文件是否存在
    if (fs.existsSync(inputFile)) {
      // 读取输入文件内容 解析 JSON 数据
      let data = fs.readFileSync(inputFile, 'utf8')
      gachaRecords = JSON.parse(data)
    } else {
      // 如果输入文件不存在，打印消息并创建一个新的文件
      console.log(`401Input file ${inputFile} does not exist. Creating a new file.`)
      // 确保输入文件的目录存在，并创建一个空的 JSON 文件
      ensureDirectoryExistence(inputFile)
      fs.writeFileSync(inputFile, '[]', 'utf8')
    }
    // 去重 Gacha 记录
    let uniqueRecords = deduplicateRecords(gachaRecords)
    // 按时间字段排序 Gacha 记录
    uniqueRecords.sort((a, b) => {
      return new Date(a.time) - new Date(b.time)
    })
    // 确保输出文件的目录存在
    ensureDirectoryExistence(outputFile)
    // 将排序后的记录写入输出文件
    fs.writeFileSync(outputFile, JSON.stringify(uniqueRecords, null, 2))
    console.log(`402Gacha records organized, sorted, and saved to ${outputFile}`)
    // 删除输入文件
    fs.unlinkSync(inputFile)
    console.log(`403Input file ${inputFile} deleted successfully.`)
  } catch (error) {
    console.error('404Error processing JSON:', error.message)
  }
}

export { sortGachaLog }
