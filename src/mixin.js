export default {
  methods: {
    $status2text (status, isRecharge) {
      let statusText = ''
      if (isRecharge) {
        switch (status) {
          case 0:
            statusText = '新创建'
            break
          case 2:
            statusText = '待老板接单'
            break
          case 3:
            statusText = '老板拒绝接单'
            break
          case 4:
            statusText = '老板待支付保证金'
            break
          case 5:
            statusText = '待用户打款'
            break
          case 6:
            statusText = '待钱老板收款'
            break
          case 7:
            statusText = '待交易完成'
            break
          case 8:
            statusText = '交易完成'
            break
          case 9:
            statusText = '交易取消'
            break
          case 10:
            statusText = '保证金支付中'
            break
        }
      } else {
        switch (status) {
          case 1:
            statusText = '待选择钱老板'
            break
          case 2:
            statusText = '待支付'
            break
          case 3:
            statusText = '待老板接单'
            break
          case 4:
            statusText = '老板拒绝接单'
            break
          case 5:
            statusText = '待老板打款'
            break
          case 6:
            statusText = '待用户收款'
            break
          case 7:
            statusText = '待交易完成'
            break
          case 8:
            statusText = '交易完成'
            break
          case 9:
            statusText = '交易取消'
            break
          case 10:
            statusText = '交易完成，打款失败'
            break
          case 11:
            statusText = '用户支付中'
            break
        }
      }
      return statusText
    }
  }
}