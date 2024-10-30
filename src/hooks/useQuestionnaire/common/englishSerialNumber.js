// a-z

const arr = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'J',
  'K',
  'L',
  'M',
  'N',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z'
];

export default function englishSerialNumber(index) {

  if (index === undefined) {
    return '';
  }

  if ((typeof index) !== 'number') {
    return '';
  }

  if (index < 0 || index >= arr.length) {
    return '';
  }

  return `${arr[index]}. `;
}