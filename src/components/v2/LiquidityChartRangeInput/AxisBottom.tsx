import {
  Axis as d3Axis,
  axisBottom,
  NumberValue,
  ScaleLinear,
  select,
} from "d3";
import React, { useMemo } from "react";
import styled from "styled-components/macro";

const StyledGroup = styled.g`
  line {
    display: none;
    /* fill: "#D9D9D9"; */
  }

  text {
    color: #96969a;
    transform: translateY(5px);
  }
`;

const Axis = ({ axisGenerator }: { axisGenerator: d3Axis<NumberValue> }) => {
  const axisRef = (axis: SVGGElement) => {
    axisGenerator.tickSize(0);
    axis &&
      select(axis)
        .call(axisGenerator)
        .call((g) =>
          g.select(".domain").attr("stroke", "#D9D9D9").attr("stroke-width", 2)
        );
  };

  return <g ref={axisRef} />;
};

export const AxisBottom = ({
  xScale,
  innerHeight,
  offset = 0,
}: {
  xScale: ScaleLinear<number, number>;
  innerHeight: number;
  offset?: number;
}) =>
  useMemo(
    () => (
      <StyledGroup transform={`translate(0, ${innerHeight + offset})`}>
        <Axis axisGenerator={axisBottom(xScale).ticks(6)} />
      </StyledGroup>
    ),
    [innerHeight, offset, xScale]
  );
