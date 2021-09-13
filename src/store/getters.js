/**
 * 全局数据响应
 */
const getters = {
    title: state => state.common.title,  // 标题
    userInfo: state => state.user.userInfo  // 用户信息
}

export default getters