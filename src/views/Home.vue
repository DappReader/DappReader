<template>
  <div class="home" v-loading="loading">
    <PageNav
      @delSol="delSol"
    />
    <el-container>
      <el-aside width="200px">
        <SideMenu @handle="refreshPage" @editSuccess="refreshPage" ref="sideMenu" />
      </el-aside>
      <el-container style="padding: 24px;display:block">
        <el-tabs class="tabs" v-model="openValue" type="card" closable @tab-remove="removeTab" @tab-click="clickTab">
          <el-tab-pane
            v-for="(item) in openSols"
            :key="item.content.id"
            :label="item.title"
            :name="item.content.id"
          >
            <div class="contract-list">
              <el-descriptions
                :labelStyle="{ width: '80px' }"
                class="margin-top"
                :title="item.title"
                :column="4"
                size="middle"
                border
                style="margin-bottom: 10px"
              >
                <template slot="extra">
                  <el-button type="danger" size="small" @click="delSol"
                    >删除合约</el-button
                  >
                  <el-button type="success"  size="small" @click="editSol"
                    >编辑合约</el-button
                  >
                  <el-button type="primary" size="small" @click="changeChain"
                    >跳转当前链</el-button
                  >
                </template>
                <el-descriptions-item>
                  <template slot="label"> 创建时间 </template>
                  {{ item.content.createAt ? formatDate(item.content.createAt) : '--' }}
                </el-descriptions-item>

                <el-descriptions-item>
                  <template slot="label"> 链条 </template>
                  {{ item.content.chain && item.content.chain.chainName || '该合约未选择网络' }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label"> 合约余额 </template>
                  <div style="cursor: pointer">
                    {{ item.content.balanceInEth }}
                  </div>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label"> 合约地址 </template>
                  <div @click="copy(item.content.address, 'address')" style="cursor: pointer">
                    {{ item.content.address | slim_address }} <i class="el-icon-copy-document" style="cursor: pointer;margin-left:10px"></i>
                  </div>
                </el-descriptions-item>
                <el-descriptions-item >
                  <template slot="label"> ABI </template>
                  <div @click="copy(item.content.abi, 'abi')" style="cursor: pointer">
                    点击复制ABI <i class="el-icon-copy-document" style="cursor: pointer;margin-left:10px" ></i>
                  </div>
                  
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label"> 备注 </template>
                  {{item.content.remark || '--'}}
                </el-descriptions-item>
              </el-descriptions>
              <sol-body 
                :address="item.content.address" 
                :result="item.result || []" 
                :abi="item.content.abi" 
                :chain="item.content.chain" 
                :sol="item.content"
                @updateSol="updateSol"
                @resulted="resulted" 
                @changeChain="changeChain"></sol-body>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import NewContract from "@/components/newContract.vue";
import PageNav from "@/components/nav.vue";
import SolBody from "../components/SolBody.vue";
import SideMenu from "../components/SideMenu.vue";
import { getLs, setLs } from "../service/service";
import { walletSwitchChain } from '../lib/walletSwitchChain'
import { formatDate } from '../utils/utils'
import { ethers } from 'ethers'
export default {
  name: "Home",
  components: {
    SolBody,
    NewContract,
    PageNav,
    SideMenu
  },
  computed: {
    web3() {
      return this.$store.state.web3
    },
    address() {
      let address = this.$store.state.address
      return address
    },
    network() {
      let network = this.$store.state.network
      return network
    },
    activeId() {
      let activeId = this.$store.state.activeId
      return activeId
    },
    openSols() {
      let openSols = this.$store.state.openSols
      let data = openSols
      data.forEach(async (e, index) => {
        e.content.balanceInEth = await this.getBalance(e.content)
        openSols[index] = e
      })
      // openSols = data
      return openSols
    },
    menuList() {
      let menuList = this.$store.state.menuList
      return menuList
    },
    contractList() {
      let contractList = this.$store.state.contractList
      return contractList
    },
  },
  data() {
    return {
      openValue: this.activeId,
      db: [],
      loading: false,
      now_address_id: "0",
      sol: {},
      tabIndex: 0
    };
  },
  filters: {
    slim_address(addr = '') {
      return `${addr.slice(0, 4)}......${addr.slice(-4)}`;
    },
  },
  watch: {
    activeId(val) {
      console.log(val)
      this.openValue = val
      // this.$store.commit("setMenuList", this.activeId)
    },
    openSols: {
      handler(val) {
        console.log(val)
      },
      deep: true
    }
  },
  mounted() {
    let token = this.$route.params.token
    if (token) {
      this.checkContractInfo(token)
    }
    this.refreshPage()
  },
  methods: {
    async getBalance(content) {
      if (this.web3 && content) {
        let balance = await this.web3.getBalance(content.address)
        let balanceInEth = await ethers.utils.formatEther(balance)
        return balanceInEth
      } else {
        return 0
      }
    },
    resulted(result) {
      console.log(result)
      let openSols = this.openSols
      openSols.forEach(e => {
        if (e.content.id == this.activeId) {
          if (!e.result) e.result = [] 
          e.result.unshift(result)
        }
      })
      setLs('openSols', JSON.parse(JSON.stringify(openSols))).then(res => {
        this.$store.commit("setOpenSols", res)
      })
    },
    updateSol(sol) {
      let openSols = this.openSols
      let contractList = this.contractList
      let menuList = this.menuList
      openSols.forEach(e => {
        if (e.content.id == this.activeId) {
          e.content = sol
        }
      })
      contractList.forEach((e, index) => {
        if (e.id == this.activeId) {
          contractList[index] = sol
        }
      })
      for (let i = 0; i < menuList.length; i++) {
        let son = menuList[i].son
        son.forEach((e, index) => {
          if (e.id == this.activeId) {
            son[index] = sol
          }
        })
        menuList[i].son = son
      }
      setLs('openSols', JSON.parse(JSON.stringify(openSols))).then(res => {
        console.log(res)
        this.$store.commit("setOpenSols", res)
      })
      setLs('contractList', JSON.parse(JSON.stringify(contractList))).then(res => {
        console.log(res)
        this.$store.commit("setContractList", res)
      })
      setLs('menuList', JSON.parse(JSON.stringify(menuList))).then(res => {
        console.log(res)
        this.$store.commit("setMenuList", res)
      })
    },
    formatDate(time) {
      return formatDate('YYYY-mm-dd', time)
    },
    
    clickTab() {
      this.$store.commit("setActiveId", this.openValue)
      setLs('activeId', [this.openValue]).then(res => {
        console.log(res)
      })
    },
    addTab(sol) {
      console.log(sol)
      let openSols = this.openSols
      if (openSols.some(e => e.content.id == sol.id)) return
      openSols.push({
        title: sol.name,
        name: sol.id,
        content: sol
      });
      let activeId = sol.id
      this.$store.commit("setActiveId", sol.id)
      this.$store.commit("setOpenSols",openSols)
      setLs('openSols', openSols).then(res => {
        console.log(res)
      })
      setLs('activeId', [activeId]).then(res => {
        console.log(res)
      })
    },
    removeTab(targetName) {
      let openSols = this.openSols || []
      let activeName = this.activeId;
      if (activeName === targetName) {
        openSols.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = openSols[index + 1] || openSols[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      openSols = openSols.filter(e => e.content.id !== targetName)
      this.$store.commit("setActiveId", activeName)
      this.$store.commit("setOpenSols", openSols)
      setLs('openSols', openSols).then(res => {
        console.log(res)
      })
      setLs('activeId', [activeName]).then(res => {
        console.log(res)
      })
    },
    changeChain() {
      let sol = this.openSols.filter(e => e.content.id == this.activeId)
      if (sol && sol.length) sol = sol[0].content
      if (sol.chain.chainId != web3.currentProvider.chainId) {
        walletSwitchChain(sol.chain.chainId).then(() => {
          this.$store.commit("getWeb3")
          this.$notify.success({
            title: '成功',
            message: '已成功切换到对应链条',
          })
        }).catch(err => {
          this.$notify.error({
            title: '错误',
            message: err,
          })
        })
      } else {
        this.$notify({
          title: '提示',
          message: '已处于当前链条',
        });
      }
    },
    copy(value, type) {
      if (type == 'address') {
       value = value.replace(/\"/g, "")
      } else if (type == 'abi') {
        value = value.map(e => {
          delete e.otherName
          return e
        })
        value = JSON.stringify(value)
      } else {
        value = JSON.stringify(value)
      }
      if (navigator.clipboard) {
        navigator.clipboard.writeText(value)
        this.$notify.success({
          title: "成功",
          message: '已成功复制到剪切板',
        });
      }
    },

    select_contract({ index }) {
      setLs("now_address_id", index).then((res) => {
        console.log(res);
      });
    },

    editSol() {
      let sol = this.openSols.filter(e => e.content.id == this.activeId)
      if (sol && sol.length) sol = sol[0].content
      if (sol && sol.address) {
        this.$refs.sideMenu.editSol(sol)
      } else {
        this.$notify.error({
          title: "错误",
          message: '请先选择合约',
        });
      }
    },

    delSol() {
      let sol = this.openSols.filter(e => e.content.id == this.activeId)
      if (sol && sol.length) sol = sol[0].content
      if (sol && sol.address) {
        this.$refs.sideMenu.delSol(sol)
      } else {
        this.$notify.error({
          title: "错误",
          message: '请先选择合约',
        });
      }
    },

    refreshPage(value) {
      if (value) {
        this.addTab(value)
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.home {
  min-height: 100vh;
}
.tabs {
  width: 100%;
}
</style>
<style lang="scss">
.home {
  .el-tabs--card>.el-tabs__header .el-tabs__nav {
    height: 34px;
    line-height: 34px;
  }
  .el-tabs__item {
    height: 34px;
    line-height: 34px;
    font-weight: 400;
  }
  .el-tabs__item.is-active {
    color: #3997EE;
  }
  .contract-list {
    .el-descriptions__header {
      margin-bottom: 10px;
    }
  }
}
</style>
