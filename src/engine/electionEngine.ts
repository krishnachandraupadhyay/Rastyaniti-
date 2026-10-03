import type { PlayerProfile, PoliticalParty, OppositionParty, Constituency, DemographicSupport } from '../types/game';

export interface ElectionResult {
  constituencyId: string;
  constituencyName: string;
  totalVotesPolled: number;
  turnoutPercent: number;
  playerVotes: number;
  playerVoteShare: number;
  opponentResults: {
    partyId: string;
    partyName: string;
    votes: number;
    voteShare: number;
    color: string;
  }[];
  winnerParty: string;
  winnerName: string;
  isPlayerWon: boolean;
  margin: number;
}

export const calculateElectionOutcome = (
  constituency: Constituency,
  player: PlayerProfile,
  party: PoliticalParty,
  opposition: OppositionParty[],
  support: DemographicSupport
): ElectionResult => {
  // Turnout based on interest and issues (typically 62% - 78%)
  const turnoutPercent = Math.min(85, Math.max(58, 65 + (player.stats.leadership * 0.1) + (Math.random() * 6 - 3)));
  const totalVotesPolled = Math.round((constituency.voterCount * turnoutPercent) / 100);

  // Demographic weightings for this seat
  const urbanWeight = constituency.urbanPercent / 100;
  const ruralWeight = constituency.ruralPercent / 100;

  const demographicScore = 
    (support.youth * 0.25) +
    (support.rural * 0.25 * ruralWeight) +
    (support.urban * 0.25 * urbanWeight) +
    (support.farmers * 0.15) +
    (support.workers * 0.10);

  // Core candidate strength (0-100)
  const candidateStrength = 
    (player.stats.publicTrust * 0.35) +
    (player.stats.leadership * 0.20) +
    (player.stats.communication * 0.15) +
    (party.popularity * 0.20) +
    (demographicScore * 0.10);

  // Local constituency support boost
  const basePlayerShare = Math.min(65, Math.max(18, (constituency.playerSupport * 0.4) + (candidateStrength * 0.4) + (Math.random() * 8 - 4)));

  // Opponents split the remainder
  let remainingShare = 100 - basePlayerShare;
  
  const oppResults = opposition.map((opp, idx) => {
    // Relative strength weight
    const rawOppShare = (opp.popularity * 0.6) + (Math.random() * 10);
    return { opp, raw: rawOppShare, idx };
  });

  const totalRaw = oppResults.reduce((acc, curr) => acc + curr.raw, 0);

  const finalOppResults = oppResults.map((item) => {
    const share = Math.max(5, (item.raw / totalRaw) * remainingShare);
    const votes = Math.round((totalVotesPolled * share) / 100);
    return {
      partyId: item.opp.id,
      partyName: item.opp.name,
      votes,
      voteShare: Number(share.toFixed(1)),
      color: item.opp.color,
    };
  });

  const playerVotes = Math.round((totalVotesPolled * basePlayerShare) / 100);
  const playerVoteShare = Number(basePlayerShare.toFixed(1));

  // Determine winner
  const allCandidates = [
    { name: player.name, party: party.name, votes: playerVotes, isPlayer: true },
    ...finalOppResults.map(o => ({ name: o.partyName, party: o.partyName, votes: o.votes, isPlayer: false }))
  ].sort((a, b) => b.votes - a.votes);

  const winner = allCandidates[0];
  const runnerUp = allCandidates[1];
  const margin = winner.votes - runnerUp.votes;

  return {
    constituencyId: constituency.id,
    constituencyName: constituency.name,
    totalVotesPolled,
    turnoutPercent: Number(turnoutPercent.toFixed(1)),
    playerVotes,
    playerVoteShare,
    opponentResults: finalOppResults,
    winnerParty: winner.party,
    winnerName: winner.name,
    isPlayerWon: winner.isPlayer,
    margin,
  };
};
