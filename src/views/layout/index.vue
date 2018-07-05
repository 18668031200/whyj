<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
    <side-bar class="sidebar-container"></side-bar>
    <div class="main-container">
      <nav-bar></nav-bar>
      <tags-view></tags-view>
      <app-main></app-main>
    </div>
  </div>
</template>

<script type="text/javascript">
import NavBar from '@/components/NavBar'
import SideBar from '@/components/SideBar'
import AppMain from '@/components/Main'
import TagsView from '@/components/TagsView'

  export default {
    name: 'layout',
    components: {
      NavBar,
      SideBar,
      AppMain,
      TagsView
    },
    computed: {
      sidebar() {
        return this.$store.state.app.sidebar
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/style/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
  }
</style>