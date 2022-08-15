import Vuex from 'vuex'
import Vue from 'vue'
import { connectWallet } from '../lib/connectWallet'
import { ethers } from 'ethers'
import {chains} from '../assets/js/chains'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
      web3: null,
      address: "",
      chains: chains,
      balance: '',
      network: null,
      activeId: '',
      menuList: [],
      contractList: [],
      openSols: [],
    },
    mutations: {
      setOpenSols(state, openSols) {
        state.openSols = openSols
      },
      setMenuList(state, menuList) {
        state.menuList = menuList
      },
      setContractList(state, contractList) {
        state.contractList = contractList
      },
      setActiveId(state, id) {
        state.activeId = id
      },
      setChains(state, chains) {
        state.chains = chains
      },
      async getWeb3(state) {
        console.log(1)
        let web3 = await connectWallet()
        let accounts = await web3.listAccounts()
        let wallet_address = ''
        let balanceInEth = 0

        if (accounts.length) {
          wallet_address = accounts[0]
          try {
            let balance = await web3.getBalance(wallet_address)
            balanceInEth = ethers.utils.formatEther(balance);
          } catch (error) {}
        }
        let network = await web3.getNetwork()
        state.web3 = web3
        state.balance = balanceInEth
        state.address = wallet_address
        let networkData = state.chains.filter(e => network.chainId == e.chainId)[0]
        network.name = networkData.name
        state.network = network
        console.log(state)
      },
      setAddress(state, address) {
        state.address = address
      },
      setChains(state, chains) {
        state.chains = chains
      },
      setBalance(state, balance) {
        state.balance = balance
      }
    }
  })

export default store