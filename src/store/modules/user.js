/**
 * 用户信息
 */
export default {
    state: {
        userInfo: {}, // 用户信息
    },

    mutations: {
        SET_USER_INFO(state, userInfo) {
            // 如果存在用户，将用户赋值过去
            if (userInfo) {
                state.userInfo = userInfo
            } else {
                // 如果不存在，为空对象
                state.user = {}
            }
        },
    },

    actions: {
        SetUserInfo({commit}, userInfo) {
            commit('SET_USER_INFO', userInfo)
        },
    }
}