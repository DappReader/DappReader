<template>
  <div v-if="show_dialog">
    <el-dialog title="创建合约模型" :visible.sync="show_dialog" @close="close" :close-on-click-modal="false">
      <el-form :model="form" ref="form">
        <el-form-item label="项目名称" prop="name" label-width="120px" 
        :rules="[
          { required: true, message: '请输入项目名称', trigger: 'blur' },
        ]">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="项目地址" prop="address" label-width="120px"
        :rules="[
          { required: true, message: '请输入项目地址', trigger: 'blur' },
        ]">
          <el-input v-model="form.address" autocomplete="off"></el-input>
        </el-form-item>
        <!-- <label>
          <el-form-item label="上传ABI文件" label-width="120px">
            <input type="file" name="" id="" @change="fileReader">
          </el-form-item>
        </label> -->
        <el-form-item label="合约所在链" prop="chain" label-width="120px" 
        :rules="[
          { required: true, message: '请选择网络', trigger: 'blur' },
        ]">
          <el-select v-model="form.chain" placeholder="请选择" @change="selectChange">
            <el-option
              v-for="(item, index) in chainList"
              :key="item.chainId"
              :label="item.chainName"
              :value="item.chainId"
              style="display: flex;align-items: center;justify-content: space-between;">
              {{item.chainName}} 
              <svg v-if="item.isDIY" @click.stop="delChain(index)" style="width: 20px;height:20px;" t="1656504850787" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2170" width="128" height="128"><path d="M656 288h144a16 16 0 0 1 16 16v16a16 16 0 0 1-16 16h-48v496a16 16 0 0 1-16 16H288a16 16 0 0 1-16-16V336h-48a16 16 0 0 1-16-16v-16a16 16 0 0 1 16-16h144v-80a16 16 0 0 1 16-16h256a16 16 0 0 1 16 16v80z m-48 0v-48H416v48h192z m32 48H320v464h384V336h-64z m-208 112h16a16 16 0 0 1 16 16v192a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16V464a16 16 0 0 1 16-16z m144 0h16a16 16 0 0 1 16 16v192a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16V464a16 16 0 0 1 16-16z" p-id="2171" fill="#707070"></path></svg>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="导入ABI" prop="abi" label-width="120px"
        :error="abiError"
        :rules="[
          { required: true, message: '请输入ABI', trigger: 'blur' },
        ]">
          <div v-show="!showAbiInput" class="import-abi">
            <div class="upload-abi import-abi-item">
              <label>
                <input type="file" name="input" id="" @change="fileReader" style="display:none">
                <i class="el-icon-upload2"></i>
                <div class="">上传ABI文件</div>
              </label>
            </div>
            <div class="upload-abi import-abi-item" @click="showAbiInput = true">
              <label>
                <i class="el-icon-copy-document"></i>
                <div class="">粘贴ABI文件</div>
              </label>
            </div>
            <div class="upload-abi import-abi-item" v-loading="loading" @click="importAbiFromEtherscan">
              <label>
                <i class="el-icon-download"></i>
                <div class="">etherscan导入</div>
              </label>
            </div>
          </div>
          <el-input
            v-show="showAbiInput"
            type="textarea"
            v-model="form.abi"
            autocomplete="off"
            rows="5"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" label-width="120px">
          <el-input
            placeholder=""
            type="textarea"
            v-model="form.remark"
            autocomplete="off"
            rows="3"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit_model">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加自定义链" :visible.sync="show_chain_dialog" @close="closeChainDialog" :close-on-click-modal="false">
      <el-form :model="chain">
        <el-form-item label="链名称" label-width="120px">
          <el-select
            style="width: 100%"
            v-model="chain.chainName"
            filterable
            allow-create
            default-first-option
            @change="chainChange"
            placeholder="例：Ethereum">
            <el-option
              v-for="item in chains"
              :key="item.name"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="ChainId" label-width="120px">
          <el-input v-model="chain.chainId" autocomplete="off" placeholder="例：1"></el-input>
        </el-form-item>
        <el-form-item label="主币名称" label-width="120px">
          <el-input v-model="chain.coinName" autocomplete="off" placeholder="例：ETH"></el-input>
        </el-form-item>
        <el-form-item label="rpc" label-width="120px">
          <el-select
            style="width: 100%"
            v-model="chain.rpc"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="">
            <el-option
              v-for="item in chain.rpc"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
          <!-- <el-input v-model="chain.rpc" autocomplete="off" placeholder="rpc地址,方便使用私有链"></el-input> -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeChainDialog">取 消</el-button>
        <el-button type="primary" @click="submit_chain">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="输入API密钥" :visible.sync="showApiKey" @close="closeApiKey" :close-on-click-modal="false">
      <el-form :model="chain">
        <el-form-item label="API密钥" label-width="120px">
          <el-input v-model="apiKey" autocomplete="off"></el-input>
          <p class="hint">使用etherscan导入功能需要提供etherscan的api kay(本地存储), 如果你没有申请api kay, 可以 <a href="https://etherscan.io/register" target="_blank">点击"链接"申请</a></p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeApiKey">取 消</el-button>
        <el-button type="primary" @click="importAbiFromEtherscan">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getLs, setLs } from '../service/service'
