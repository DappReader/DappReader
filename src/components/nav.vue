<template>
  <el-header class="header" style="padding: 0 24px">
    <div class="logo" >
      <img src="@/assets/images/logo.png" alt="">
    </div>
    <div class="header-r">
      <div class="chain">
        <el-select
          v-if="network"
          style="width: 100%"
          v-model="network.chainId"
          filterable
          allow-create
          default-first-option
          @change="handleChange"
          placeholder="请选择链条">
          <el-option
            v-for="item in chains"
            :key="item.name"
            :label="item.name"
            :value="item.chainId">
          </el-option>
        </el-select>
      </div>
      <div class="user-info">
        <div class="balance">{{balance}} {{coinName}}</div>
        <div class="address">
          <span @click="isShowDialog=true">{{address}}</span>
          <Jazzicon 
            v-if="address"
            class="jazzicon"
            :diameter="16" 
            :address="fullAddress"
          />
        </div>
      </div>
      <div class="setting">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="Menu__StyledMenuIcon-sc-1s7r6xc-0 eQiQbQ"><path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
      </div>
    </div>
    <div class="dialog" v-if="isShowDialog">
      <div class="dialog-content">
        <div class="dialog-hd">
          <div class="dialog-title">账户</div>
          <div class="dialog-close" @click="isShowDialog=false">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="AccountDetails__CloseColor-sc-75okty-10 loWQUb"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </div>
        </div>
        <div class="dialog-bd">
          <div class="user-info">
            <div class="address">
              <Jazzicon 
                v-if="address"
                class="jazzicon"
                :diameter="16" 
                :address="fullAddress"
              />
              <span >{{address}}</span>
            </div>
          </div>
          <div class="operation">
            <div class="copy" @click="copy">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              <span>复制地址</span>
            </div>
            <div>
              <a :href="'https://rinkeby.etherscan.io/address/'+fullAddress" class="to-etherscan" target="_blank" >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                <span>在以太坊资源浏览器上查看</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-header>
</template>

<script>
import Jazzicon from '../components/Jazzicon'
import {walletSwitchChain} from '../lib/walletSwitchChain'
export default {
  name: 'Header',
  components: {
    Jazzicon: Jazzicon
  },
  computed: {
    chains() {
      return this.$store.state.chains
    },
    balance() {
      let balance = +this.$store.state.balance
      return balance.toFixed(2)
    },
    fullAddress() {
      return this.$store.state.address
    },
    address() {
      let address = this.$store.state.address
      return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''
    },
    network() {
      return this.$store.state.network
    }
  },
  data() {
    return {
      coinName: '',
      chainId: '',
      isShowDialog: false
    }
  },
  watch: {
    network(val) {
      console.log(val)
      let network = val
      let chains = this.$store.state.chains
      let chain = chains.filter(e => e.chainId == network.chainId)[0]
      let coinName = chain && chain.chain || ''
      if (coinName == 'ETH') {
        if (chain.network && chain.network == 'testnet') {
          this.coinName = `${chain.name[0].toLocaleLowerCase()}ETH`
        } else {
          this.coinName = `ETH`
        }
      } else {
        this.coinName = coinName
      }
    }
  },
  async mounted() {

  },
  methods: {
    handleChange(e) {
      this.chainId = e
      walletSwitchChain(e).then(() => {
        this.$store.commit("getWeb3")
      })
    },
    copy() {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(this.fullAddress)
        this.$notify.success({
          title: "成功",
          message: '已成功复制到剪切板',
        });
      }
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #FFFFFF;
  box-shadow: rgba(0, 0 ,0, .08) 0px 0px 5px;
  position: relative;
  z-index: 99;
  .logo {
    img {
      width: 140px;
      height: auto;
    }
  }
  .header-r {
    display: flex;
    align-items: center;
    .user-info {
      display: flex;
      align-items: center;
      padding-left: 10px;
      padding-right: 2px;
      box-sizing: border-box;
      box-shadow: rgba(0, 0 ,0, .08) 0px 0px 5px;
      border-radius: 20px;
      height: 40px;
      margin-left: 20px;
      margin-right: 20px;
      .balance {
        height: 40px;
        display: flex;
        align-items: center;
        margin-right: 8px;
      }
      .address {
        font-size: 0;
        display: flex;
        align-items: center;
        height: 40px;
        background-color: #F7F8FA;
        border-radius: 20px;
        padding: 0 8px;
        box-sizing: border-box;
        height: 36px;
        span {
          font-size: 14px;
          height: 36px;
          line-height: 36px;
          margin-right: 6px;
          cursor: pointer;
        }
        .jazzicon {
          height: 36px;
          display: flex;
          align-items: center;
        }
      }
    }
    .setting {
      display: flex;
      align-items: center;
      padding: 0 10px;
      height: 40px;
      border-radius: 5px;
      box-shadow: rgba(0, 0 ,0, .08) 0px 0px 3px;
    }
  }
  .dialog {
    .user-info {
      display: flex;
      align-items: center;
      padding-left: 10px;
      padding-right: 2px;
      box-sizing: border-box;
      border-radius: 20px;
      height: 40px;
      margin-left: 20px;
      margin-right: 20px;
      .address {
        font-size: 0;
        display: flex;
        align-items: center;
        height: 40px;
        border-radius: 20px;
        padding: 0 8px;
        box-sizing: border-box;
        height: 36px;
        span {
          font-size: 14px;
          height: 36px;
          line-height: 36px;
          margin-right: 6px;
          cursor: pointer;
        }
        .jazzicon {
          height: 36px;
          display: flex;
          align-items: center;
        }
      }
    }
  }
}
.dialog {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, .4);
  display: flex;
  align-items: center;
  justify-content: center;
  .dialog-content {
    background: #FFFFFF;
    border-radius: 10px;
    padding: 20px;
    box-sizing: border-box;
    width: 400px;
    .dialog-hd {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .dialog-title {
        font-size: 16px;
        box-sizing: border-box;
        font-weight: 500;
      }
      .dialog-close {
        cursor: pointer;
      }
    }
    .dialog-bd {
      border: 1px solid rgb(206, 208, 217);
      box-sizing: border-box;
      margin-top: 16px;
      padding: 16px;
      border-radius: 10px;
    }
    .user-info {
      margin: 0;
      padding: 0;
      .address {
        padding: 0;
        .jazzicon {
          margin-right: 8px;
        }
        span {
          color: rgb(0, 0, 0);
          font-weight: 500;
          font-size: 18px;
          box-sizing: border-box;
        }
      }
    }
    .operation {
      display: flex;
      align-items: center;
      margin-top: 20px;
      .to-etherscan {
        margin-left: 20px;
        display: flex;
        align-items: center;
        cursor: pointer;
      }
      .copy {
        display: flex;
        align-items: center;
        cursor: pointer;
      }
      span {
        font-weight: 500;
        color: rgb(110, 114, 125);
        font-size: 12px;
        box-sizing: border-box;
        margin-left: 4px;
      }
    }
  }
}
</style>
<style lang="scss">
  .ant-select-dropdown {
    width: 300px !important;
  }
</style>
