const ageGroups = [
  {
    title: '7-9',
    value: '7-9',
  },
  {
    title: '10-12',
    value: '10-12',
  },
  {
    title: '13-17',
    value: '13-17',
  },
  {
    title: '18-25',
    value: '18-25',
  },
  {
    title: '26-35',
    value: '26-35',
  },
  {
    title: '36-45',
    value: '36-45',
  },
  {
    title: '46-55',
    value: '46-55',
  },
  {
    title: '56-65',
    value: '56-65',
  },
  {
    title: '66+',
    value: '66+',
  },
];

const planOftenOps = [
  {
    title: '5 times a week',
    value: '5 times a week',
  },
  {
    title: '3 times a week',
    value: '3 times a week',
  },
  {
    title: 'At least once a week',
    value: 'At least once a week',
  },
  {
    title: 'At least once a month',
    value: 'At least once a month',
  },
  {
    title: 'Couple of times a year',
    value: 'Couple of times a year',
  },
];
const cognitiveOftenOps = planOftenOps.concat({
  title: 'Not at all',
  value: 'Not at all',
});

const yesNoOps = [
  {
    title: 'Yes',
    value: 'YES',
  },
  {
    title: 'No',
    value: 'NO',
  },
];

const saOftenOps = [
  {
    title: '5 times a week',
    value: '5 times a week',
  },
  {
    title: '3 times a week',
    value: '3 times a week',
  },
  {
    title: 'At least once a week',
    value: 'At least once a week',
  },
  {
    title: 'Several times a month',
    value: 'Several times a month',
  },
  {
    title: 'At least once a month',
    value: 'At least once a month',
  },
];

const monthOps = [
  {
    title: 'January',
    value: 'January',
  },
  {
    title: 'February',
    value: 'February',
  },
  {
    title: 'March',
    value: 'March',
  },
  {
    title: 'April',
    value: 'April',
  },
  {
    title: 'May',
    value: 'May',
  },
  {
    title: 'June',
    value: 'June',
  },
  {
    title: 'July',
    value: 'July',
  },
  {
    title: 'August',
    value: 'August',
  },
  {
    title: 'September',
    value: 'September',
  },
  {
    title: 'October',
    value: 'October',
  },
  {
    title: 'November',
    value: 'November',
  },
  {
    title: 'December',
    value: 'December',
  },
];

const whoIsUserOps = [
  {
    title: 'Myself - I am the player',
    value: 'Myself - I am the player',
  },
  {
    title: 'Someone else',
    value: 'Someone else',
  },
];

export const webFeedback = {
  ageGroups,
  yesNoOps,
  cognitiveOftenOps,
  saOftenOps,
  monthOps,
  whoIsUserOps,
};
