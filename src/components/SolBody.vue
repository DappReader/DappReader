<template>
  <div class="sol-body">
    <el-menu
      class="el-menu-vertical"
      :default-openeds="['1', '2']"
      text-color="#606266"
      active-text-color="#3997EE"
    >
      <el-submenu index="1">
        <template slot="title">
          <span style="display: flex;align-items: center;"><span style="color: rgb(22, 155, 93);margin-right:.3em">Read</span>读函数</span>
        </template>
        <el-menu-item v-for="(item, index) in abiList.readAbi" :key="index" :index="'1-' + index" @click="selectMenu(item)">
          <span slot="title">
            <p class="fun-other-name">{{item.otherName || item.name}}</p>
            <p class="fun-name" v-if="item.otherName">{{item.name}}</p>
          </span>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="2" style="margin-top: 12px">
        <template slot="title">
          <span style="display: flex;align-items: center;"><span style="color: rgb(57, 151, 238);margin-right:.3em">Write</span>写函数</span>
        </template>
        <el-menu-item v-for="(item, index) in abiList.writeAbi" :key="index" :index="'2-' + index" @click="selectMenu(item)">
          <p class="fun-other-name">{{item.otherName || item.name}}</p>
          <p class="fun-name" v-if="item.otherName">{{item.name}}</p>
        </el-menu-item>
      </el-submenu>
    </el-menu>
    <div class="right">
      <div v-if="(fun && fun.name) || (result && result.length)">
        <div v-if="fun && fun.name" class="right-section-wrap" style="margin-bottom: 10px;" v-loading="loading">
          <div class="fun-title">{{fun.name}} <i class="el-icon-close" @click="delFun"></i></div>
          <div class="right-section" @click="showFunSet = !showFunSet">
            <span class="section-title" @click.stop :style="{top: showFunSet ? '-.5em' : '.9em'}">设置备注 <span v-show="!showFunSet">/函数别名</span></span>
            <div class="section-wrap" @click.stop :style="{height: showFunSet ? '66px' : '0', opacity: showFunSet ? 1 : 0}">
              <div class="section-form" style="width: 50%">
                <div class="form-label">函数别名</div>
                <div class="form-input">
                  <el-input v-model="otherName" placeholder="别名" ></el-input>
                  <el-button type="primary" size="small" class="section-btn" @click="saveOtherName">保存</el-button>
                </div>
              </div>
            </div>
            <div class="show-arrow" @click.stop="showFunSet = !showFunSet">
              <i class="el-icon-arrow-down" :style="{transform: showFunSet? 'rotate(180deg)' : ''}"></i>
            </div>
          </div>
          <div v-if="fun.inputs && fun.inputs.length" class="right-section">
            <span class="section-title">参数</span>
            <div>
              <div class="section-form" v-for="(input, index) in fun.inputs" :key="index">
                <div class="form-label"><div>{{input.name}} <span>数据类型：{{input.type}}</span></div> <div v-if="isUint(input.type)" class="sort" @click="conversion(input.name)">数字转换<i class="el-icon-sort"></i></div></div>
                <div class="form-input">
                  <el-input v-model="formData[input.name]" autosize :type="isTextarea(input.type) ? 'textarea' : ''" :placeholder="isTextarea(input.type) ? input.type + '可用换行或逗号隔开' : input.type" style="width: 50%"></el-input>
                </div>
              </div>
            </div>
          </div>
          <div class="right-section" v-if="fun.stateMutability != 'view'"  @click="showSendSet = !showSendSet">
            <span class="section-title" @click.stop :style="{top: showSendSet ? '-.5em' : '.9em'}">附带参数 <span v-show="!showSendSet">/value/gasPrice</span></span>
            <div class="section-send-info" :style="{height: showSendSet ? '156px' : '0', opacity: showSendSet ? 1 : 0}" @click.stop>
              <div class="section-form" >
                <div class="form-label"><div>Value <span>执行合约时附带ETH数量</span></div> <div class="sort" @click="conversion('payableValue')">数字转换<i class="el-icon-sort"></i></div></div>
                <div class="form-input">
                  <el-input v-model="formData['payableValue']" autosize placeholder="0" style="width: 50%"></el-input>
                </div>
              </div>
              <div class="section-form" >
                <div class="form-label"><div>gasPrice <span></span></div> <div class="sort" @click="conversion('gasPrice')">数字转换<i class="el-icon-sort"></i></div></div>
                <div class="form-input">
                  <el-input v-model="formData['gasPrice']" autosize placeholder="0" style="width: 50%"></el-input>
                </div>
              </div>
            </div>
            <div class="show-arrow" @click.stop="showSendSet = !showSendSet">
              <i class="el-icon-arrow-down" :style="{transform: showSendSet? 'rotate(180deg)' : ''}"></i>
            </div>
          </div>
          <el-button type="primary" size="small" style="padding: 8px 25px;margin-top:20px" @click="apply">执行</el-button>
        </div>
        <div class="result right-section-wrap" v-for="(item, index) in result" :key="index">
          <div class="result-hd">
            <div class="result-title">运行函数：{{item.name}} <span v-if="item.createAt">{{formatDate(item.createAt)}}</span></div>
            <div class="result-hash" v-if="item.content && item.content.hash">HASH: {{item.content.hash | slimAddress}} 
              <svg @click="copy(item.content.hash, 'address')" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              <svg @click="toEtherscan(item.content.hash)" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </div>
            <div class="result-hash" v-else-if="item.content && item.content.transactionHash">HASH: {{item.content.transactionHash| slimAddress}}
              <svg @click="copy(item.content.transactionHash, 'address')" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              <svg @click="toEtherscan(item.content.transactionHash)" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </div>
          </div>
          <div v-if="item.formDataList && item.formDataList.length" class="result-tb">
            <div class="resilt-tr" v-for="query in item.formDataList" :key="query.key">
              <div class="resilt-td resilt-td-key">{{query.key}}</div>
              <div class="resilt-td">{{query.value}}</div>
            </div>
          </div>
          <div class="result-content">
            <div class="result-text">
              <svg v-if="item.state == 'success' || item.state == 'receiptSuccess'" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" class="icon-success"><path d="M24,4 C35.045695,4 44,12.954305 44,24 C44,35.045695 35.045695,44 24,44 C12.954305,44 4,35.045695 4,24 C4,12.954305 12.954305,4 24,4 Z M34.5548098,16.4485711 C33.9612228,15.8504763 32.9988282,15.8504763 32.4052412,16.4485711 L32.4052412,16.4485711 L21.413757,27.5805811 L21.413757,27.5805811 L21.4034642,27.590855 C21.0097542,27.9781674 20.3766105,27.9729811 19.9892981,27.5792711 L19.9892981,27.5792711 L15.5947588,23.1121428 C15.0011718,22.514048 14.0387772,22.514048 13.4451902,23.1121428 C12.8516033,23.7102376 12.8516033,24.6799409 13.4451902,25.2780357 L13.4451902,25.2780357 L19.6260786,31.5514289 C20.2196656,32.1495237 21.1820602,32.1495237 21.7756472,31.5514289 L21.7756472,31.5514289 L34.5548098,18.614464 C35.1483967,18.0163692 35.1483967,17.0466659 34.5548098,16.4485711 Z"></path></svg>
              <svg v-else viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" class="icon-error"><path d="M24,4 C35.045695,4 44,12.954305 44,24 C44,35.045695 35.045695,44 24,44 C12.954305,44 4,35.045695 4,24 C4,12.954305 12.954305,4 24,4 Z M32.57818,15.42182 C32.0157534,14.8593933 31.1038797,14.8593933 30.541453,15.42182 L30.541453,15.42182 L24.0006789,21.9625941 L17.458547,15.42182 C16.8961203,14.8593933 15.9842466,14.8593933 15.42182,15.42182 C14.8593933,15.9842466 14.8593933,16.8961203 15.42182,17.458547 L15.42182,17.458547 L21.9639519,23.9993211 L15.42182,30.541453 C14.8593933,31.1038797 14.8593933,32.0157534 15.42182,32.57818 C15.9842466,33.1406067 16.8961203,33.1406067 17.458547,32.57818 L17.458547,32.57818 L24.0006789,26.0360481 L30.541453,32.57818 C31.1038797,33.1406067 32.0157534,33.1406067 32.57818,32.57818 C33.1406067,32.0157534 33.1406067,31.1038797 32.57818,30.541453 L32.57818,30.541453 L26.0374059,23.9993211 L32.57818,17.458547 C33.1406067,16.8961203 33.1406067,15.9842466 32.57818,15.42182 Z"></path></svg>
              {{item.state == 'success' ? '执行成功' : item.state == 'receiptSuccess' ? '上链成功' : '执行失败'}}
            </div>
            <div v-if="item">
              <p v-if="isBooleanType(item.content)">{{item.content}}</p>
              <json-viewer
                v-else
                :value="item && item.content || ''"
                :expand-depth="1"
              ></json-viewer>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <el-empty description="请选择左侧函数并执行"></el-empty>
      </div>
    </div>
    <div class="conversion-dialog" v-if="isShowConversion">
      <div class="conversion-content" @click.stop>
        <div class="dialog-hd">
          <div class="dialog-title">数字转换</div>
          <div class="dialog-close" @click="isShowConversion = false"><i class="el-icon-close"></i></div>
        </div>
        <div class="dialog-bd">
          <el-select v-model="decimals" placeholder="请选择" style="width: 100%" @change="selectChange">
            <el-option
              v-for="item in conversionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input v-show="isShowDecimalsInput" v-model="decimalsInput" type="number" placeholder="请输入内容" style="margin-top:14px"></el-input>
          <p  v-show="isShowDecimalsInput" class="hint">请输入添加多少0</p>
        </div>
        <div class="dialog-ft">
          <div class="btn" @click="toWei">转换</div>
        </div>
      </div>
    </div>
    <div class="dialog" v-if="isShowDialog">
      <div class="dialog-content">
        <div class="dialog-hd">
          <div class="dialog-title">当前链错误</div>
          <div class="dialog-close" @click="isShowDialog=false">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="AccountDetails__CloseColor-sc-75okty-10 loWQUb"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </div>
        </div>
        <div class="dialog-bd">
          <p class="dialog-bd-content">当前钱包连接的链和本合约所在链不同，请切换链</p>
           <el-button type="primary" class="dialog-bd-btn" @click="changeChain">切换到{{this.chain.chainName}}链</el-button>
          <div class="br"><span>或</span></div>
           <el-button type="info" class="dialog-bd-btn" @click="updateSol">将当前合约链更改为{{this.network.name}}并运行函数</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {contract} from '../lib/connectWallet'
