const { MIME_TYPE_EPUB, UPLOAD_URL, UPLOAD_PATH } = require('../utils/constant')
const fs = require('fs')
const Epub = require('../utils/epub')

class Book {
    constructor(file, data) {
        if (file) {
            this.createBookFromFile(file)
        }else {
            this.createBookFromData(data)
        }
    }

    createBookFromFile(file) {
        const {
            destination,
            filename,
            mimetype = MIME_TYPE_EPUB,
            path,
            originalname
        } = file

        const suffix = mimetype === MIME_TYPE_EPUB ? '.epub' : ''
        const oldBookPath = path
        const bookPath = `${destination}/${filename}${suffix}`
        const url = `${UPLOAD_URL}/book/${filename}.${suffix}`
        const unzipPath = `${UPLOAD_PATH}/unzip/${filename}`
        const unzipUrl = `${UPLOAD_URL}/unzip/${filename}`

        if (!fs.existsSync(unzipPath)) {
            fs.mkdirSync(unzipPath, {recursive: true})
        }
        if (fs.existsSync(oldBookPath) && !fs.existsSync(bookPath)) {
            fs.renameSync(oldBookPath, bookPath)
        }

        this.fileName = filename
        this.path = `/book/${filename}${suffix}`
        this.filePath = this.path
        this.url = url
        this.titlt = ''
        this.author = ''
        this.publisher = ''
        this.contents = []
        this.cover = ''
        this.coverPath = ''
        this.category = -1
        this.categoryText = ''
        this.language = ''
        this.unzipPath = `/unzip/${filename}`
        this.unzipUrl = unzipUrl
        this.originalname = originalname
    }
    createBookFromData(data) {}

    parse() {
        return new Promise((resolve, reject) => {
            const bookPath = `${UPLOAD_PATH}${this.path}`
            // const bookPath = bookPathorigin.replace(/\//g,'\\')
            if (!fs.existsSync(bookPath)) {
                console.log(bookPath)
                reject(new Error('电子书路径不存在'))
            }
            const epub = new Epub(bookPath)
            epub.on('error', err => {
                reject(err)
            })
            epub.on('end', err => {
                if (err) {
                    reject(err)
                } else {
                    let {
                        title,
                        language,
                        creator,
                        creatorFileAs,
                        publisher,
                        cover
                    } = epub.metadata
                    // title = ''
                    if (!title) {
                        reject(new Error('图书标题为空'))
                    } else {
                        this.title = title
                        this.language = language || 'en'
                        this.author = creator || creatorFileAs || 'unknown'
                        this.publisher = publisher || 'unknown'
                        this.rootFile = epub.rootFile
                        const handleGetImage = (error, imgBuffer, mimeType) => {
                            if (error) {
                                reject(error)
                            } else {
                                const suffix = mimeType.split('/')[1]
                                const coverPath = `${UPLOAD_PATH}/img/${this.fileName}.${suffix}`
                                const coverUrl = `${UPLOAD_URL}/img/${this.fileName}.${suffix}`
                                 // const winCoverUrl = coverUrl.replace(/\//g,'\\')
                                fs.writeFileSync(coverPath, imgBuffer, 'binary')
                                this.coverPath = `/img/${this.fileName}.${suffix}`
                                this.cover = coverUrl
                                resolve(this)
                            }
                        }
                        epub.getImage(cover, handleGetImage)


                        // try {
                        //     this.unzip() // 解压电子书
                        //     this.parseContents(epub)
                        //         .then(({ chapters, chapterTree }) => {
                        //             this.contents = chapters
                        //             this.contentsTree = chapterTree
                        //             epub.getImage(cover, handleGetImage) // 获取封面图片
                        //         })
                        //         .catch(err => reject(err)) // 解析目录
                        // } catch (e) {
                        //     reject(e)
                        // }
                    }
                }
            })
            epub.parse()
            this.epub = epub
        })
    }
}

module.exports = Book
