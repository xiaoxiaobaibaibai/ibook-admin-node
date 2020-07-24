const { env } = require('./env')

const UPLOAD_PATH = env === 'dev' ? 'C:\\book\\upload\\admin-upload-ebook' : '/root/upload/admin-upload/ebook'

module.exports = {
    CODE_ERROR: -1,
    CODE_TOKEN_EXPIRED: -2,
    CODE_SUCCESS: 0,
    debug: true,
    PWD_SALT: 'admin_imooc_node',
    PRIVATE_KEY: ' Ithinkloveisatouchandyetnotatouch.',
    JWT_EXPIRED: 60*60,
    UPLOAD_PATH
}
