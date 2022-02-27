const path = require('path')
const fs = require('fs')
const fsp = require('fs').promises
const os = require('os')

const arrangingFilename = process.argv[2] // ex : node index.js test 입력 시 => process.argv[2] = test

const arrangingFilePath = path.join(__dirname, arrangingFilename) // C:\projects\nodejs\prj1_arrange_files/test

console.log(__dirname)
console.log(os.homedir())

const ext = {
  video: ['mp4', 'mov'],
  captured: ['png', 'aae'],
  duplicated: ['jpg'],
} // extension 정리

const folders = Object.keys(ext) // ext 의 key 값만 불러옴 => video, captured, duplicated

folders.forEach((folder) => {
  const isFolderExisted = path.join(arrangingFilename, folder) //test/video
  if (!fs.existsSync(isFolderExisted)) {
    //   dir 있는지 확인
    fs.mkdirSync(isFolderExisted)
    console.log(`'${folder}' is created!`)
  } else {
    console.log(`'${folder}' is already existed.`)
  }
})

fs.readdir(arrangingFilePath, function (error, filelist) {
  //  C:\projects\nodejs\prj1_arrange_files/test 의 list들을 읽고, callback 으로 list 불러옴
  const validFilelist = filelist.filter((file) => {
    //   ext 있는 것만 추출
    return path.extname(file) !== ''
  })
  folders.forEach((folder) => {
    //   filelist 와 video, captured, duplicated 중 하나씩 보냄
    moveFile(validFilelist, folder)
  })
})

const moveFile = (validFilelist, folder) => {
  validFilelist.forEach((file) => {
    let oldpath = path.join(arrangingFilePath, file)
    let newpath = path.join(arrangingFilePath, folder, file)
    // console.log(path.extname(file).slice(1))
    if (
      ext[folder].includes(path.extname(file).slice(1)) &&
      !file.includes('_E')
    ) {
      fsp
        .rename(oldpath, newpath)
        .then(() => {
          console.log(`move ${file} to ${newpath}`)
        })
        .catch((err) => console.log(err))
    }
  })
}
