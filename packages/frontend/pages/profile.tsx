import type { NextPage } from "next";
import { useState } from "react";
import "isomorphic-fetch";
import { useAccount, useSigner } from "wagmi";

import Web3 from "web3";
import { LSPFactory } from "@lukso/lsp-factory.js";
import LSP3UniversalProfileMetadata from "@erc725/erc725.js/schemas/LSP3UniversalProfileMetadata.json";
import { ERC725, ERC725JSONSchema } from "@erc725/erc725.js";

const Upload: NextPage = () => {
  const { address } = useAccount();
  const { data, error } = useSigner();
  const [hasUP, setUP] = useState<undefined | string>("");
  const [value, setValue] = useState("");
  const [profileData, setProfileData] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();

    console.log(`Form submitted, ${value}`);
    fetchProfile(value);
  };

  async function fetchProfile(address: string) {
    try {
      const provider = new Web3.providers.HttpProvider(
        "https://rpc.l16.lukso.network"
      );
      const config = {
        ipfsGateway: "https://2eff.lukso.dev/ipfs/",
      };

      const erc725 = new ERC725(
        LSP3UniversalProfileMetadata as ERC725JSONSchema[],
        address,
        provider,
        config
      );

      const profileData = await erc725.fetchData();

      const strprofileData = JSON.stringify(profileData, undefined, 2);
      // example: "0x79c5b2a5369872A4d5102022318ED62Fe7c0d065"
      setProfileData(strprofileData);
    } catch (error) {
      return console.log("This is not an ERC725 Contract", error);
    }
  }

  async function createUniversalProfile(publicAddress: string) {
    const lspFactory = new LSPFactory("https://rpc.l16.lukso.network", {
      deployKey: process.env.NEXT_PRIVATE_KEY,
      chainId: 2828,
    });
    // await lspFactory.deployed();
    console.log("deploying");
    const deployedContracts = await lspFactory.UniversalProfile.deploy({
      controllerAddresses: [publicAddress], // our EOA that will be controlling the UP
      lsp3Profile: {
        name: "My Universal Profile",
        description: "My Cool Universal Profile",
        tags: ["Public Profile"],
        links: [
          {
            title: "My Website",
            url: "https://my.com",
          },
        ],
      },
    });

    const myUPAddress = deployedContracts?.LSP0ERC725Account?.address;

    console.log("my Universal Profile address: ", myUPAddress);
    setUP(myUPAddress);

    return deployedContracts;
  }

  return (
    <>
      <button onClick={() => (address ? createUniversalProfile(address) : "")}>
        create new account
      </button>
      <div>{hasUP}</div>
      <form onSubmit={handleSubmit}>
        <input onChange={(e) => setValue(e.target.value)} value={value}></input>
        <button type="submit">Inspect the Address</button>
      </form>
      <p>{profileData}</p>
    </>
  );
};

export default Upload;
