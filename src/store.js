import Vue from 'vue'
import Vuex from 'vuex'
import fetch from '@/api/api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},
    balance: '',
    allUserInfo: {},
    tabIndex: 0,
    historyRecord: {},
    showLoading: false,
    currentRoom: {},
    folderList: [],
    unRead: false,
    currentNews: null,
    bankList: [],
    device: Number
  },
  mutations: {
    SET_ACCOUNT (state, data) {
      state.user = data
    },
    CLEAR_ACCOUNT (state) {
      state.user = {}
    },
    SET_TAB_INDEX (state, data) {
      state.tabIndex = data
    },
    SET_LIST_RECORD (state, data) {
      state.historyRecord = data
    },
    SET_LOADING (state, data) {
      state.showLoading = data
    },
    SET_FOLDER_LIST (state, data) {
      state.folderList = data
    },
    SET_UNREAD (state, data) {
      state.unRead = data
    },
    SET_CURRENT_NEWS (state, data) {
      state.currentNews = data
    },
    SET_BANKLIST (state, data) {
      state.bankList = data
    },
    SET_DEVICE (state, data) {
      state.device = data
    }
  },
  actions: {
    getUserInfo ({commit}) {
      fetch.post('/user/queryUserInfo').then(res => {
        if (res.success) {
          commit('SET_ACCOUNT', res.data.user)
        }
      })
    },
    getFolderList ({commit}) {
      fetch.post('/back/getFiles').then(res => {
        if (res.success && res.data) {
          if (localStorage.getItem('lang') === 'en') {
            let d = JSON.stringify(res.data)
            res.data = JSON.parse(d.replace('默认', 'Default'))
          }
          commit('SET_FOLDER_LIST', res.data)
        }
      })
    },
    getUnReadMessage ({commit}) {
      fetch.post('/back/queryMessageList', {
        status: 1
      }).then(res => {
        let list = res.data.data || []
        commit('SET_UNREAD', !!list.length)
      })
    },
    getBalance ({commit, state}) {
      fetch.post('/draw/queryUserBalance').then(res => {
        if (res.data.userAccount.length) {
          let u = state.user
          let obj = Object.assign({}, u, {
            balance: res.data.userAccount[0].balance,
            minAmount: res.data.minAmount,
            maxAmount: res.data.maxAmount,
          })
          commit('SET_ACCOUNT', obj)
        }
      })
    },
    getBankList ({commit}) {
      fetch.post('/bank/queryBankInfoList').then(res => {
        commit('SET_BANKLIST', res.data || [])
      })
    }
  }
})
