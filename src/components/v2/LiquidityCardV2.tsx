import React, { useState } from "react";
import { BsArrowRightShort } from "react-icons/bs";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { TokenSelectionCard, LiquidityInputCard } from "../liquidity";
import LiquidityChartRangeInput from "./LiquidityChartRangeInput";

const feeTier = [0.01, 0.05, 0.3, 1];

const LiquidityCardV2 = () => {
  const [currentFeeIndex, setCurrentFeeIndex] = useState(2);
  const [localState, setLocalState] = useState({
    minLiquidity: 0,
    maxLiquidity: 0,
    tokenA: {
      balance: 332.32,
      balanceValue: 2010.2,
      userInput: 0,
      name: "MovEX",
    },
    tokenB: {
      balance: 332.32,
      balanceValue: 45000.0,
      userInput: 0,
      name: "USD Coin",
    },
  });

  const nextFee = () => {
    setCurrentFeeIndex((prev) => {
      if (prev >= feeTier.length - 1) {
        return prev;
      }
      return prev + 1;
    });
  };

  const prevFee = () => {
    setCurrentFeeIndex((prev) => {
      if (prev >= 1) {
        return prev - 1;
      }
      return prev;
    });
  };
  return (
    <div className="liquidity-card !p-6">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-semibold text-white font-popins">
          Add liquidity
        </h3>
        <button className="rounded-full bg-white bg-opacity-[0.08] px-4 py-1 text-success inline-flex items-center text-base font-semibold">
          Your reward
          <span className="ml-2 text-2xl">
            <BsArrowRightShort />
          </span>
        </button>
      </div>
      <h5 className="subtitle-4 mb-2">Deposit Pair to receive LP tokens</h5>
      <div className="grid grid-cols-8 gap-2 mt-2">
        <TokenSelectionCard
          className="col-span-3"
          tokenName={localState.tokenA.name}
          balance={localState.tokenA.balance}
          balanceValue={localState.tokenA.balanceValue}
          userInput={localState.tokenA.userInput}
          onChangeToken={(name) => {
            setLocalState((s) => ({
              ...s,
              tokenA: {
                ...s.tokenA,
                name: name,
              },
            }));
          }}
          onChange={(v) =>
            setLocalState((s) => ({
              ...s,
              tokenA: {
                ...s.tokenA,
                userInput: Number(v),
              },
            }))
          }
          onSetMaxValue={() =>
            setLocalState((s) => ({
              ...s,
              tokenA: {
                ...s.tokenA,
                userInput: s.tokenA.balanceValue,
              },
            }))
          }
        />
        <TokenSelectionCard
          className="col-span-3"
          tokenName={localState.tokenB.name}
          balance={localState.tokenB.balance}
          balanceValue={localState.tokenB.balanceValue}
          userInput={localState.tokenB.userInput}
          onChangeToken={(name) => {
            setLocalState((s) => ({
              ...s,
              tokenB: {
                ...s.tokenB,
                name: name,
              },
            }));
          }}
          onChange={(v) =>
            setLocalState((s) => ({
              ...s,
              tokenB: {
                ...s.tokenB,
                userInput: Number(v),
              },
            }))
          }
          onSetMaxValue={() =>
            setLocalState((s) => ({
              ...s,
              tokenB: {
                ...s.tokenB,
                userInput: s.tokenB.balanceValue,
              },
            }))
          }
        />
        <div className="bg-dark rounded-2xl p-4 flex justify-between items-center col-span-2">
          <button
            onClick={prevFee}
            className="w-6 h-6 rounded-full bg-success text-black text-lg grid place-items-center"
          >
            <FaAngleLeft />
          </button>
          <div className="text-center w-[calc(100%-48px)]">
            <h4 className="font-medium text-white text-sm my-0">Fee tier</h4>
            <input
              className="my-1 text-success text-base font-medium bg-transparent w-[60%] max-w-full text-center"
              value={feeTier[currentFeeIndex] + "%"}
            />
            <p className="text-xs font-normal text-[#96969A] my-0">
              90% selected
            </p>
          </div>
          <button
            onClick={nextFee}
            className="w-6 h-6 rounded-full bg-success text-black text-lg grid place-items-center"
          >
            <FaAngleRight />
          </button>
        </div>
      </div>
      <div className="flex items-center justify-center my-4 text-[#6C7080] text-xs font-popins font-normal">
        <strong>Current Price</strong>{" "}
        <strong className="mx-2 text-white">1179.3571</strong> USDC per MovEX
      </div>
      <div className="w-full">
        <LiquidityChartRangeInput
          feeAmount={feeTier[currentFeeIndex] * 10000}
          interactive={true}
          price={1179.3571}
          ticksAtLimit={{ LOWER: false, UPPER: false }}
          onLeftRangeInput={(v) => {
            setLocalState((p) => ({ ...p, minLiquidity: Number(v) }));
          }}
          onRightRangeInput={(v) => {
            setLocalState((p) => ({ ...p, maxLiquidity: Number(v) }));
          }}
          priceLower={localState.minLiquidity}
          priceUpper={localState.maxLiquidity}
        />
      </div>
      <div className="grid grid-cols-8 gap-2 mt-8">
        <LiquidityInputCard
          className="col-span-3 bg-[#14181F] bg-opacity-[0.64]"
          value={localState.minLiquidity}
          title="Min"
          tokenPair="USDC / 1 MovEX"
          onChange={(v) =>
            setLocalState((s) => ({ ...s, minLiquidity: Number(v) }))
          }
          increase={() =>
            setLocalState((prev) => ({
              ...prev,
              minLiquidity: Number((prev.minLiquidity + 0.1).toFixed(2)),
            }))
          }
          decrease={() =>
            setLocalState((prev) => ({
              ...prev,
              minLiquidity: Number((prev.minLiquidity - 0.1).toFixed(2)),
            }))
          }
        />
        <div className="bg-[#14181F] bg-opacity-[0.64] rounded-2xl p-4 flex justify-between items-center col-span-2">
          <button className="w-6 h-6 rounded-full bg-transparent text-[#6C7080] text-lg grid place-items-center">
            <FaAngleLeft />
          </button>
          <div className="text-center w-[calc(100%-48px)]">
            <h4 className="font-medium text-[#6C7080] text-sm my-0">
              Full Range
            </h4>
          </div>
          <button className="w-6 h-6 rounded-full bg-transparent text-[#6C7080] text-lg grid place-items-center">
            <FaAngleRight />
          </button>
        </div>
        <LiquidityInputCard
          className="col-span-3"
          value={localState.maxLiquidity}
          title="Max"
          tokenPair="USDC / 1 MovEX"
          onChange={(v) =>
            setLocalState((s) => ({ ...s, maxLiquidity: Number(v) }))
          }
          increase={() =>
            setLocalState((prev) => ({
              ...prev,
              maxLiquidity: Number((prev.maxLiquidity + 0.1).toFixed(2)),
            }))
          }
          decrease={() =>
            setLocalState((prev) => ({
              ...prev,
              maxLiquidity: Number((prev.maxLiquidity - 0.1).toFixed(2)),
            }))
          }
        />
      </div>
      <button
        disabled={!localState.tokenA.userInput || !localState.tokenB.userInput}
        className="add-confirm mt-8"
      >
        Confirm
      </button>
    </div>
  );
};

export default LiquidityCardV2;
