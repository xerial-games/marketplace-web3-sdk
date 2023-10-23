import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import marketplaceFunctions from '@/web3_functions'
import { useEffect } from 'react'
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  useEffect(() => {
    // Muestra la info de un NFT por tokenId y contractAddress. Te menciona si se encuentra listado o no en el marketplace primario.
    marketplaceFunctions.listings("4", "0x4Ee540daA6ecA698B2dDd25373784594B8f82949");
  }, []);
  
  return (
    <>
      <Head>
        <title>SDK Xerial</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        L
      </div>
    </>
  )
}
