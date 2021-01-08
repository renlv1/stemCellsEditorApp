import Vue from 'vue'
import VueI18n from 'vue-i18n'
import {messages} from './data'

Vue.use(VueI18n)

let lan = 'cn' // 默认为中文
export const i18n = new VueI18n({
  locale: lan, // set locale
  messages, // set locale messages
  silentTranslationWarn: true
})

let language = navigator.browserLanguage ? navigator.browserLanguage : navigator.language
let langSub = language.substr(0, 2) // 获取lang字符串的前两位

if (localStorage.getItem('lang')) {
  i18n.locale = localStorage.getItem('lang').toLowerCase()
} else {
  if (langSub === 'zh') {
    localStorage.setItem('lang', 'cn')
    lan = 'cn'
  } else {
    localStorage.setItem('lang', 'en')
    lan = 'en'
  }
  i18n.locale = lan
}
