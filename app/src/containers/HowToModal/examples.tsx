import Card from '../Panel/Card';
import { Color } from '../../types/color';

// The four following cards could belong to a theoretical game
export const Card1 = () => (
  <Card
    moveDetail={{ uciMove: 'example-g3d6', curRank: 1, evalResult: { engineEval: '#2', engineOverallRank: 1 } }}
    sanMove="Qd6"
    turnPlayer={Color.White}
    revealed={true}
    correctRanks={[1, 2]}
    onClick={() => {}}
    isPreviewed={false}
  />
);

export const Card2 = () => (
  <Card
    moveDetail={{ uciMove: 'example-b4a6', curRank: 2, evalResult: { engineEval: '#2', engineOverallRank: 2 } }}
    sanMove="Na6"
    turnPlayer={Color.White}
    revealed={true}
    correctRanks={[1, 2]}
    onClick={() => {}}
    isPreviewed={false}
  />
);

export const Card3 = () => (
  <Card
    moveDetail={{ uciMove: 'example-g2g4', curRank: 4, evalResult: { engineEval: '+264 ', engineOverallRank: 3 } }}
    sanMove="g4"
    turnPlayer={Color.White}
    revealed={true}
    correctRanks={[3]}
    onClick={() => {}}
    isPreviewed={false}
  />
);

export const Card4 = () => (
  <Card
    moveDetail={{ uciMove: 'example-c4b4', curRank: 3, evalResult: { engineEval: '-34', engineOverallRank: 4 } }}
    sanMove="Rb4"
    turnPlayer={Color.White}
    revealed={true}
    correctRanks={[4]}
    onClick={() => {}}
    isPreviewed={false}
  />
);
