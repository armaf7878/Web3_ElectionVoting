import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell } from
'recharts';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { TrophyIcon } from 'lucide-react';
import { Card } from '../common/Card';
import { calculatePercentage } from '../../utils/helpers';
interface ResultData {
  id: string;
  name: string;
  votes: number;
}
interface ResultChartProps {
  data: ResultData[];
  totalVotes: number;
}
export function ResultChart({ data, totalVotes }: ResultChartProps) {
  const { t } = useTranslation('election');
  const sortedData = [...data].sort((a, b) => b.votes - a.votes);
  const winner = sortedData[0];
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = calculatePercentage(data.votes, totalVotes);
      return (
        <div className="bg-[#111118] p-3 border border-[#1A1A24] shadow-lg rounded-lg font-genos">
          <p className="font-bold text-white mb-1">{data.name}</p>
          <p className="text-red-400 font-medium">
            {t('votes', {
              count: data.votes,
              percentage
            })}
          </p>
        </div>);

    }
    return null;
  };
  return (
    <div className="space-y-8 font-genos">
      {/* Winner Announcement */}
      {winner && winner.votes > 0 &&
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
          scale: 0.95
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1
        }}
        transition={{
          type: 'spring',
          bounce: 0.5
        }}>
        
          <div className="bg-gradient-to-r from-yellow-500/20 via-yellow-500/5 to-transparent border border-yellow-500/20 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 opacity-10">
              <TrophyIcon className="w-48 h-48 text-yellow-500" />
            </div>

            <div className="relative z-10 flex items-center">
              <div className="bg-yellow-500/20 p-3 rounded-full mr-4">
                <TrophyIcon className="w-8 h-8 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-wider mb-1">
                  {t('winner')}
                </h3>
                <h2 className="text-2xl font-bold text-white">{winner.name}</h2>
                <p className="text-gray-300 mt-1">
                  {t('wonWith', {
                  votes: winner.votes,
                  percentage: calculatePercentage(winner.votes, totalVotes)
                })}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      }

      {/* Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-white mb-6">
          {t('voteDistribution')}
        </h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedData}
              layout="vertical"
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
              }}>
              
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke="#1A1A24" />
              
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: '#9CA3AF',
                  fontSize: 14,
                  fontFamily: 'Genos'
                }}
                width={150} />
              
              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  fill: '#1A1A24'
                }} />
              
              <Bar dataKey="votes" radius={[0, 4, 4, 0]} barSize={32}>
                {sortedData.map((entry, index) =>
                <Cell
                  key={`cell-${index}`}
                  fill={index === 0 ? '#EF4444' : '#FCA5A5'} />

                )}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Detailed Breakdown */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">
          {t('detailedBreakdown')}
        </h3>
        {sortedData.map((item, index) => {
          const percentage = calculatePercentage(item.votes, totalVotes);
          return (
            <motion.div
              key={item.id}
              initial={{
                opacity: 0,
                x: -20
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              transition={{
                delay: index * 0.1
              }}>
              
              <div className="bg-[#111118] border border-red-500/10 rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-white flex items-center">
                    {index === 0 &&
                    <TrophyIcon className="w-4 h-4 text-yellow-400 mr-2" />
                    }
                    {item.name}
                  </span>
                  <span className="font-medium text-gray-400">
                    {t('votes', {
                      count: item.votes,
                      percentage
                    })}
                  </span>
                </div>
                <div className="w-full bg-[#1A1A24] rounded-full h-2.5 overflow-hidden">
                  <motion.div
                    initial={{
                      width: 0
                    }}
                    animate={{
                      width: `${percentage}%`
                    }}
                    transition={{
                      duration: 1,
                      delay: 0.5
                    }}
                    className={`h-2.5 rounded-full ${index === 0 ? 'bg-red-500' : 'bg-red-300'}`} />
                  
                </div>
              </div>
            </motion.div>);

        })}
      </div>
    </div>);

}