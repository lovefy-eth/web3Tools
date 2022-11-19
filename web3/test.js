var Web3 = require('web3');
// 使用指定的服务提供器（例如在Mist中）或实例化一个新的websocket提供器
var web3 = new Web3(Web3.givenProvider || 'https://bsc.mytokenpocket.vip');
// 或者
//var web3 = new Web3(Web3.givenProvider || new Web3.providers.WebsocketProvider('ws://remotenode.com:8546'));
// web3.eth.getStorageAt("0x7ff11e5b256c9EB67F4dEa2FacECEd5De1CD691F", 0)
//   .then(console.log);
// var acc = web3.eth.accounts.privateKeyToAccount('0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709');
// console.log(acc)

//console.log(web3.eth.accounts.sign('Some data', '0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709'))
//console.log(web3.eth.accounts.recover('Some data', '0x4da690af636a86d9ddce9ddca65c50cdb5db2f832b829fada02fc2082b609b5555cac5619ef8c4f70971e37b17f2d7e65da3acaecacab0baac7d90d34285634c1c'))

console.log(web3.eth.abi.encodeFunctionSignature("myFunction(uint256,uint32[],bytes10,bytes)"))
