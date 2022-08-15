import { ethers } from 'ethers'
export const connectWallet = () => {
  return new Promise(async (resolve, reject) => {
    let web3Provider;
    if (window.ethereum) {
      web3Provider = window.ethereum;
      try {
        await window.ethereum.enable();
      } catch (error) {
        console.log('连接失败', error)
        reject(error);
      }
    } else if (window.web3) {
      web3Provider = window.web3.currentProvider;
    } else {
      // 处理用户没有metamask的逻辑
    }
    let web3 = new ethers.providers.Web3Provider(web3Provider);
    // console.log(await web3.getBalance('0x64E193C40288F4ec1A24C5c92314d9518a6E8e49'))
    resolve(web3);
  })
}

export const contract = (contractAddress, abi, provider) => {
  return new ethers.Contract(contractAddress, abi, provider)
}

