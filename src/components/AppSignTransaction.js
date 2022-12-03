import {
  CButton,
  CCol,
  CFormInput,
  CFormSwitch,
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import { useState } from 'react'
import React from 'react'

const AppSignTransaction = (props) => {
  const [visible, setVisible] = useState(false)
  const [CheckedSendAllBalance, setCheckedSendAllBalance] = useState(false)
  const [CheckedRealGas, setCheckedRealGas] = useState(false)
  const [sendValue, setSendValue] = useState('0')
  const [sendData, setSendData] = useState('0x')
  const [toAddress, settoAddress] = useState('0x')
  const [gasPrice, setgasPrice] = useState('5.0')
  const [gasLimit, setgasLimit] = useState('200000')
  let header = (
    <CModalHeader>
      <CModalTitle>{props.title}</CModalTitle>
    </CModalHeader>
  )
  function callback() {
    if (props.callback) {
      let txData = {
        to: toAddress,
        data: sendData,
      }
      if (!CheckedSendAllBalance) txData['value'] = props.web3.utils.toWei(sendValue, 'ether')
      if (!CheckedRealGas) {
        txData['gasPrice'] = props.web3.utils.toWei(gasPrice, 'gwei')
        txData['gas'] = parseInt(gasLimit)
      }
      props.callback(txData, CheckedSendAllBalance)
    }
  }
  function isAddress(address) {
    return props.web3.utils.isAddress(address)
  }
  function isHex(data) {
    return props.web3.utils.isHex(data)
  }

  function toNumber(str) {
    return str.replace(/^\D*(\d*(?:\.\d{0,10})?).*$/g, '$1')
  }
  function toInt(str) {
    return str.replace(/[^\d]/g, '')
  }

  let footer = (
    <CModalFooter>
      <CButton color="secondary" onClick={() => setVisible(false)}>
        取消
      </CButton>
      <CButton
        color="primary"
        onClick={() => callback()}
        disabled={!isHex(sendData) || !isAddress(toAddress)}
      >
        确认
      </CButton>
    </CModalFooter>
  )
  let gasinput = (
    <>
      <CRow className="align-items-center mb-2">
        <CCol>
          <CInputGroup>
            <CFormInput value={gasPrice} onChange={(e) => setgasPrice(toNumber(e.target.value))} />
            <CInputGroupText className="bg-info">Gas Price(gwei)</CInputGroupText>
          </CInputGroup>
        </CCol>
      </CRow>
      <CRow className="align-items-center mb-4">
        <CCol>
          <CInputGroup>
            <CFormInput value={gasLimit} onChange={(e) => setgasLimit(toInt(e.target.value))} />
            <CInputGroupText className="bg-warning">Gas Limit</CInputGroupText>
          </CInputGroup>
        </CCol>
      </CRow>
    </>
  )
  return (
    <>
      <CButton onClick={() => setVisible(!visible)}>{props.name}</CButton>
      <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
        {props.title ? header : null}
        <CModalBody>
          <CRow className="align-items-center mb-2">
            <CCol>
              <CFormSwitch
                label="使用实时GAS价格?"
                defaultChecked={CheckedRealGas}
                onClick={() => setCheckedRealGas(!CheckedRealGas)}
              />
            </CCol>
          </CRow>
          {!CheckedRealGas ? gasinput : null}
          <CRow className="align-items-center mb-2">
            <CCol>
              <CInputGroup>
                <CInputGroupText className="bg-danger text-white">发送</CInputGroupText>
                <CFormInput
                  disabled={CheckedSendAllBalance}
                  value={sendValue}
                  onChange={(e) => setSendValue(toNumber(e.target.value))}
                />
                <CInputGroupText className="bg-danger text-white">BNB</CInputGroupText>
              </CInputGroup>
            </CCol>
            <CCol>
              <CFormSwitch
                label="转出所有余额?"
                defaultChecked={CheckedSendAllBalance}
                onClick={() => setCheckedSendAllBalance(!CheckedSendAllBalance)}
              />
            </CCol>
          </CRow>
          <CRow className="align-items-center mb-2">
            <CCol>
              <CInputGroup>
                <CInputGroupText className="bg-dark text-white">目标地址</CInputGroupText>
                <CFormInput
                  invalid={!isAddress(toAddress)}
                  value={toAddress}
                  onChange={(e) => settoAddress(e.target.value)}
                />
              </CInputGroup>
            </CCol>
          </CRow>
          <CRow className="align-items-center mb-2">
            <CCol>
              <CInputGroup>
                <CInputGroupText className="bg-body">数据</CInputGroupText>
                <CFormTextarea
                  rows="3"
                  invalid={!isHex(sendData)}
                  value={sendData}
                  onChange={(e) => setSendData(e.target.value)}
                ></CFormTextarea>
              </CInputGroup>
            </CCol>
          </CRow>
        </CModalBody>
        {footer}
      </CModal>
    </>
  )
}
export default AppSignTransaction
