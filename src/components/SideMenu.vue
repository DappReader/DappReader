<template>
  <div>
    <el-menu
      :default-active="activeId"
      class="el-menu-vertical"
      @open="handleOpen"
      @close="handleClose"
      text-color="#606266"
      active-text-color="#3997EE"
    >
      <div class="add">
        <div class="addSol" @click="addSol">+添加合约</div>
        <div class="addFolder" @click="addCollection">
          <svg t="1656934681102" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5677" width="18" height="18"><path d="M970.666667 213.333333H546.586667a10.573333 10.573333 0 0 1-7.54-3.126666L429.793333 100.953333A52.986667 52.986667 0 0 0 392.08 85.333333H96a53.393333 53.393333 0 0 0-53.333333 53.333334v704a53.393333 53.393333 0 0 0 53.333333 53.333333h874.666667a53.393333 53.393333 0 0 0 53.333333-53.333333V266.666667a53.393333 53.393333 0 0 0-53.333333-53.333334zM661.333333 554.666667H554.666667v106.666666a21.333333 21.333333 0 0 1-42.666667 0V554.666667H405.333333a21.333333 21.333333 0 0 1 0-42.666667h106.666667V405.333333a21.333333 21.333333 0 0 1 42.666667 0v106.666667h106.666666a21.333333 21.333333 0 0 1 0 42.666667z" fill="#2c2c2c" p-id="5678"></path></svg>
        </div>
      </div>
        <el-submenu v-for="(item, index) in menuList" :key="index" :index="index + ''">
          <template slot="title">
            <div v-right-click:[{index}]="rightMenuObj">
              <svg v-if="isOpen(index)" t="1656934382932" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5201" width="12" height="12"><path d="M1003.153333 404.96a52.933333 52.933333 0 0 0-42.38-20.96H896V266.666667a53.393333 53.393333 0 0 0-53.333333-53.333334H461.253333a10.573333 10.573333 0 0 1-7.54-3.126666L344.46 100.953333A52.986667 52.986667 0 0 0 306.746667 85.333333H53.333333a53.393333 53.393333 0 0 0-53.333333 53.333334v704a53.393333 53.393333 0 0 0 53.333333 53.333333h796.893334a53.453333 53.453333 0 0 0 51.453333-39.333333l110.546667-405.333334a52.953333 52.953333 0 0 0-9.073334-46.373333zM53.333333 128h253.413334a10.573333 10.573333 0 0 1 7.54 3.126667l109.253333 109.253333A52.986667 52.986667 0 0 0 461.253333 256H842.666667a10.666667 10.666667 0 0 1 10.666666 10.666667v117.333333H173.773333a53.453333 53.453333 0 0 0-51.453333 39.333333L42.666667 715.366667V138.666667a10.666667 10.666667 0 0 1 10.666666-10.666667z m917.726667 312.14l-110.546667 405.333333a10.666667 10.666667 0 0 1-10.286666 7.86H63.226667a10.666667 10.666667 0 0 1-10.286667-13.473333l110.546667-405.333333A10.666667 10.666667 0 0 1 173.773333 426.666667h787a10.666667 10.666667 0 0 1 10.286667 13.473333z" fill="#707070" p-id="5202"></path></svg>
              <svg v-else t="1656934424410" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5414" width="12" height="12"><path d="M970.666667 213.333333H546.586667a10.573333 10.573333 0 0 1-7.54-3.126666L429.793333 100.953333A52.986667 52.986667 0 0 0 392.08 85.333333H96a53.393333 53.393333 0 0 0-53.333333 53.333334v704a53.393333 53.393333 0 0 0 53.333333 53.333333h874.666667a53.393333 53.393333 0 0 0 53.333333-53.333333V266.666667a53.393333 53.393333 0 0 0-53.333333-53.333334z m10.666666 629.333334a10.666667 10.666667 0 0 1-10.666666 10.666666H96a10.666667 10.666667 0 0 1-10.666667-10.666666V138.666667a10.666667 10.666667 0 0 1 10.666667-10.666667h296.08a10.573333 10.573333 0 0 1 7.54 3.126667l109.253333 109.253333A52.986667 52.986667 0 0 0 546.586667 256H970.666667a10.666667 10.666667 0 0 1 10.666666 10.666667z m-298.666666-309.333334a21.333333 21.333333 0 0 1-21.333334 21.333334H405.333333a21.333333 21.333333 0 0 1 0-42.666667h256a21.333333 21.333333 0 0 1 21.333334 21.333333z" fill="#707070" p-id="5415"></path></svg>
              <span slot="title">{{ item.name }}</span>
            </div>
          </template>
          <el-menu-item v-for="(ite, i) in item.son" :key="i" @click="handleSol(ite)" :index="ite.id" v-right-click:[ite]="rightMenuObj1">
            <div class="menu-item-sol">
              <img src="@/assets/images/solidity_logo.svg" alt="" style="width:18px">
              {{ ite.name }}
            </div>
          </el-menu-item>
        </el-submenu>
        <el-menu-item v-for="item in contractList" :key="item.id" :index="item.id"  @click="handleSol(item)" v-right-click:[item]="rightMenuObj1">
          <!-- <svg t="1656948123469" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8575" width="18" height="18"><path d="M870.4 358.4h-204.8a102.4 102.4 0 0 1-102.4-102.4V51.2H204.8a51.2 51.2 0 0 0-51.2 51.2v819.2a51.2 51.2 0 0 0 51.2 51.2h614.4a51.2 51.2 0 0 0 51.2-51.2V358.4z m-21.1968-51.2L614.4 72.3968V256a51.2 51.2 0 0 0 51.2 51.2h183.6032z m-277.1968-307.2a102.4 102.4 0 0 1 72.3968 30.0032l247.1936 247.1936A102.4 102.4 0 0 1 921.6 349.5936V921.6a102.4 102.4 0 0 1-102.4 102.4H204.8a102.4 102.4 0 0 1-102.4-102.4V102.4a102.4 102.4 0 0 1 102.4-102.4h367.2064z" fill="#2c2c2c" p-id="8576"></path></svg> -->
          <img src="@/assets/images/solidity_logo.svg" alt="" style="width:18px">
          <el-tag v-if="item.isImport" type="info" style="padding: 0 4px;font-size:12px;height: 20px;line-height:20px;transform: scale(.7);margin-left:-4px">导入</el-tag>
          <span slot="title">{{ item.name }}</span>
        </el-menu-item>
      <div class="group">
        <el-image 
          class="img"
          :src="imgUrl" 
          :preview-src-list="srcList">
        </el-image>
        <!-- <img src="@/assets/images/group.png" alt=""> -->
      </div>
    </el-menu>
    <AddCollection @add="addMenu" ref="addCollection" />
    <NewContract ref="newContract" @refresh="refresh" />
  </div>
