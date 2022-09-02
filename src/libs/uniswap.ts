import { ethers } from "ethers";
import { Provider } from "@ethersproject/providers";
import { FeeAmount, Pool } from "@uniswap/v3-sdk";
import { Token } from "@uniswap/sdk-core";
import { abi as UniswapV3Factory } from "@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json";
import { abi as IUniswapV3Pool } from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import { abi as ERC20 } from "@openzeppelin/contracts/build/contracts/ERC20.json";

const ERC20Contract = (provider: Provider, tokenAddress: string) =>
  new ethers.Contract(tokenAddress, ERC20, provider);

const factoryContract = (provider: Provider, factoryAddress: string) =>
  new ethers.Contract(
    "0x1F98431c8aD98523631AE4a59f267346ea31F984", // mainnet factory contract
    UniswapV3Factory,
    provider
  );

const poolContract = (provider: Provider, poolAddress: string) =>
  new ethers.Contract(poolAddress, IUniswapV3Pool, provider);

const getPoolAddress = async (
  factory: ethers.Contract,
  tokenA: string,
  tokenB: string,
  fee: FeeAmount
) => await factory.getPool(tokenA, tokenB, fee);

interface Immutables {
  factory: string;
  token0: string;
  token1: string;
  fee: number;
  tickSpacing: number;
  maxLiquidityPerTick: ethers.BigNumber;
}

interface State {
  liquidity: ethers.BigNumber;
  sqrtPriceX96: ethers.BigNumber;
  tick: number;
  observationIndex: number;
  observationCardinality: number;
  observationCardinalityNext: number;
  feeProtocol: number;
  unlocked: boolean;
}

const getPoolImmutables = async (
  pool: ethers.Contract,
  blocknumber: number
) => {
  const [factory, token0, token1, fee, tickSpacing, maxLiquidityPerTick] =
    await Promise.all([
      pool.factory({ blockTag: blocknumber }),
      pool.token0({ blockTag: blocknumber }),
      pool.token1({ blockTag: blocknumber }),
      pool.fee({ blockTag: blocknumber }),
      pool.tickSpacing({ blockTag: blocknumber }),
      pool.maxLiquidityPerTick({ blockTag: blocknumber }),
    ]);

  const immutables: Immutables = {
    factory,
    token0,
    token1,
    fee,
    tickSpacing,
    maxLiquidityPerTick,
  };

  return immutables;
};

const getPoolState = async (pool: ethers.Contract, blocknumber: number) => {
  const [liquidity, slot] = await Promise.all([
    pool.liquidity({ blockTag: blocknumber }),
    pool.slot0({ blockTag: blocknumber }),
  ]);

  const PoolState: State = {
    liquidity,
    sqrtPriceX96: slot[0],
    tick: slot[1],
    observationIndex: slot[2],
    observationCardinality: slot[3],
    observationCardinalityNext: slot[4],
    feeProtocol: slot[5],
    unlocked: slot[6],
  };

  return PoolState;
};

export const getPool = async (
  provider: Provider,
  factoryAddress: string,
  tokenAAddress: string,
  tokenBAddress: string,
  feeAmount: FeeAmount,
  blocknumber: number
) => {
  const factory = factoryContract(provider, factoryAddress);
  const poolAddress = await getPoolAddress(
    factory,
    tokenAAddress,
    tokenBAddress,
    feeAmount
  );

  const pool = poolContract(provider, poolAddress);

  const [immutables, state] = await Promise.all([
    getPoolImmutables(pool, blocknumber),
    getPoolState(pool, blocknumber),
  ]);

  const token0 = new Token(
    1,
    immutables.token0,
    await ERC20Contract(provider, immutables.token0).decimals()
  );
  const token1 = new Token(
    1,
    immutables.token1,
    await ERC20Contract(provider, immutables.token1).decimals()
  );

  return new Pool(
    token0,
    token1,
    immutables.fee,
    state.sqrtPriceX96.toString(),
    state.liquidity.toString(),
    state.tick
  );
};
