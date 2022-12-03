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
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CTable,
  CFormCheck,
  CLink,
  CSpinner,
} from '@coreui/react'
import { cilDelete } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { AppSignTransaction } from 'src/components'

const BatchTransaction = () => {
  var [PrivateKeysValue, setPrivateKeysValue] = useState('')
  var [lineNum, setLineNum] = useState(0)
  var [wallets, setWallets] = useState([])
  var [btnLoading, setBtnLoading] = useState(false)
  var Web3 = require('web3')
  // 使用指定的服务提供器（例如在Mist中）或实例化一个新的websocket提供器
  var web3 = new Web3(Web3.givenProvider || 'https://bsc.mytokenpocket.vip')

  function getAllvalidPrivateKey(text) {
    var result = []
    for (const _str of text.split('\n')) {
      var _line = _str.replaceAll('\r', '').trim()
      if (_line.length > 0) {
        result.push(_line)
      }
    }
    return result
  }

  async function ImportPrivateKey() {
    setBtnLoading(true)
    web3.eth.accounts.wallet.clear()
    let keys = getAllvalidPrivateKey(PrivateKeysValue)
    for (const key of keys) {
      try {
        web3.eth.accounts.wallet.add(key)
      } catch (e) {
        console.log(e.message)
      }
    }
    var _wallets = []
    var batch = new web3.BatchRequest()
    let getBalancecounter = 0
    let getTransactionCount = 0
    let total = web3.eth.accounts.wallet.length
    await new Promise(function (resolve, reject) {
      for (let i = 0; i < web3.eth.accounts.wallet.length; i++) {
        _wallets.push({
          address: web3.eth.accounts.wallet[i].address,
          checked: true,
          balance: 0,
          txsCount: 0,
          lastMsg: '',
        })
        batch.add(
          web3.eth.getBalance.request(web3.eth.accounts.wallet[i].address, (error, data) => {
            if (error) return reject(error)
            console.log(data)
            _wallets[i].balance = data
            getBalancecounter++
            if (getBalancecounter === total) resolve()
          }),
        )
        batch.add(
          web3.eth.getTransactionCount.request(
            web3.eth.accounts.wallet[i].address,
            (error, data) => {
              if (error) return reject(error)
              console.log(data)
              _wallets[i].txsCount = data
              getTransactionCount++
              if (getTransactionCount === total) resolve()
            },
          ),
        )
      }
      batch.execute()
    })
    setWallets(_wallets)
    console.log(_wallets)
    setBtnLoading(false)
  }

  function ShowExampe() {
    setPrivateKeysValue(
      '79b41737938ed123d62014aff83050bd6fc2febadda3a650bc86f45d06129467\n' +
        '0x1e2be7ea979691115001c3d6a47f3cdf479174e0127d49c47ee895c69df8c615',
    )
  }

  useEffect(() => {
    setLineNum(getAllvalidPrivateKey(PrivateKeysValue).length)
  }, [PrivateKeysValue])

  function delAddress(index) {
    let _wallets = [...wallets]
    _wallets.splice(index, 1)
    setWallets(_wallets)
    console.log(_wallets)
  }

  function checkedAddress(index) {
    let _wallets = [...wallets]
    _wallets[index].checked = !_wallets[index].checked
    setWallets(_wallets)
  }

  function checkedAllAddress(e) {
    let _b = e.target.checked
    let _wallets = [...wallets]
    for (let i = 0; i < _wallets.length; i++) {
      _wallets[i].checked = _b
    }
    setWallets(_wallets)
  }

  function IsAllCheckedAddress() {
    let _count = 0
    for (let i = 0; i < wallets.length; i++) {
      if (wallets[i].checked) _count++
    }
    if (_count === 0) return -1
    if (_count > 0 && wallets.length !== _count) return 0
    return 1
  }
  function AppSignTransactionCallback(data, CheckedSendAllBalance) {
    console.log(data, CheckedSendAllBalance)
  }

  function ShowWallets() {
    if (wallets.length <= 0) {
      return
    }
    let _rows = wallets.map((wallet, index) => (
      <CTableRow key={index}>
        <CTableHeaderCell scope="row">
          <CFormCheck
            label={index + 1}
            checked={wallet.checked}
            onChange={() => checkedAddress(index)}
          />
        </CTableHeaderCell>
        <CTableDataCell>{wallet.address}</CTableDataCell>
        <CTableDataCell>
          {parseFloat(web3.utils.fromWei(wallet.balance + '', 'ether')).toFixed(5)}
        </CTableDataCell>
        <CTableDataCell>{wallet.txsCount}</CTableDataCell>
        <CTableDataCell>{wallet.lastMsg}</CTableDataCell>
        <CTableDataCell>
          <CLink type="button" onClick={() => delAddress(index)}>
            <CIcon icon={cilDelete} />
          </CLink>
        </CTableDataCell>
      </CTableRow>
    ))
    return (
      <CTable>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">
              <CFormCheck
                label="#"
                onChange={checkedAllAddress}
                indeterminate={IsAllCheckedAddress() === 0}
                checked={IsAllCheckedAddress() === 1}
              />
            </CTableHeaderCell>
            <CTableHeaderCell scope="col">地址</CTableHeaderCell>
            <CTableHeaderCell scope="col">余额</CTableHeaderCell>
            <CTableHeaderCell scope="col">交易数</CTableHeaderCell>
            <CTableHeaderCell scope="col">执行结果</CTableHeaderCell>
            <CTableHeaderCell scope="col">操作</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>{_rows}</CTableBody>
      </CTable>
    )
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>多钱包批量交易</strong>
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
                  <CButton
                    color="primary"
                    disabled={lineNum === 0 || btnLoading}
                    onClick={ImportPrivateKey}
                  >
                    {btnLoading ? <CSpinner component="span" size="sm" aria-hidden="true" /> : null}
                    {'导入私钥(' + lineNum + ')'}
                  </CButton>
                </CCol>
              </CRow>
            </CContainer>
            <ShowWallets></ShowWallets>
            {wallets.length >= 0 ? (
              <AppSignTransaction
                web3={web3}
                name="批量调用"
                title="合约调用"
                callback={AppSignTransactionCallback}
              />
            ) : null}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}
export default BatchTransaction
