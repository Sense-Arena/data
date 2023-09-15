import { Backhand, HockeyPosition, HockeyStick, Shoot } from './enums';

const backhand = [
  {
    title: 'One-handed',
    value: Backhand.One,
  },
  {
    title: 'Two-handed',
    value: Backhand.Two,
  },
];

const shoots = [
  {
    title: 'Left',
    value: Shoot.Left,
  },
  {
    title: 'Right',
    value: Shoot.Right,
  },
];

const positions = [
  {
    title: 'Defenseman',
    value: HockeyPosition.Defenseman,
  },
  {
    title: 'Center',
    value: HockeyPosition.Center,
  },
  {
    title: 'Goalie',
    value: HockeyPosition.Goalie,
  },
  {
    title: 'Left Wing',
    value: HockeyPosition.LeftWing,
  },
  {
    title: 'Right Wing',
    value: HockeyPosition.RightWing,
  },
];

const sticks = [
  {
    title: 'Initial',
    value: HockeyStick.Initial,
  },
  {
    title: 'Controllers',
    value: HockeyStick.Controllers,
  },
  {
    title: 'Haptic',
    value: HockeyStick.Haptic,
  },
  {
    title: 'Non-Haptic',
    value: HockeyStick.NonHaptic,
  },
  {
    title: 'None',
    value: HockeyStick.None,
  },
];

export const idHockeyOptions = {
  shoots,
  backhand,
  positions,
  sticks,
};
