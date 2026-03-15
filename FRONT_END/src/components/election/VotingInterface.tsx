import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { CheckCircle2Icon, InfoIcon } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { classNames } from '../../utils/helpers';
interface Candidate {
  id: string;
  name: string;
  description: string;
}
interface VotingInterfaceProps {
  candidates: Candidate[];
  type: 'single' | 'multiple';
  onSubmit: (selectedIds: string[]) => void;
  isLoading: boolean;
}
export function VotingInterface({
  candidates,
  type,
  onSubmit,
  isLoading
}: VotingInterfaceProps) {
  const { t } = useTranslation('election');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const handleSelect = (id: string) => {
    if (type === 'single') {
      setSelectedIds([id]);
    } else {
      if (selectedIds.includes(id)) {
        setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
      } else {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };
  const handleSubmit = () => {
    if (selectedIds.length > 0) {
      onSubmit(selectedIds);
    }
  };
  return (
    <div className="space-y-6 font-genos">
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start">
        <InfoIcon className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-bold text-blue-300">
            {t('votingRules')}
          </h4>
          <p className="text-sm text-blue-400/80 mt-1">
            {type === 'single' ? t('singleVoteRule') : t('multipleVoteRule')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {candidates.map((candidate, index) => {
          const isSelected = selectedIds.includes(candidate.id);
          return (
            <motion.div
              key={candidate.id}
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: index * 0.1
              }}>
              
              <Card
                hover
                onClick={() => handleSelect(candidate.id)}
                className={classNames(
                  'h-full transition-all duration-200 border-2',
                  isSelected ?
                  'border-red-500 bg-red-500/10 ring-4 ring-red-500/20' :
                  'border-[#2A2A34] hover:border-red-500/30 bg-[#1A1A24]'
                )}>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div
                      className={classNames(
                        'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
                        type === 'multiple' ? 'rounded-md' : 'rounded-full',
                        isSelected ?
                        'border-red-500 bg-red-500 text-white' :
                        'border-gray-600'
                      )}>
                      
                      {isSelected && <CheckCircle2Icon className="w-4 h-4" />}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">
                      {candidate.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {candidate.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>);

        })}
      </div>

      <div className="pt-6 border-t border-[#1A1A24] flex justify-end">
        <Button
          variant="primary"
          size="lg"
          onClick={handleSubmit}
          disabled={selectedIds.length === 0 || isLoading}
          loading={isLoading}
          className="w-full sm:w-auto min-w-[200px]">
          
          {t('castVoteSecurely')}
        </Button>
      </div>
    </div>);

}