import { ethers } from 'ethers'
import { formatDate } from '../utils/utils'
import { BigNumber } from "bignumber.js"

export default {
  name: "SolBody",
  props: ["address", "abi", "result", "chain", "sol"],
  data() {
    return {
      activeNames: [],
      contract: null,
      jsons: [],
      otherName: '',
      fun: {},
      formData: {},
      conversionType: '',
      decimals: 18,
      decimalsInput: '',
      isShowDecimalsInput: false,
      isShowConversion: false,
      loading: false,
      isShowDialog: false,
      showFunSet: false,
      showSendSet: false,
      conversionOptions: [{
        label: 'toGwei(10^18)',
        value: 18
      }, {
        label: 'toGwei(10^9)',
        value: 9
      }, {
        label: '自定义',
        value: ''
      }]
    }
  },
  computed: {
    web3() {
      let web3 = this.$store.state.web3
      return web3
    },
    abiList() {
      let abi = this.abi || [];
      let list = abi.filter((e) => e.type == 'function')
      let readAbi = list.filter(e => e.stateMutability == 'view')
      let writeAbi = list.filter(e => e.stateMutability != 'view')
      return {readAbi, writeAbi}
    },
    walletAddress() {
      let address = this.$store.state.address
      return address
    },
    network() {
      let network = this.$store.state.network
      return network
    },
    chains() {
      let chains = this.$store.state.chains
      return chains
    }
  },
  watch: {
    address() {
      if (this.web3) {
        this.contract = contract(this.address, this.abi, this.web3.getSigner())
      }
    },
    abi() {
      if (this.web3) {
        this.contract = contract(this.address, this.abi, this.web3.getSigner())
      }
    },
    web3(val) {
      this.contract = contract(this.address, this.abi, val.getSigner())
    }
  },
  async mounted() {
    if (this.web3) {
      this.contract = contract(this.address, this.abi, this.web3.getSigner())
    }
  },
  filters: {
    slimAddress(val = '') {
      return `${val.slice(0, 6)}......${val.slice(-6)}`
    },
  },
  methods: {
    isBooleanType(val) {
      return typeof val === "boolean"
    },
    changeChain() {
      this.isShowDialog =false
      this.$emit('changeChain')
    },
    updateSol() {
      let sol = this.sol
      console.log(this.chains)
      let chainData = this.chains.filter(e => e.chainId == this.network.chainId)[0]
      let chain = {
        chainId: chainData.chainId,
        chainName: chainData.name,
        coinName: chainData.chain,
        rpc: chainData.rpc
      }
      console.log(chain)
      sol.chain = chain
      this.$emit('updateSol', sol)
      this.isShowDialog = false
      setTimeout(() => this.apply(), 500)
    },
    toEtherscan(hash) {
      let network = this.network
      let name = ''
      if (network.name.toLowerCase() == 'ropsten') {
        name = 'ropsten.'
      } else if (network.name.toLowerCase() == 'kovan') {
        name = 'kovan.'
      } else if (network.name.toLowerCase() == 'rinkeby') {
        name = 'rinkeby.'
      } else if (network.name.toLowerCase() == 'goerli') {
        name = 'goerli.'
      } else if (network.name.toLowerCase() == 'sepolia') {
        name = 'sepolia.'
      }
      let url = `https://${name}etherscan.io/tx/${hash}`
      window.open(url)
    },
    copy(value, type) {
      if (type == 'address') {
       value = value.replace(/\"/g, "")
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
    toWei() {
      if (!this.decimals && !this.decimalsInput) {
        this.$message({
          message: '请先输入位数',
          type: 'warning'
        })
        return
      }
      let type = this.conversionType
      let formData = this.formData
      let decimals = this.decimals || this.decimalsInput
      let input = ethers.utils.parseUnits(formData[type].toString(), decimals).toString()
      this.formData[type] = input
      this.decimals = 18
      this.decimalsInput = ''
      this.conversionType = ''
      this.isShowDecimalsInput = false,
      this.isShowConversion = false
    },
    conversion(type) {
      console.log(type)
      if (!this.formData[type]) {
        this.$message({
          message: '请先输入内容',
          type: 'warning'
        })
        return
      }
      this.conversionType = type
      this.isShowConversion = true
    },
    selectChange(e) {
      if (!e) {
        this.isShowDecimalsInput = true
      } else {
        this.isShowDecimalsInput = false
        this.decimalsInput = ''
      }
    },
    isUint(type) {
      return type.indexOf("uint") > -1
    },
    isTextarea(type) {
      return type.indexOf("[]") > -1
    },
    async apply() {
      console.log(this.network, this.chain)
      if (this.network.chainId != this.chain.chainId) {
        console.log(this.network.chainId, this.chain, this.chain.chainId)
        this.isShowDialog = true
        return
      }
      this.loading = true
      let sendInfo = { from: this.walletAddress }
      if (this.formData['payableValue']) {
        sendInfo["value"] = this.formData['payableValue']
        delete this.formData['payableValue']
      }
      if (this.formData['gasPrice']) {
        sendInfo["gasPrice"] = ethers.utils.parseUnits(this.formData['gasPrice'], 'gwei')
        delete this.formData['gasPrice']
      }
      console.log(sendInfo)
      let formData = JSON.parse(JSON.stringify(this.formData))
      let inputs = this.fun.inputs
      inputs.forEach(e => {
        if (e.type.indexOf("[]") > -1) {
          let value = formData[e.name] ? formData[e.name].replace(/\"/g, "").replace(/\'/g, "").replace(/\s+/g, ",").replace(/\[|]/g,'').replace(/(\r\n)|(\n)/g, ',') : ''
          value = value.split(',')
          value = value.filter(e => e && e.trim())
          value = value.map(e => ethers.utils.hexlify(e))
          formData[e.name] = value
        }
      })
      let params = Object.values(formData)
      let result
      let resultState
      let formDataList = []
      for (let key in formData) {
        let item = {key, value: formData[key]}
        formDataList.push(item)
      }
      try {
        result = await this.contract[this.fun.name](...params, sendInfo)
        console.log(result)
        if (BigNumber.isBigNumber(result)) {
          console.log(1)
          result = ethers.utils.formatEther( result )
        }
        resultState = 'success'
        this.$notify.success({
          title: '成功',
          message: "执行成功"
        })
        if (result && result.hash) {
          this.getTransactionReceipt(formDataList, this.fun.name, result.hash)
        }
      } catch (error) {
        console.log(error)
        result = error
        resultState = 'error'
        this.$notify.error({
          title: '错误',
          message: "执行失败"
        })
      }
      let resultData = {
        content: result,
        state: resultState,
        formDataList,
        name: this.fun.name,
        createAt: new Date()
      }
      this.loading = false
      this.fun = {}
      this.formData = {}
      this.$emit('resulted', resultData)
    },
    getTransactionReceipt(formDataList, name, hash) {
      try {
        let provider = ethers.getDefaultProvider(this.network.name.toLowerCase())
        if (provider.getTransactionReceipt) provider.getTransactionReceipt(hash).then((transactionReceipt) => {
          console.log(transactionReceipt)
          if (transactionReceipt) {
            let resultData = {
              content: transactionReceipt,
              state: 'receiptSuccess',
              formDataList,
              name: name,
              createAt: new Date()
            }
            this.$emit('resulted', resultData)
          } else {
            setTimeout(() => this.getTransactionReceipt(formDataList, name, hash), 1000) 
          }
        })
      } catch (error) {
        console.log(error)
      }
      
    },
    saveOtherName() {
      let abi = this.abi
      let sol = this.sol
      let fun = this.fun
      for (let i = 0; i < abi.length; i++) {
        if (abi[i].name == fun.name) {
          abi[i].otherName = this.otherName
        }
      }
      sol.abi = abi
      console.log(sol)
      this.$emit('updateSol', sol)
    },
    selectMenu(e) {
      this.fun = e
      this.showSendSet = false
      if (this.fun.stateMutability == 'payable') this.showSendSet = true
      this.otherName = e.otherName || ''
      this.formData = {}
    },
    delFun() {
      this.fun = {}
    },
    formatDate(time) {
      return formatDate('mm-dd HH:MM', time)
    },
    isJson(str) {
      console.log(str);
      try {
        if (typeof str == "object") {
          return true;
        }
      } catch (e) {}
      return false;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.sol-body {
  display: flex;
  align-items: top;
  color: #2F343D;
  .fun-name {
    color: #909399;
    margin-top: 6px;
    font-size: 12px;
  }
  .right {
    flex: 1;
    margin-left: 15px;
    box-sizing: border-box;
    .right-section-wrap {
      border: solid 1px #e6e6e6;
      border-radius: 5px;
      padding: 12px;
      .fun-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        i {
          font-size: 24px;
          cursor: pointer;
        }
      }
    }
    .right-section {
      position: relative;
      border: 1px dashed #e6e6e6;
      border-radius: 5px;
      width: 100%;
      padding: 20px 12px;
      box-sizing: border-box;
      margin-top: 20px;
      .section-title {
        position: absolute;
        top: -.5em;
        left: 6px;
        font-size: 14px;
        line-height: 1;
        padding: 0 6px;
        background-color: #fff;
        color: #606266;
        transition: all .3s;
        span {
          margin-left: 10px;
          font-size: 12px;
        }
      }
      .section-wrap {
        display: flex;
        align-items: center;
        justify-content: space-between;
        overflow: hidden;
        transition: all .3s;
      }
      .section-form {
        & ~ .section-form {
          margin-top: 20px;
        }
        .form-label {
          width: 50%;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          & > div {
            display: flex;
            align-items: center;
            span {
              color: #909399;
              margin-left: 8px;
              font-size: 12px;
            }
          }
          .sort {
            font-size: 12px;
            color: #909399;
            cursor: pointer;
            i {
              font-size: 14px;
              transform: rotate(90deg);
              margin-left: 2px;
            }
            
          }
        }
        .form-input {
          margin-top: 16px;
          display: flex;
          .section-btn {
            margin-left: 10px;
            border-radius: 5px;
          }
        }
      }
      .show-arrow {
        position: absolute;
        top: 0;
        height: 42px;
        display: flex;
        align-items: center;
        font-size: 20px;
        right: 12px;
        cursor: pointer;
      }
    }
    .section-send-info {
      // height:0;
      // opacity:0;
      overflow: hidden;
      transition: all .3s;
    }
    .result {
      padding: 16px 24px;
      & ~ .result {
        margin-top: 10px;
      }
      .result-hd {
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .result-title {
          span {
            font-size: 12px;
            color: #606266;
            margin-left: 10px;
          }
        }
        .result-hash {
          display: flex;
          align-items: center;
          svg {
            margin-left: 12px;
            cursor: pointer;
            stroke: #606266;
            & ~ svg {
              margin-left: 6px;
            }
          }
        }
      }
      .result-tb {
        margin-top: 20px;
        border-radius: 5px;
        // border: 1px solid #e6e6e6;
        box-sizing: border-box;
        .resilt-tr {
          display: flex;
          align-items: center;
          .resilt-td {
            min-height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            flex: 1;
            border: 1px solid #e6e6e6;
            margin-left: -1px;
            &.resilt-td-key {
              flex: 0 0 200px;
              margin-left: 0;
              // border-bottom: 1px solid #e6e6e6;
            }
          }
          & ~ .resilt-tr {
            margin-top: -1px;
          }
        }
      }
      .result-content {
        margin-top: 10px;
        border-radius: 5px;
        // border: 1px solid #e6e6e6;
        box-sizing: border-box;
        padding: 12px 0;
        .result-text {
          display: flex;
          align-items: center;
          font-size: 14px;
          svg {
            fill: #67c23a;
            width: 16px;
            height: 16px;
            margin-right: 6px;
            &.icon-error {
              fill: #f56c6c;
            }
          }
        }
        p {
          margin-top: 16px;
          font-size: 16px;
          margin-left: 2px;
        }
      }
    }
  }
}
style {
  .el-card__body {
    box-sizing: border-box;
  }
}
.conversion-dialog {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 9;
  display: flex;
  align-items: center;
  justify-content: center;
  .conversion-content {
    padding: 18px;
    border-radius: 5px;
    background: #FFFFFF;
    width: 300px;
    box-shadow: rgba(0, 0 ,0, .08) 0px 0px 12px;
    .dialog-hd {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      i {
        font-size: 18px;
        cursor: pointer;
      }
    }
    .dialog-bd {
      margin-top: 20px;
      .hint {
        font-size: 12px;
        color: #909399;
        margin-top: 6px;
      }
    }
    .btn {
      width: 100%;
      margin-top: 20px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      background: #3997EE;
      border-radius: 5px;
      color: #FFFFFF;
      cursor: pointer;
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
      box-sizing: border-box;
      margin-top: 16px;
      border-radius: 10px;
      .dialog-bd-content {
        color: black;
        font-weight: 400;
        font-size: 14px;
        box-sizing: border-box;
        margin-bottom: 6px;
      }
      .dialog-bd-btn {
        width: 100%;
        height: 36px;
        padding: 0;
        line-height: 36px;
        margin-top: 14px;
        border-radius: 5px;
      }
      .br {
        font-size: 14px;
        text-align: center;
        margin-top: 14px;
        line-height: 1;
        position: relative;
        span {
          position: relative;
          z-index: 2;
          padding: 0 10px;
          background: #FFFFFF;
        }
        &::after {
          content: '';
          height: 1px;
          width: 100%;
          background: #e6e6e6;
          position: absolute;
          top: 49.9%;
          left: 0;
        }
      }
    }
  }
}
.fun-other-name {
  white-space: nowrap;
}
</style>
<style lang="scss">
.sol-body {
  .el-menu-vertical {
    min-height: 400px;
    border-radius: 5px;
    border: solid 1px #e6e6e6;
  }
  .el-menu {
    width: 200px;
    // border: none;
    border-radius: 5px;
    .el-submenu {
      .el-menu-item {
        font-size: 14px;
        width: 200px;
        min-width: 200px;
        box-sizing: border-box;
        padding: 10px 0 !important;
        padding-left: 24px !important;
        height: auto;
        line-height: 1;
      }
    }
    .el-submenu__title {
      font-size: 14px;
      height: 36px;
      line-height: 36px;
    }
  }
  .el-input__inner {
    border-radius: 5px;
    height: 36px;
    line-height: 36px;
    outline: none;
  }
  .el-input__inner:focus {
    border: 1px solid #DCDFE6;
  }
  .jv-container {
    .jv-code {
      padding: 0;
      margin-top: 18px;
    }
  }
}
</style>
