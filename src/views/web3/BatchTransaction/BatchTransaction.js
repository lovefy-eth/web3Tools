import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CFormTextarea,
  CContainer,
} from '@coreui/react'
var Web3 = require('web3')
// 使用指定的服务提供器（例如在Mist中）或实例化一个新的websocket提供器
var web3 = new Web3(Web3.givenProvider || 'https://bsc.mytokenpocket.vip')

const AddWallet = () => {
  var [PrivateKeysValue, setPrivateKeysValue] = useState('')
  var [lineNum, setLineNum] = useState(0)

  function getAllvalidPrivateKey(text) {
    var result = []
    for (const _str of text.split('\n')) {
      var _line = _str.replaceAll('\r', '')
      if (_line.length > 0) {
        result.push(_line)
      }
    }
    return result
  }
  function ImportPrivateKey() {
    web3.eth.accounts.wallet.clear()
    let keys = getAllvalidPrivateKey(PrivateKeysValue)
    for (const key of keys) {
      web3.eth.accounts.wallet.add(key)
    }
    console.log(web3.eth.accounts.wallet)
  }
  function ShowExampe() {
    setPrivateKeysValue(
      '0x79b41737938ed123d62014aff83050bd6fc2febadda3a650bc86f45d06129467\n' +
        '0x1e2be7ea979691115001c3d6a47f3cdf479174e0127d49c47ee895c69df8c615',
    )
  }
  useEffect(() => {
    setLineNum(getAllvalidPrivateKey(PrivateKeysValue).length)
  }, [PrivateKeysValue])
  return (
    <CCard className="mb-4">
      <CCardHeader>
        <strong>批量交易</strong>
      </CCardHeader>
      <CCardBody>
        <CContainer>
          <CFormTextarea
            id="importPrivateKeys"
            label="批量导入私钥"
            rows="12"
            text="每一行输入一个私钥"
            value={PrivateKeysValue}
            onChange={(e) => setPrivateKeysValue(e.target.value)}
          ></CFormTextarea>
          <CRow>
            <CCol xs="auto" className="me-auto">
              <CButton color="secondary" onClick={ShowExampe}>
                查看例子
              </CButton>
            </CCol>
            <CCol xs="auto">
              <CButton color="primary" disabled={lineNum === 0} onClick={ImportPrivateKey}>
                {'导入私钥(' + lineNum + ')'}
              </CButton>
            </CCol>
          </CRow>
        </CContainer>
      </CCardBody>
    </CCard>
  )
}

const BatchTransaction = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <AddWallet></AddWallet>
      </CCol>
    </CRow>
  )
}
export default BatchTransaction
