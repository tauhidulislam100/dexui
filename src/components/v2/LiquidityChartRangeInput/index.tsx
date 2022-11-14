// import { Trans } from '@lingui/macro'
// import { Currency, Price, Token } from '@uniswap/sdk-core'
// import { FeeAmount } from '@uniswap/v3-sdk'
// import { sendEvent } from 'components/analytics'
// import { AutoColumn, ColumnCenter } from 'components/Column'
// import Loader from 'components/Loader'
import { format } from "d3";
// import { useColor } from 'hooks/useColor'
// import { saturate } from 'polished'
import React, { ReactNode, useCallback, useMemo } from "react";
// import { BarChart2, CloudOff, Inbox } from 'react-feather'
// import { batch } from 'react-redux'
// import { Bound } from 'state/mint/v3/actions'
import styled, { useTheme } from "styled-components/macro";
import { USDC_WETH_CHART_DATA } from "../../model";

// import { ThemedText } from '../../theme'
import { Bound, Chart } from "./Chart";
import { FeeAmount } from "./hooks";
// import { useDensityChartData } from './hooks'
import { ZoomLevels } from "./types";

/**
 * The default factory tick spacings by fee amount.
 */
export declare const TICK_SPACINGS: {
  [amount in FeeAmount]: number;
};

console.log("FEE ", FeeAmount);

const ZOOM_LEVELS: Record<FeeAmount, ZoomLevels> = {
  [FeeAmount.LOWEST]: {
    initialMin: 0.999,
    initialMax: 1.001,
    min: 0.00001,
    max: 1.5,
  },
  [FeeAmount.LOW]: {
    initialMin: 0.999,
    initialMax: 1.001,
    min: 0.00001,
    max: 1.5,
  },
  [FeeAmount.MEDIUM]: {
    initialMin: 0.5,
    initialMax: 2,
    min: 0.00001,
    max: 20,
  },
  [FeeAmount.HIGH]: {
    initialMin: 0.5,
    initialMax: 2,
    min: 0.00001,
    max: 20,
  },
};

const ChartWrapper = styled.div`
  position: relative;

  justify-content: center;
  align-content: center;
`;

// function InfoBox({ message, icon }: { message?: ReactNode; icon: ReactNode }) {
//   return (
//     <ColumnCenter style={{ height: "100%", justifyContent: "center" }}>
//       {icon}
//       {message && (
//         <ThemedText.DeprecatedMediumHeader
//           padding={10}
//           marginTop="20px"
//           textAlign="center"
//         >
//           {message}
//         </ThemedText.DeprecatedMediumHeader>
//       )}
//     </ColumnCenter>
//   );
// }

