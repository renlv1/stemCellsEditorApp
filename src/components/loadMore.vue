<template>
  <div class="load-list-wrap">
    <div class="web-loading" v-show="total < 0"></div>
    <slot></slot>
    <div v-if="!list.length" class="empty">
      <img src="@img/empty.png" alt>
      <p>{{$t('common.empty')}}</p>
    </div>
    <div class="el-pagination-wrap" v-show="isPC && list.length">
      <el-pagination
        layout="prev, pager, next"
        @current-change="emit"
        :page-size="pageSize"
        :current-page.sync="pageIndex"
        :hide-on-single-page="true"
        :total="total">
      </el-pagination>
    </div>

    <div style="height: 40px;">
      <div class="loading-tips web-loading" v-show="!isPC && isLoading" style="position: static;padding: 20px;">
    </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      path: this.$route.path,
      pageIndex: 1,
      clientHeight: window.innerHeight, // 窗口高度
      isLoading: false
    }
  },
  props: {
    list: Array,
    total: Number,
    pageSize: {
      type: Number,
      default: 10
    },
  },
  computed: {
    noMore () {
      if (this.$parent.pageIndex === 2  && this.list.length < 10) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    resetPageIndex () {
      this.pageIndex = 1
    },
    done () {
      this.isLoading = false
      this.$parent.pageIndex++
    },
    emit(index) {
      this.$emit('change', index)
    },
    scroll () {
      let docHeight = document.documentElement.scrollHeight || document.body.scrollHeight // 页面总高度
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop // 滚动条高度
      let totalHeight = docHeight - 100 // 减去阈值后的总高度
      let totalScroll = this.clientHeight + scrollTop // 窗口高度加上滚动条高度后的总距离

      if (totalScroll > totalHeight && !this.isLoading && !this.noMore) {
        this.isLoading = true
        this.$emit('change', this.$parent.pageIndex)
      }
    },
    bind () {
      if (!this.isPC) {
        window.addEventListener('scroll', this.scroll)
      }
    },
    unBind () {
      window.removeEventListener('scroll', this.scroll)
    },
  },
  mounted() {
    this.$emit('change', 1)
    this.isLoading = true
    this.bind()
  },
  beforeDestroy () {
    this.unBind()
  },
  activated () {
    this.bind()
  },
  deactivated () {
    this.unBind()
  }
}
</script>

<style lang="less" scoped>
  .load-list-wrap{
    position: relative;
    min-height: 300px;
  }
  .web-loading{
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 5;
    background-color: #fbfbfb;
    @media @mob {
      background-color: #fff;
    }
  }
</style>
