import {
  getEnvAccount,
  getAppEnv,
  getVercelClient,
} from '../components/env.js';
import {
  generateDummyCollectionWithMap,
  getMapFromVercelNFTs,
  setNFTsToVercel,
  setMetadatasToVercel,
} from '../components/NFT.js';
import { initRootWithApp } from '../components/transactions.js';
import { startBerkeleyClient } from '../components/client.js';

startBerkeleyClient();
const client = getVercelClient();
const { pubKey: pubKey, pk: deployerKey } = getEnvAccount();
const { appId: appId, pk: zkAppPK } = getAppEnv();

const {
  map: merkleMap,
  nftArray: nftArray,
  nftMetadata: nftMetadata,
} = generateDummyCollectionWithMap(pubKey);

const generateTreeRoot = merkleMap.getRoot().toString();

await setNFTsToVercel(appId, nftArray, client);
await setMetadatasToVercel(appId, nftMetadata, client);

const storedTree = await getMapFromVercelNFTs(appId, [0, 1, 2], client);

const storedTreeRoot = storedTree.getRoot().toString();

console.log('matches subbed tree', storedTreeRoot === generateTreeRoot);

const compile = true;
const live = true;

await initRootWithApp(
  zkAppPK,
  deployerKey,
  merkleMap,
  nftArray.length,
  compile,
  live
);
