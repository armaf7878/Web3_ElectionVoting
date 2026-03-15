export const APP_NAME = 'VoteChain';

export type ElectionStatus = 'upcoming' | 'active' | 'ended';

export const MOCK_USER = {
  id: 'usr_1',
  name: 'Alex Nakamoto',
  email: 'alex@votechain.app',
  avatar: 'https://i.pravatar.cc/150?u=alex',
  joinedAt: '2023-09-15T10:00:00Z'
};

export const MOCK_ORGS = [
{
  id: 'org_1',
  name: 'Ethereum Foundation',
  description: 'Supporting the Ethereum ecosystem and community.',
  code: 'ETHFND',
  memberCount: 12500,
  activeElections: 2,
  owner: '0x7a3B...4f2E',
  joined: true
},
{
  id: 'org_2',
  name: 'Decentralized Autonomous DAO',
  description: 'A community-driven investment fund.',
  code: 'DADAO1',
  memberCount: 3420,
  activeElections: 0,
  owner: '0x1122...3344',
  joined: true
},
{
  id: 'org_3',
  name: 'Web3 Builders Guild',
  description: 'Network of developers building the decentralized web.',
  code: 'W3BG00',
  memberCount: 890,
  activeElections: 1,
  owner: '0x9988...7766',
  joined: false
}];


export const MOCK_ELECTIONS = [
{
  id: 'el_1',
  orgId: 'org_1',
  orgName: 'Ethereum Foundation',
  name: 'Q4 Protocol Upgrade Proposal',
  description: 'Vote on the proposed EIPs for the upcoming network upgrade.',
  status: 'active' as ElectionStatus,
  type: 'single',
  startDate: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
  endDate: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
  participantCount: 4521,
  totalEligible: 12500
},
{
  id: 'el_2',
  orgId: 'org_1',
  orgName: 'Ethereum Foundation',
  name: 'Community Grants Allocation',
  description: 'Select which projects should receive Q3 funding.',
  status: 'upcoming' as ElectionStatus,
  type: 'multiple',
  startDate: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
  endDate: new Date(Date.now() + 86400000 * 12).toISOString(),
  participantCount: 0,
  totalEligible: 12500
},
{
  id: 'el_3',
  orgId: 'org_2',
  orgName: 'Decentralized Autonomous DAO',
  name: 'DeFi Protocol Investment',
  description: 'Should we allocate 500 ETH to the new lending protocol?',
  status: 'ended' as ElectionStatus,
  type: 'single',
  startDate: new Date(Date.now() - 86400000 * 10).toISOString(),
  endDate: new Date(Date.now() - 86400000 * 3).toISOString(),
  participantCount: 2840,
  totalEligible: 3420
}];


export const MOCK_CANDIDATES = [
{
  id: 'cand_1',
  name: 'Yes, Implement EIP-4844',
  description: 'Proto-danksharding to reduce rollup fees.',
  votes: 3102
},
{
  id: 'cand_2',
  name: 'No, Delay to next upgrade',
  description: 'Needs more testing on testnets.',
  votes: 1419
}];


export const MOCK_ACTIVITIES = [
{
  id: 'act_1',
  type: 'vote',
  description: 'You voted in "DeFi Protocol Investment"',
  timestamp: new Date(Date.now() - 86400000 * 4).toISOString()
},
{
  id: 'act_2',
  type: 'join',
  description: 'You joined "Ethereum Foundation"',
  timestamp: new Date(Date.now() - 86400000 * 15).toISOString()
},
{
  id: 'act_3',
  type: 'create',
  description: 'You created organization "Web3 Builders Guild"',
  timestamp: new Date(Date.now() - 86400000 * 30).toISOString()
}];


export const NAV_LINKS = [
{ label: 'Dashboard', path: '/dashboard' },
{ label: 'Organizations', path: '/organizations' },
{ label: 'Elections', path: '/elections' }];