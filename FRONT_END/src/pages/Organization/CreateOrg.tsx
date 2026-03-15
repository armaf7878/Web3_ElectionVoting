import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { BuildingIcon, InfoIcon } from 'lucide-react';
import { OrgForm } from '../../components/organization/OrgForm';
import { Card } from '../../components/common/Card';
import { toast } from 'sonner';
export function CreateOrg() {
  const { t } = useTranslation('organization');
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const handleSubmit = async (data: any) => {
    setIsCreating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success(t('createSuccess'));
      navigate('/organizations');
    } catch (error) {
      toast.error(t('createError'));
    } finally {
      setIsCreating(false);
    }
  };
  return (
    <div className="max-w-5xl mx-auto space-y-8 font-genos">
      <div>
        <h1 className="text-3xl font-bold text-white">{t('createTitle')}</h1>
        <p className="text-gray-400 mt-1">{t('createSubtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}>
            
            <Card className="p-6 md:p-8 border-t-4 border-t-red-500">
              <OrgForm onSubmit={handleSubmit} isLoading={isCreating} />
            </Card>
          </motion.div>
        </div>

        {/* Info Column */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div
            initial={{
              opacity: 0,
              x: 20
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            transition={{
              delay: 0.2
            }}>
            
            <Card className="bg-gradient-to-br from-[#111118] to-[#0A0A0F] text-white border-red-500/10">
              <div className="flex items-center mb-4">
                <div className="bg-red-500/20 p-2 rounded-lg mr-3">
                  <BuildingIcon className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-lg font-bold">{t('smartContractInfo')}</h3>
              </div>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  {t('smartContractBullet1')}
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  {t('smartContractBullet2')}
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  {t('smartContractBullet3')}
                </li>
              </ul>
            </Card>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              x: 20
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            transition={{
              delay: 0.3
            }}>
            
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start">
              <InfoIcon className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-blue-300">
                  {t('whatHappensNext')}
                </h4>
                <p className="text-sm text-blue-400/80 mt-1">
                  {t('whatHappensNextDesc')}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>);

}