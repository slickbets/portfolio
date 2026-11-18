// Rows copied from the All Predictions table in src/content/projects/slick-bets/game-details.png.
// "Win %" is the picked team's win probability from that table (Home Win% or Away Win%).
export interface Prediction {
  game: string;
  pick: string;
  homeWin: string;
  awayWin: string;
  spread: string;
  homeFair: string;
  awayFair: string;
  homeRest: string;
  awayRest: string;
}

export const predictions: Prediction[] = [
  { game: 'DAL @ BOS', pick: 'BOS', homeWin: '70.7%', awayWin: '29.3%', spread: 'BOS -15.6', homeFair: '-241', awayFair: '+241', homeRest: '1d', awayRest: '0d B2B' },
  { game: 'MIA @ CHA', pick: 'CHA', homeWin: '58.3%', awayWin: '41.7%', spread: 'CHA -5.0', homeFair: '-139', awayFair: '+139', homeRest: '1d', awayRest: '0d B2B' },
  { game: 'POR @ HOU', pick: 'HOU', homeWin: '59.5%', awayWin: '40.5%', spread: 'HOU -6.0', homeFair: '-146', awayFair: '+146', homeRest: '0d B2B', awayRest: '1d' },
  { game: 'NYK @ DEN', pick: 'NYK', homeWin: '42.6%', awayWin: '57.4%', spread: 'NYK -7.2', homeFair: '+134', awayFair: '-134', homeRest: '0d B2B', awayRest: '1d' },
  { game: 'NOP @ PHX', pick: 'PHX', homeWin: '57.6%', awayWin: '42.4%', spread: 'PHX -4.5', homeFair: '-135', awayFair: '+135', homeRest: '0d B2B', awayRest: '1d' },
  { game: 'LAC @ SAS', pick: 'SAS', homeWin: '59.1%', awayWin: '40.9%', spread: 'SAS -5.7', homeFair: '-144', awayFair: '+144', homeRest: '0d B2B', awayRest: '1d' },
  { game: 'IND @ LAL', pick: 'LAL', homeWin: '63.8%', awayWin: '36.2%', spread: 'LAL -9.6', homeFair: '-176', awayFair: '+176', homeRest: '0d B2B', awayRest: '1d' },
];