export default function LiquidityChartRangeInput({
  feeAmount,
  ticksAtLimit,
  price,
  priceLower,
  priceUpper,
  onLeftRangeInput,
  onRightRangeInput,
  interactive,
}: {
  feeAmount?: FeeAmount;
  ticksAtLimit: { [bound in Bound]?: boolean | undefined };
  price: number | undefined;
  priceLower?: Number;
  priceUpper?: Number;
  onLeftRangeInput: (typedValue: string) => void;
  onRightRangeInput: (typedValue: string) => void;
  interactive: boolean;
}) {
  const isSorted = true;

  const onBrushDomainChangeEnded = useCallback(
    (domain: [number, number], mode: string | undefined) => {
      let leftRangeValue = Number(domain[0]);
      const rightRangeValue = Number(domain[1]);
      console.log("domain ", domain);
      if (leftRangeValue <= 0) {
        leftRangeValue = 1 / 10 ** 6;
      }

      // simulate user input for auto-formatting and other validations
      if (
        (!ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER] ||
          mode === "handle" ||
          mode === "reset") &&
        leftRangeValue > 0
      ) {
        onLeftRangeInput(leftRangeValue.toFixed(6));
      }

      if (
        (!ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER] ||
          mode === "reset") &&
        rightRangeValue > 0
      ) {
        // todo: remove this check. Upper bound for large numbers
        // sometimes fails to parse to tick.
        if (rightRangeValue < 1e35) {
          onRightRangeInput(rightRangeValue.toFixed(6));
        }
      }
    },
    [isSorted, onLeftRangeInput, onRightRangeInput, ticksAtLimit]
  );

  interactive = interactive && Boolean(USDC_WETH_CHART_DATA?.length);

  const brushDomain: [number, number] | undefined = useMemo(() => {
    // const leftPrice = isSorted ? priceLower : priceUpper?.invert();
    // const rightPrice = isSorted ? priceUpper : priceLower?.invert();

    return priceLower && priceUpper
      ? [priceLower as number, priceUpper as number]
      : undefined;
  }, [isSorted, priceLower, priceUpper]);

  const brushLabelValue = useCallback(
    (d: "w" | "e", x: number) => {
      if (!price) return "";

      if (d === "w" && ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER])
        return "0";
      if (d === "e" && ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER])
        return "∞";

      const percent =
        (x < price ? -1 : 1) *
        ((Math.max(x, price) - Math.min(x, price)) / price) *
        100;

      return price
        ? `${format(Math.abs(percent) > 1 ? ".2~s" : ".2~f")(percent)}%`
        : "";
    },
    [isSorted, price, ticksAtLimit]
  );

  // if (error) {
  //   sendEvent("exception", { description: error.toString(), fatal: false });
  // }

  // const isUninitialized =
  //   !currencyA || !currencyB || (formattedData === undefined && !isLoading);

  // return (
  //   <>
  //     {isUninitialized ? (
  //       <InfoBox
  //         message={<Trans>Your position will appear here.</Trans>}
  //         icon={<Inbox size={56} stroke={theme.deprecated_text1} />}
  //       />
  //     ) : isLoading ? (
  //       <InfoBox
  //         icon={<Loader size="40px" stroke={theme.deprecated_text4} />}
  //       />
  //     ) : error ? (
  //       <InfoBox
  //         message={<Trans>Liquidity data not available.</Trans>}
  //         icon={<CloudOff size={56} stroke={theme.deprecated_text4} />}
  //       />
  //     ) : !formattedData || formattedData.length === 0 || !price ? (
  //       <InfoBox
  //         message={<Trans>There is no liquidity data.</Trans>}
  //         icon={<BarChart2 size={56} stroke={theme.deprecated_text4} />}
  //       />
  //     ) : (
  //       <ChartWrapper>
  //         <Chart
  //           data={{ series: formattedData, current: price }}
  //           dimensions={{ width: 400, height: 200 }}
  //           margins={{ top: 10, right: 2, bottom: 20, left: 0 }}
  //           styles={{
  //             area: {
  //               selection: theme.deprecated_blue1,
  //             },
  //             brush: {
  //               handle: {
  //                 west: saturate(0.1, tokenAColor) ?? theme.deprecated_red1,
  //                 east: saturate(0.1, tokenBColor) ?? theme.deprecated_blue1,
  //               },
  //             },
  //           }}
  //           interactive={interactive}
  //           brushLabels={brushLabelValue}
  //           brushDomain={brushDomain}
  //           onBrushDomainChange={onBrushDomainChangeEnded}
  //           zoomLevels={ZOOM_LEVELS[feeAmount ?? FeeAmount.MEDIUM]}
  //           ticksAtLimit={ticksAtLimit}
  //         />
  //       </ChartWrapper>
  //     )}
  //   </>
  // );

  USDC_WETH_CHART_DATA?.sort((a, b) => a.price0 - b.price0);

  return USDC_WETH_CHART_DATA?.length ? (
    <ChartWrapper>
      <Chart
        data={{ series: USDC_WETH_CHART_DATA, current: price as number }}
        dimensions={{ width: 820, height: 200 }}
        margins={{ bottom: 20, left: 0, right: 2, top: 10 }}
        styles={{
          area: {
            selection: "rgba(0, 67, 55, 0.79)",
          },
          brush: {
            handle: {
              west: "#56E6CC",
              east: "#56E6CC",
            },
          },
        }}
        interactive={true}
        brushLabels={brushLabelValue}
        brushDomain={brushDomain}
        onBrushDomainChange={onBrushDomainChangeEnded}
        zoomLevels={ZOOM_LEVELS[feeAmount ?? FeeAmount.MEDIUM]}
        ticksAtLimit={ticksAtLimit}
      />
    </ChartWrapper>
  ) : (
    <div>Please Provide Data</div>
  );
}
