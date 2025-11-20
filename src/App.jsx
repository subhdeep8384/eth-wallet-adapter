import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import './App.css'
import { useState } from 'react'

const client = createPublicClient({
  chain: mainnet ,
  transport: http() ,
})

function App() {
  const [balance  , setBalance ] = useState("") ;
  async function getBalance() {
    
    const res = await client.getBalance({address :"0x27ddbd060fc0eca935b560f21e18c95fb01262cb"})
    console.log(res)
    setBalance(res.toString())
  }
  return (
    <>
     {balance ? <p>the balance is {balance}</p> : null}
      <button onClick={getBalance}>Get balance</button>     
    </>
  )
}

export default App
