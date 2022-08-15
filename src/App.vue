<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
import { getLs, setLs } from "./service/service";
// import { fetcher } from './utils/utils'
import { demo } from './assets/js/demo'
export default {
  created() {
    // this.getChains()
    this.getData()
  },
  async mounted() {
    this.$store.commit("getWeb3")
    this.fn()
  },
  methods: {
    // async getChains() {
    //   let chains = await fetcher('https://chainid.network/chains.json')
    //   this.$store.commit("setChains", chains)
    // },
    getData() {
      let inited = localStorage.inited
      console.log(inited)
      getLs('menuList').then(res => {
        let menuList = []
        if (res && res.length) {
          menuList = res
        } else {
          menuList = []
        }
        this.$store.commit("setMenuList", menuList)
      })
      getLs('contractList').then(res => {
        let contractList = []
        if (res && res.length) {
          contractList = res
        } else {
          if (inited) {
            contractList = []
          } else {
            contractList = [demo]
            localStorage.setItem('inited', true)
            setLs('contractList', JSON.parse(JSON.stringify(contractList))).then(() => {})
          }
        }
        this.$store.commit("setContractList", contractList)
      })
      getLs('openSols').then(res => {
        let openSols = []
        if (res && res.length) {
          openSols = res
        } else {
          if (inited) {
            openSols = []
          } else {
            openSols = [{
              name: demo.id,
              content: demo,
              title: demo.name
            }]
            setLs('openSols', JSON.parse(JSON.stringify(openSols))).then(() => {})
          }
        }
        this.$store.commit("setOpenSols", openSols)
      })
      getLs('activeId').then(res => {
        console.log(res)
        let activeId = ''
        if (res && res.length) {
          activeId = res[0]
        } else {
          if (!inited) {
            activeId = '0x08A491103Cf5e52A64bbd76cfC8A25C02be36dE9'
            setLs('activeId', [activeId]).then(() => {})
          }
        }
        this.$store.commit("setActiveId", activeId)
      })
    },
    fn() {
      ethereum.on("accountsChanged", (accounts) => {
        console.log("账号切换", accounts[0])
        this.$store.commit("getWeb3");
      })
      ethereum.on("chainChanged", (chainId) => {
        console.log("用户切换了链", chainId);
        this.$store.commit('getWeb3')
      });
    },
  },
};
</script>
<style lang="scss"></style>
