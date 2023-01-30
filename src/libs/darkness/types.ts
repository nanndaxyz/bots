import { BigNumber, BigNumberish, Contract } from "ethers";

import { AppConfig } from "../../../app.config";

export const abi = [
  "constructor(address,address,string,string)",
  "error OperatorNotAllowed(address)",
  "event Approval(address indexed,address indexed,uint256 indexed)",
  "event ApprovalForAll(address indexed,address indexed,bool)",
  "event LevelUp(uint256 indexed,uint256 indexed,address indexed)",
  "event OwnerUpdated(address indexed,address indexed)",
  "event Paused(address)",
  "event RoleAdminChanged(bytes32 indexed,bytes32 indexed,bytes32 indexed)",
  "event RoleGranted(bytes32 indexed,address indexed,address indexed)",
  "event RoleRevoked(bytes32 indexed,address indexed,address indexed)",
  "event Summoned(uint256 indexed,address indexed)",
  "event Transfer(address indexed,address indexed,uint256 indexed)",
  "event Unpaused(address)",
  "function COOLDOWN_TIME() view returns (uint256)",
  "function DEFAULT_ADMIN_ROLE() view returns (bytes32)",
  "function MAX_LEVEL() view returns (uint256)",
  "function MINT_ROLE() view returns (bytes32)",
  "function OPERATOR_FILTER_REGISTRY() view returns (address)",
  "function SUMMON_ROLE() view returns (bytes32)",
  "function SYSTEM_MANAGER_ROLE() view returns (bytes32)",
  "function approve(address,uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function circuitBreakerTriggeredTime() view returns (uint256)",
  "function contractURI() view returns (string)",
  "function darknessData(uint256) view returns (tuple(uint256,uint8))",
  "function emergencyTime() view returns (uint256)",
  "function getApproved(uint256) view returns (address)",
  "function getRoleAdmin(bytes32) view returns (bytes32)",
  "function grantRole(bytes32,address)",
  "function hasRole(bytes32,address) view returns (bool)",
  "function isApprovedForAll(address,address) view returns (bool)",
  "function levelUp(uint256) payable",
  "function levelUpPriceData(uint256) view returns (tuple(bool,bool,uint256[10]))",
  "function metadatas(uint256) view returns (tuple(uint8,string,bytes)[])",
  "function mint(address,uint256)",
  "function name() view returns (string)",
  "function owner() view returns (address)",
  "function ownerOf(uint256) view returns (address)",
  "function pause()",
  "function paused() view returns (bool)",
  "function renounceRole(bytes32,address)",
  "function revokeRole(bytes32,address)",
  "function royaltyInfo(uint256,uint256) view returns (address, uint256)",
  "function safeTransferFrom(address,address,uint256)",
  "function safeTransferFrom(address,address,uint256,bytes)",
  "function setApprovalForAll(address,bool)",
  "function setBaseTokenURI(string)",
  "function setContractURI(string)",
  "function setNDTDependecies(address,address,address,address)",
  "function setOwner(address)",
  "function start()",
  "function startCircuitBreakerMode()",
  "function startEmergency()",
  "function startTime() view returns (uint256)",
  "function stopCircuitBreakerMode()",
  "function summon(address)",
  "function supportsInterface(bytes4) view returns (bool)",
  "function symbol() view returns (string)",
  "function tokenByIndex(uint256) view returns (uint256)",
  "function tokenIds(address) view returns (uint256[])",
  "function tokenOfOwnerByIndex(address,uint256) view returns (uint256)",
  "function tokenURI(uint256) view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function transferFrom(address,address,uint256)",
  "function unpause()",
  "function withdrawETH()",
];

type IDarknessDarknessDataRaw = [BigNumber, number];

type IDarknessDarknessData = {
  cooldownEndAt: BigNumber;
  level: number;
};

const toIDarknessDarkenessData = (arg: IDarknessDarknessDataRaw) => {
  const [cooldownEndAt, level] = arg;
  return {
    cooldownEndAt,
    level,
  };
};

type DarknessRow = {
  darknessData: (tokenId: BigNumberish) => Promise<IDarknessDarknessDataRaw>;
  totalSupply: () => Promise<BigNumber>;
  tokenByIndex: (index: BigNumberish) => Promise<BigNumber>;
};

export type Darkness = {
  darknessData: (tokenId: BigNumberish) => Promise<IDarknessDarknessData>;
  totalSupply: () => Promise<BigNumber>;
  tokenByIndex: (index: BigNumberish) => Promise<BigNumber>;
};

export const getDarkness = async (): Promise<Darkness> => {
  const provider = AppConfig.provider;

  const rawContract = new Contract(
    AppConfig.darknessAddress,
    abi,
    provider
  ) as unknown as DarknessRow;

  return {
    darknessData: async (tokenId: BigNumberish) => {
      return toIDarknessDarkenessData(await rawContract.darknessData(tokenId));
    },
    totalSupply: async () => await rawContract.totalSupply(),
    tokenByIndex: async (index: BigNumberish) =>
      await rawContract.tokenByIndex(index),
  };
};
