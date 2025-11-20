import { useRef } from "react";
import "./App.css";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { createPublicClient } from "viem";
import { base, mainnet } from "viem/chains";
import { createConfig , http, injected, useAccount, useBalance, useConnect, useSendTransaction, WagmiProvider } from 'wagmi'
import { metaMask, safe } from "wagmi/connectors";

export const config = createConfig({
  chains: [mainnet , base] ,
  connectors: [
    injected() ,
    metaMask() ,
    safe() ,
  ] ,
  transports: [{
    [mainnet.id] : http() ,
    [base.id] : http() ,
}] ,
})

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
});

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Balance />
        <WalletAdapter />
      </QueryClientProvider>
    </WagmiProvider>
  );
}


function WalletConnector() {
  const { connectors, connect } = useConnect();
  const { address, isConnected } = useAccount();

  return (
    <div>
      {isConnected ? (
        <p>Connected to {address}</p>
      ) : (
        connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => {
              connect({ connector });
            }}
          >
            {connector.name}
          </button>
        ))
      )}
      <div>
        {isConnected ? <p>you are connected</p> : <p>you are not connected</p>}
      </div>
    </div>
  );
}


function WalletAdapter() {
  const addressRef = useRef("") ;
  const balance = useBalance()
  const {data : hash , sendTransaction } = useSendTransaction() ;
  
  function EthSend() {
    console.log(addressRef)
    sendTransaction({
      to: addressRef.current.value,
      value: 1000000000000000,
    })
    console.log("The hash is :::" ,hash)
  }
  return(<div>
    <WalletConnector />
    <p>Your balance: {balance.data?.formatted}</p>
    <input ref={addressRef} type="text" placeholder="Address" />
    <button  onClick={EthSend}>Send Eth </button>
  </div>
  )
}

function Balance() {
  const {address} = useAccount();
  async function getBalance() {
    return client.getBalance({
      address: address,
    });
  }

  const { isPending, data: balance } = useQuery({
    queryKey: ["balance"],
    queryFn: getBalance,
  });

  return (
    <div>
      {!isPending && balance && <p>Balance: {balance.toString()}</p>}
      <button onClick={getBalance}>Get balance</button>
    </div>
  );
}

export default App;
