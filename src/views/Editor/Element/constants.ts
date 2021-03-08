
import { CirclePos } from '../../../types';

export const circleProps: { position: CirclePos; style: object }[] = [
  {
    position: "lt",
    style: {
      cursor: "nwse-resize",
      left: -4,
      top: -4,
    },
  },
  {
    position: "t",
    style: {
      cursor: "ns-resize",
      left: "50%",
      marginLeft: -4,
      top: -4,
    },
  },
  {
    position: "rt",
    style: {
      right: -4,
      top: -4,
      cursor: "nesw-resize",
    },
  },
  {
    position: "l",
    style: {
      cursor: "w-resize",
      left: -4,
      top: "50%",
      marginTop: -4,
    },
  },
  {
    position: "r",
    style: {
      right: -4,
      top: "50%",
      marginTop: -4,
      cursor: "e-resize",
    },
  },
  {
    position: "lb",
    style: {
      cursor: "nesw-resize",
      bottom: -4,
      left: -4,
    },
  },
  {
    position: "b",
    style: {
      cursor: "ns-resize",
      left: "50%",
      marginLeft: -4,
      bottom: -4,
    },
  },
  {
    position: "br",
    style: {
      cursor: "nwse-resize",
      bottom: -4,
      right: -4,
    },
  },
];