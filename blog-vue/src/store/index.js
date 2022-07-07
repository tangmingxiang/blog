import { createStore } from 'vuex'
import store from '../util/store'
import { TOKEN_NAME } from '../api/api.serve'

export default createStore({
  state () {
    return {
      id: store.get('uid') || "", // 存储用户ID
      token: store.get(TOKEN_NAME) || "", // 存储登录状态
      userInfo: {}, // 存储登录的用户信息
      columnId: sessionStorage.getItem('columnId') || '', // 记录当前展示的文章列表是哪一个分类
      authorId: sessionStorage.getItem('authorId') || '', // 存储文章详情页的作者信息 
    }
  },
  mutations: {
    SET_TOKEN (state, token) {
      state.token = token
    },
    SET_USERINFO (state, userInfo) {
      state.id = userInfo._id
      state.userInfo = userInfo
    },
    SET_LOGOUT (state){
      state.id = ""
      state.token = ""
      state.userInfo = {}
    },
    SET_COLUMN_ID(state, id){
      state.columnId = id
      sessionStorage.setItem('columnId', id)
    },
    SET_AUTHOR_ID(state, authorId){
      state.authorId = authorId
      sessionStorage.setItem('authorId', authorId)
    }
  },
  actions: {
    login ({ commit }, { token, userInfo }) {
      commit('SET_TOKEN', token)
      commit('SET_USERINFO', userInfo)
    },
    logout({ commit }){
      commit('SET_LOGOUT')
    }
  },
  modules: {
  }
})