import { fetcher } from '../utils/utils'
export default {
  props: ['sol'],
  data() {
    return {
      chainList: [],
      chains: [],
      show_dialog: false,
      show_chain_dialog: false,
      showAbiInput: false,
      showApiKey: false,
      chain: {
        chainId: '',
        chainName: '',
        coinName: '',
        rpc: []
      },
      form: {
        name: "",
        address: "",
        abi: "",
        chain:"",
        remark: ""
      },
      abiError: '',
      apiKey: '',
      loading: false
    };
  },
  async mounted() {
    this.chains = await getLs('chains')
    console.log(this.chains)
    let chainList = await getLs('chainList');
    console.log(chainList)
    if (!chainList || !chainList.length) {
      chainList = [{
        chainId: '1',
        chainName: 'Main',
        coinName: 'ETH'
      }, {
        chainId: '3',
        chainName: 'Ropsten',
        coinName: 'ROP'
      }, {
        chainId: '4',
        chainName: 'Rinkeby',
        coinName: 'RIN'
      }, {
        chainId: '42',
        chainName: 'Kovan',
        coinName: 'KOV'
      }, {
        chainId: '5',
        chainName: 'Goerli',
        coinName: 'ETH'
      }, {
        chainId: '56',
        chainName: 'BSC主网',
        coinName: 'BNB'
      }, {
        chainId: '97',
        chainName: 'BSC测试网',
        coinName: 'tBNB'
      }, {
        chainId: '128',
        chainName: 'HECO主网',
        coinName: 'HT'
      }, {
        chainId: '70',
        chainName: 'HSC虎符主网',
        coinName: 'HOO'
      }, {
        chainId: '250',
        chainName: 'FTM',
        coinName: 'FTM'
      }, {
        chainId: '137',
        chainName: 'Matic',
        coinName: 'Matic'
      }]
      setLs('chainList', chainList).then(res => {
        chainList.push({chainId: -1, chainName: '自定义', coinName: 'ETH' })
      })
    } else {
      chainList.push({chainId: -1, chainName: '自定义', coinName: 'ETH' })
    }
    this.chainList = chainList
  },
  methods: {
    async importAbiFromEtherscan() {
      
      if (!this.form.address) {
        this.$message({
          message: '请先添加合约地址',
          type: 'error'
        })
      } else if (!this.apiKey) {
        this.showApiKey = true
        this.loading = true
      } else {
        let apiKey = this.apiKey
        this.closeApiKey()
        try {
          let abiData = await fetcher(`https://api.etherscan.io/api?module=contract&action=getabi&address=${this.form.address}&apikey=${apiKey}`)
          console.log(abiData)
          let result = abiData.result
          if (abiData.status == 0) {
            if (result == 'Contract source code not verified') {
              this.$message.error('当前合约未开源,无法通过etherscan获取')
            } else {
              this.$message.error(result)
            }
          } else if (abiData.status == 1) {
            this.form.abi = result
            this.showAbiInput = true
          }
          this.loading = false
        } catch (error) {
          console.log(error)
          this.$message.error(error)
          this.loading = false
        }
      }
    },
    closeChainDialog() {
      this.show_chain_dialog = false
      this.form.chain=''
    },
    closeApiKey() {
      this.showApiKey = false
      this.apiKey = ''
    },
    fileReader(e) {
      console.log(e)
      let file = e.target.files[0]
      let reader = new FileReader()
      reader.readAsText(file, "UTF-8")
      reader.onload = (evt) => {
        let fileString = evt.target.result
        this.form.abi = fileString
        this.showAbiInput = true
      }
    },
    async delChain(index) {
      this.$confirm("此操作将永久删除该链条信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        let chainList = await getLs('chainList')
        let chainData = chainList[index]
        if (this.form.chain == chainData.chainId) {this.form.chain = ''}
        chainList.splice(index, 1)
        setLs('chainList', chainList).then(res => {
          res.push({chainId: -1, chainName: '自定义', coinName: 'ETH' })
          this.chainList = chainList
        })
      })
    },
    chainChange(e) {
      console.log(e)
      let chain = this.chains.filter(el => el.name == e)
      console.log(chain)
      if (chain && chain.length) {
        let chainData = chain[0]
        console.log(chainData)
        this.chain = {
          chainId: chainData.chainId,
          chainName: chainData.name,
          coinName: chainData.chain,
          rpc: chainData.rpc
        }
      }
    },
    submit_chain() {
      let chainData = this.chain
      this.new_chain(chainData)
      this.chain = {
        chainId: '',
        chainName: '',
        coinName: ''
      };
      this.show_chain_dialog = false;
    },
    selectChange(e) {
      if (e == -1) {
        this.show_chain_dialog = true
      }
    },
    open() {
      let self = this;
      self.show_dialog = true;
    },
    close() {
      this.show_dialog = false;
      this.showAbiInput = false
    },
    submit_model() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.abiError = ''
          let formData = this.form;
          try {
            console.log(JSON.parse(formData.abi))
            JSON.parse(formData.abi)
          } catch (error) {
            console.log(1)
            this.$nextTick(() => {
              this.abiError = 'json 格式校验错误'
            })
            return
          }
          let chainId = formData.chain
          formData.chain = this.chainList.filter(e => e.chainId == chainId)[0]
          this.$emit('refresh', formData)
          this.form = {
            name: '',
            address: '',
            abi: '',
            chain: '',
            remark: ''
          };
          this.close()
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    async new_chain({chainId, chainName, coinName, rpc}) {
      let chainList = await getLs('chainList');
      if (chainList.some(e => e.chainId == chainId)) {
        this.$message({
          message: '该链条已存在',
          type: 'error'
        })
        return
      }
      chainList.push({chainId, chainName, coinName, rpc, isDIY: true})
      setLs('chainList', chainList).then(res => {
        chainList.push({chainId: -1, chainName: '自定义', coinName: 'ETH' })
        this.chainList = chainList
        this.form.chain = chainId
      })
    }
  },
};
</script>
<style lang="scss" scoped>
.import-abi {
  display: flex;
  align-items: center;
  .import-abi-item {
    flex: 1;
    box-sizing: border-box;
    // width: 150px;
    cursor: pointer;
    height: 100px;
    border: 1px solid #DCDFE6;
    border-radius: 5px;
    & ~ .import-abi-item {
      margin-left: 16px;
    }
    label {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      font-size: 14px;
      line-height: 1;
      i {
        font-size: 34px;
        margin-bottom: 12px;
      }
    }
  }
}
.hint {
  font-size: 12px;
  color: #909399;
  margin-top: 6px;
  line-height: 1.4;
  a {
    color: #409EFF;
  }
}
</style>