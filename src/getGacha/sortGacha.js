import fs from 'fs'

function sortGachaLog(inputFile, outputFile) {
  try {
    let gachaRecords = []

    // Check if input file exists
    if (fs.existsSync(inputFile)) {
      let data = fs.readFileSync(inputFile, 'utf8')
      gachaRecords = JSON.parse(data)
    } else {
      console.log(`Input file ${inputFile} does not exist. Creating a new file.`)
    }

    let uniqueRecords = deduplicateRecords(gachaRecords)

    uniqueRecords.sort((a, b) => {
      return new Date(a.time) - new Date(b.time)
    })

    fs.writeFileSync(outputFile, JSON.stringify(uniqueRecords, null, 2))
    console.log(`Gacha records organized, sorted, and saved to ${outputFile}`)
    // 删除输入文件
    fs.unlinkSync(inputFile)
    console.log(`Input file ${inputFile} deleted successfully.`)
  } catch (error) {
    console.error('Error processing JSON:', error.message)
  }
}

function deduplicateRecords(records) {
  let seen = new Set()
  return records.filter((record) => {
    let recordString = JSON.stringify(record)
    let duplicate = seen.has(recordString)
    seen.add(recordString)
    return !duplicate
  })
}

export { sortGachaLog }
