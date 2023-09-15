import { UserGender, UserHand } from './enums';
import { objKeys } from './utils';

const plays = [
  {
    title: 'Left-handed',
    value: UserHand.Left,
  },
  {
    title: 'Right-handed',
    value: UserHand.Right,
  },
];
const hand = [
  {
    title: 'Left',
    value: UserHand.Left,
  },
  {
    title: 'Right',
    value: UserHand.Right,
  },
];

const height = [
  {
    title: `120-129cm (3'11"-4'3")`,
    value: 125,
  },
  {
    title: `130-139cm (4'3"-4'7")`,
    value: 135,
  },
  {
    title: `140-149cm (4'7"-4'11")`,
    value: 145,
  },
  {
    title: `150-159cm (4'11"-5'3")`,
    value: 155,
  },
  {
    title: `160-169cm (5'3"-5'7")`,
    value: 165,
  },
  {
    title: `170-179cm (5'7"-5'11")`,
    value: 175,
  },
  {
    title: `180-189cm (5'11"-6'2")`,
    value: 185,
  },
  {
    title: `190-210cm (6'3"-7")`,
    value: 195,
  },
];

const gender = objKeys(UserGender).map(g => ({ title: g, value: UserGender[g] }));

export const idOps = {
  plays,
  hand,
  height,
  gender,
};
