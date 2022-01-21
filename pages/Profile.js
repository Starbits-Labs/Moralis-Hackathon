import { nftContract, nftABI } from '../components/abi/IERC721';
import { useMoralis, useMoralisFile, useMoralisWeb3Api, useNFTBalances } from 'react-moralis';
import { Card, Image, Tooltip, Modal, Input, Alert, Spin, Button } from "antd";
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { useState, useEffect, Suspense } from 'react';
import { Canvas } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { useLoader } from "@react-three/fiber";
import Model from '../components/Model';
import {
  Environment,
  OrbitControls,
  Html,
  useProgress
} from "@react-three/drei";

const { Meta } = Card;

const styles = {
  NFTs: {
    display: "flex",
    flexWrap: "wrap",
    WebkitBoxPack: "start",
    justifyContent: "flex-start",
    margin: "0 auto",
    maxWidth: "1000px",
    gap: "10px",
  },
};

var userNFTs = [] 

function Loader() {
  const { active, progress, errors, item, loaded, total } = useProgress();
  return <Html center>{progress} % loaded</Html>;
}

export default function Profile() {
  const { enableWeb3, Moralis, isAuthenticated, user} = useMoralis();
  /*const account = useMoralisWeb3Api();
    const { web3, enableWeb3, Moralis } = useMoralis();
    const { error, isUploading, moralisFile, saveFile } = useMoralisFile();
    const { getNFTBalances, data, isLoading, isFetching } = useNFTBalances();*/
    
  async function getUserNFTs () {
    if(isAuthenticated) {
      const nfts = await Moralis.Web3API.account.getNFTs({chain: 'avalanche testnet', address: user.get("ethAddress") })

      nfts.result.forEach(element => {
        userNFTs.push(element)
      });
      
    }
  }

  function handleSellClick(address) {

  }

  console.log("PLEASEPLEASEPLEASE")
  console.log(userNFTs)

  getUserNFTs()

      return (
        <div className='flex w-full'>
          {userNFTs.forEach((nft) => (
            <div key={5}>
              <div className='h-screen w-1/2'>
                <h1>NFTs: {nft.name}</h1>
                <Canvas>
                  <Suspense fallback={<Loader />}> 
                  <ambientLight intensity={0.2} />
                  <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                  <pointLight position={[-10, -10, -10]} />
                    <Model loader={OBJLoader} url={nft.token_uri}/>
                    <OrbitControls />
                    <Environment preset="sunset" background />
                  </Suspense>
                </Canvas>
              </div>
            </div>
          ))}
          
        </div>
      )
}
