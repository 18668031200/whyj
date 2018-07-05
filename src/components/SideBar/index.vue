<template>
  <scroll-bar>
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <!-- <div class="side-bar-title">
        <p>my title</p>
      </div> -->
      <sidebar-item :routes="permission_routers"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from '@/components/SideBarItem'
import ScrollBar from '@/components/ScrollBar'

export default {
  components: { SidebarItem, ScrollBar },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
<style type="text/css" rel="stylesheet/scss" lang="scss" scoped>
  .side-bar-title,.side-bar-title > p{
    position: fixed;
    top: 0px;
    width: 180px !important;
    height: 10%;
    font-size: 20px;
  }

</style>
