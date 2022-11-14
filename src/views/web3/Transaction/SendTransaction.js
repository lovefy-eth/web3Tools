import * as React from 'react'
import { useDebounce } from 'use-debounce'
import { usePrepareSendTransaction, useSendTransaction, useWaitForTransaction } from 'wagmi'
import { parseEther } from 'ethers/lib/utils'
import { useAccount } from 'wagmi'

export function SendTransactionShow() {
  const { isConnected } = useAccount()

  if (isConnected) {
    return (
      <div>
        {/* Account content goes here */}
        <SendTransaction />
      </div>
    )
  }

  return <div>请先连接钱包,兄弟！合并测试</div>
}

export function SendTransaction() {
  const [to, setTo] = React.useState('')
  const [debouncedTo] = useDebounce(to, 500)

  const [amount, setAmount] = React.useState('')
  //const [debouncedValue] = useDebounce(value, 500)

  const { config } = usePrepareSendTransaction({
    request: {
      to: debouncedTo,
      value: amount ? parseEther(amount) : undefined,
    },
  })
  const { data, sendTransaction } = useSendTransaction(config)

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        sendTransaction?.()
      }}
    >
      <input
        aria-label="Recipient"
        onChange={(e) => setTo(e.target.value)}
        placeholder="0xA0Cf…251e"
        value={to}
      />
      <input
        aria-label="Amount (ether)"
        onChange={(e) => setAmount(e.target.value)}
        placeholder="0.05"
        value={amount}
      />
      <button disabled={isLoading || !sendTransaction || !to || !amount}>
        {isLoading ? 'Sending...' : 'Send'}
      </button>
      {isSuccess && (
        <div>
          Successfully sent {amount} ether to {to}
          <div>
            <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
          </div>
        </div>
      )}
    </form>
  )
}
export default SendTransactionShow
