import { nftContract, nftABI } from '../components/abi/IERC721';
import { useMoralis, useMoralisFile, useMoralisWeb3Api, useNFTBalances } from 'react-moralis';

import { Card, Avatar, Image, Tooltip, Modal, Input, Alert, Spin, Button } from "antd";
import { EditOutlined, EllipsisOutlined, SettingOutlined, LoadingOutlined  } from '@ant-design/icons';
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
import "antd/dist/antd.css";

import { useState, useEffect, Suspense } from 'react';
import { Canvas } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { useLoader } from "@react-three/fiber";
import Model from '../components/Model';
import axios from 'axios';
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

function Loader() {
  const { active, progress, errors, item, loaded, total } = useProgress();
  return <Html center>{progress} % loaded</Html>;
}

export default function Profile() {
  const [userNFTs, setUserNFTs] = useState([])
  const { enableWeb3, Moralis, isAuthenticated, user} = useMoralis();
  const [nftsLoaded, setNFTsLoaded] = useState('not-loaded')
  const [loading, setLoading] = useState('not-loaded')
  const [nftURIs, setURIs] = useState([])
  const [theNFTs, setNFTs] = useState([])
  /*const account = useMoralisWeb3Api();
    const { web3, enableWeb3, Moralis } = useMoralis();
    const { error, isUploading, moralisFile, saveFile } = useMoralisFile();
    const { getNFTBalances, data, isLoading, isFetching } = useNFTBalances();*/
    
  async function getUserNFTs () {
    if(isAuthenticated) {
      const nfts = await Moralis.Web3API.account.getNFTs({chain: 'avalanche testnet', address: user.get("ethAddress") }).then(setNFTsLoaded('loaded'))

      setUserNFTs(nfts.result)
      //console.log(nfts.result) 
    }
  }

  async function getURI() {
    let uris = []
    let nfts = []
    userNFTs.map(async (nft, index) => {

      try {    
        const fullTokenURI = `https://dweb.link/ipfs/${nft.token_uri.substring(nft.token_uri.lastIndexOf('ipfs')).replace(/^ipfs:\/\//, "")}`    
        console.log(fullTokenURI) 
        const meta = await axios.get(fullTokenURI) 
        if(meta.data.fileType.length != 0) {
          console.log(meta)
          console.log("joe", meta.data)   
          let item = meta.data.image
          //console.log(item) 
          const uri = `https://dweb.link/ipfs/${item.replace(/^ipfs:\/\//, "")}`
          //console.log(uri)
          console.log('this app a fraud') //💀
          uris.push(uri)
          nfts.push(meta.data)
        } 
      } catch (e) {
        console.log("derivative of e", e)
      }
    }) 
    //console.log("x", nfts)
    setURIs(uris)
    setNFTs(nfts)
    setLoading('loaded')
    console.log(nftURIs)
    console.log(userNFTs)
  }

  useEffect(() => {
    getUserNFTs()
    getURI() 
    const id = setInterval(() => {
      
    }, 3000);
    return () => clearInterval(id);
  }, [loading]) 

  if(loading === 'loaded' && nftsLoaded === 'loaded' && !userNFTs.length) return <><h1>Loading ... </h1></>
  else {
    return (
      <>
      <div className='w-full pr-8 m-0 mt-8 text-white h-screen flex justify-between'>
        {theNFTs.map((nft, index) => (
          <div key={index}>
            <div className='h-96'>
            <Card
              style={{ width: 400 }} 
              cover={
                <Canvas>
                  <Suspense fallback={<Loader />}> 
                  <ambientLight intensity={0.2} />
                  <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                  <pointLight position={[-10, -10, -10]} />
                    <Model loader={nft.fileType} url={nftURIs[index]}/>
                    <OrbitControls />
                    <Environment preset="apartment" background />
                  </Suspense>
                </Canvas> 
              }
              actions={[
                <SettingOutlined key="setting" />,
                <EditOutlined key="edit" />,
                <EllipsisOutlined key="ellipsis" />,
              ]}
            >
              <Meta
                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                title={nft.name}
                description="a part of the metaverse"
              />
            </Card>
            </div>
          </div>
        ))}
      </div>
      
      </>
    )
  }    
}