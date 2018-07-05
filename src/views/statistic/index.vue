<template>
  <div class="app-container">
    <panel-group ></panel-group>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData"></line-chart>
    </el-row>
  </div>
</template>
<script type="text/javascript">
import LineChart from '@/components/LineChart'
import PanelGroup from '@/components/PanelGroup'
const lineChartData = {
  newVisitis: {
    expectedData: [102, 112, 161, 134, 105, 160, 125],
    actualData: [10, 12, 9, 4, 16, 40, 14],
    warnData: [4,1,2,3,4,5,2]
  }
}
  export default{
    name:'statistic',
    components: {
      LineChart,
      PanelGroup
    },
    data() {
    return {
      lineChartData: lineChartData.newVisitis
    }
  }
  }
</script>