</template>
<script>
import AddCollection from './AddCollection.vue'
import NewContract from "./newContract.vue";
import { setLs } from "../service/service";
import group from '../assets/images/group.png'
import groupQrCode from '../assets/images/groupQRCode.jpg'
export default {
  name: "Menu",
  components: {AddCollection, NewContract},
  computed: {
    openSols() {
      let openSols = this.$store.state.openSols
      return openSols
    },
    activeId() {
      let activeId = this.$store.state.activeId
      return activeId
    },
    menuList() {
      let menuList = this.$store.state.menuList
      return menuList
    },
    contractList() {
      let contractList = this.$store.state.contractList
      return contractList
    },
    rightMenuObj1() {
      let _this = this
      const obj = {
        text: [
          "删除合约"
        ],
        handler: {
          del(sol) {
            _this.delSol(sol)
            // console.log(index, address);
          }
        }
      };
      return obj;
    },
    rightMenuObj() {
      let _this = this
      const obj = {
        text: [
          "置顶",
          "添加合约",
          "删除文件夹"
        ],
        handler: {
          setTop({index}) {
            _this.setTop(index)
          },
          addSol({index}) {
            _this.addSol(index)
          },
          delCollection({index}) {
            _this.delCollection(index)
          }
        }
      };
      return obj;
    }
  },
  data() {
    return {
      isShowDel: false,
      addIndex: -1,
      openKeys: [],
      imgUrl: group,
      srcList: [groupQrCode]
    }
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    delSol(sol) {
      console.log(sol)
      this.$confirm("此操作将永久删除该合约信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        let openSols = this.openSols
        let menuList = this.menuList
        let contractList = this.contractList
        let id = sol.id
        for (let i = 0; i < menuList.length; i++) {
          let son = menuList[i].son
          son.forEach((e, index) => {
            if (e.id == id) {
              son.splice(index, 1)
            }
          })
          menuList[i].son = son
        }
        contractList.forEach((e, index) => {
          if (e.id == id) {
            contractList.splice(index, 1)
          }
        })
        openSols.forEach((e, index) => {
          if (e.name == id) {
            openSols.splice(index, 1)
          }
        })
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
      })
    },
    editSol(sol) {
      let solData = JSON.parse(JSON.stringify(sol))
      console.log(solData)
      solData.chain = solData.chain.chainId
      solData.abi = JSON.stringify(solData.abi)
      this.$refs.newContract.form = solData;
      this.$refs.newContract.open();
    },
    addSol(index) {
      this.$refs.newContract.form = {
        name: "",
        address: "",
        abi: "",
        chain:""
      }
      this.$refs.newContract.open();
      this.addIndex = index
    },
    refresh({name, address, abi, chain, id, remark, createAt = '', isImport = false}) {
      let openSols = this.openSols
      let menuList = this.menuList
      let contractList = this.contractList
      try {
        abi = JSON.parse(abi)
      } catch (error) {
        console.log(abi)
        let data = JSON.stringify(abi).replace(/\'/g, '"')
        console.log(JSON.parse(data))
      }
      if (id) {
        let info = {name, address, abi, chain, id, remark, createAt}
        for (let i = 0; i < menuList.length; i++) {
          let son = menuList[i].son
          son.forEach((e, index) => {
            if (e.id == id) {
              son[index] = info
            }
          })
          menuList[i].son = son
        }
        contractList.forEach((e, index) => {
          if (e.id == id) {
            contractList[index] = info
          }
        })
        openSols.forEach((e, index) => {
          if (e.name == id) {
            openSols[index].content = info
            openSols[index].title = name
          }
        })
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
      } else {
        if (contractList.some(e => e.address == address)) {
          this.$message({
            message: '该合约已存在',
            type: 'warning'
          })
          return
        }
        for (let i = 0; i < menuList.length; i++) {
          let son = menuList[i].son
          if (son.some(e => e.address == address)) {
            this.$message({
              message: '该合约已存在',
              type: 'warning'
            })
            return
          }
        }
        id = address + new Date().getTime()
        const info = { name, address, abi, chain, id, remark, createAt: new Date().getTime(), isImport}
        if (this.addIndex > -1) {
          let collection = menuList[this.addIndex]
          collection.son.push(info)
          menuList[this.addIndex] = collection
          setLs('menuList', JSON.parse(JSON.stringify(menuList))).then(res => {
            this.$store.commit("setMenuList", res)
          })
        } else {
          contractList.push(info)
          setLs('contractList', JSON.parse(JSON.stringify(contractList))).then(res => {
            this.$store.commit("setContractList", res)
          })
        }
        this.handleSol(info)
      }
    },
    addCollection() {
      this.$refs.addCollection.open()
    },
    delCollection(index) {
      this.$confirm("此操作将永久删除文件夹以及内部合约, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        let menuList = this.menuList
        let collection = menuList[index]
        let son = collection.son || []
        let openSols = this.openSols
        for (let i = 0; i < son.length; i++) {
          openSols.forEach((e, j) => {
            if (e.name == son[i].id) {
              openSols.splice(j, 1)
            }
          })
        }
        setLs('openSols', JSON.parse(JSON.stringify(openSols))).then(res => {
          this.$store.commit("setOpenSols", res)
        })
        menuList.splice(index, 1)
        setLs('menuList', JSON.parse(JSON.stringify(menuList))).then(res => {
          this.$store.commit("setMenuList", res)
        })
      })
    },
    addMenu(e) {
      let menuList = this.menuList
      menuList.push(e)
      setLs('menuList', JSON.parse(JSON.stringify(menuList))).then(res => {
        this.$store.commit("setMenuList", res)
      })
    },
    async handleSol(e) {
      this.$store.commit("setActiveId", e.id)
      await setLs('activeId', [ e.id])
      this.$emit('handle', e)
    },
    setTop(index) {
      let menuList = this.menuList
      let item = menuList.splice(index, 1)[0]
      menuList.unshift(item)
      setLs('menuList', JSON.parse(JSON.stringify(menuList))).then(res => {
        this.$store.commit("setMenuList", res)
      })
    },
    handleOpen(e) {
      this.openKeys.push(e)
    },
    handleClose(e) {
      this.openKeys.splice(this.openKeys.indexOf(e), 1)
    },
    isOpen(index) {
      return this.openKeys.indexOf(index + '') > -1
    },
  },
}
</script>
<style lang="scss" scoped>
.el-menu-vertical {
  min-height: calc(100vh - 60px);
  position: relative;
  padding-bottom: 60px;
  box-sizing: border-box;
}
.add {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e6e6e6;
  padding-bottom: 16px;
  padding: 16px;
  box-sizing: border-box;
  .addSol {
    width: 80px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    border-radius: 5px;
    background: #3997EE;
    color: #FFFFFF;
    cursor: pointer;
  }
  .addFolder {
    height: 18px;
    margin-left: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
  }
}
.add-sol {
  font-size: 14px;
  height: 30px;
  line-height: 30px;
  padding: 0 25px;
  min-width: 200px;
  // text-align: center;
  box-sizing: border-box;
  color: rgb(236, 85, 45);
  // border-top: 1px solid #e6e6e6;
  border-bottom: 1px solid #e6e6e6;
  cursor: pointer;
}
.group {
  position: fixed;
  left: 0;
  bottom: 0;
  box-sizing: border-box;
  width: 200px;
  margin-top: 40px;
  padding: 10px;
  cursor: pointer;
  .img {
    width: 100%;
    height: auto;
  }
}
.icon {
  width: 14px;
  height: auto;
  margin-right: 10px;
}
.menu-item-sol {
  display: flex;
  align-items: center;
}
</style>
<style>
.right-menu ul li:last-child {
  display: none;
}
.el-menu-vertical .el-submenu__title {
  height: 44px;
  line-height: 44px;
}
.el-menu-vertical .el-submenu .el-menu-item {
  height: 36px;
  line-height: 36px;
}
.el-menu-vertical .el-menu-item {
  height: 44px;
  line-height: 44px;
}
</style>