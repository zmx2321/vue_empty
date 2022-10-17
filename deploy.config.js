module.exports = {
    projectName: 'YourProjectName',
    // privateKey: '',
    // passphrase: '',
    // cluster: [],  集群部署配置，要 同时部署多台配置此属性如: ['dev', 'test', 'prod']
    prod: {
        // 环境对象
        name: '生产环境', // 环境名称
        script: 'yarn build', // 打包命令
        host: '', // 服务器地址
        port: 22, // 服务器端口号
        username: '', // 服务器登录用户名
        password: '', // 服务器登录密码
        distPath: '', // 本地打包生成目录
        webDir: '', // 服务器部署路径（不可为空或'/'）
        bakDir: '', // 备份路径 (打包前备份之前部署目录 最终备份路径为 /usr/local/nginx/html/bak/yhlien-admin_2022-02-09_10:14:58.zip)
        isRemoveRemoteFile: true, // 是否删除远程文件（默认true）
        isRemoveLocalFile: true // 是否删除本地文件（默认true）
    }
}