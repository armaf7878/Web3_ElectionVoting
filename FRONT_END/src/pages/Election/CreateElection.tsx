import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  CheckCircle2Icon,
  PlusIcon,
  TrashIcon,
  CalendarIcon,
  InfoIcon } from
'lucide-react';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { MOCK_ORGS } from '../../utils/constants';
import { toast } from 'sonner';
export function CreateElection() {
  const { t } = useTranslation(['election', 'common']);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    orgId: '',
    type: 'single',
    startDate: '',
    endDate: ''
  });
  const [candidates, setCandidates] = useState([
  {
    id: '1',
    name: '',
    description: ''
  },
  {
    id: '2',
    name: '',
    description: ''
  }]
  );
  const handleChange = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>

  {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleCandidateChange = (id: string, field: string, value: string) => {
    setCandidates(
      candidates.map((c) =>
      c.id === id ?
      {
        ...c,
        [field]: value
      } :
      c
      )
    );
  };
  const addCandidate = () => {
    setCandidates([
    ...candidates,
    {
      id: Date.now().toString(),
      name: '',
      description: ''
    }]
    );
  };
  const removeCandidate = (id: string) => {
    if (candidates.length > 2) {
      setCandidates(candidates.filter((c) => c.id !== id));
    } else {
      toast.error(t('election:minCandidatesError'));
    }
  };
  const handleSubmit = async () => {
    setIsCreating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2500));
      toast.success(t('election:createSuccess'));
      navigate('/elections');
    } catch (error) {
      toast.error(t('election:createError'));
    } finally {
      setIsCreating(false);
    }
  };
  const steps = [
  {
    id: 1,
    name: t('election:steps.basicInfo')
  },
  {
    id: 2,
    name: t('election:steps.candidates')
  },
  {
    id: 3,
    name: t('election:steps.schedule')
  },
  {
    id: 4,
    name: t('election:steps.review')
  }];

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-genos">
      <div>
        <h1 className="text-3xl font-bold text-white">
          {t('election:createTitle')}
        </h1>
        <p className="text-gray-400 mt-1">{t('election:createSubtitle')}</p>
      </div>

      {/* Progress Stepper */}
      <nav aria-label="Progress" className="mb-8">
        <ol role="list" className="flex items-center">
          {steps.map((s, stepIdx) =>
          <li
            key={s.name}
            className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
            
              <div className="flex items-center">
                <div
                className={`relative flex h-8 w-8 items-center justify-center rounded-full ${step > s.id ? 'bg-red-600 hover:bg-red-700' : step === s.id ? 'border-2 border-red-600 bg-[#111118]' : 'border-2 border-[#2A2A34] bg-[#111118]'}`}>
                
                  {step > s.id ?
                <CheckCircle2Icon
                  className="h-5 w-5 text-white"
                  aria-hidden="true" /> :


                <span
                  className={`text-sm font-bold ${step === s.id ? 'text-red-500' : 'text-gray-500'}`}>
                  
                      {s.id}
                    </span>
                }
                </div>
                <span
                className={`ml-4 text-sm font-medium hidden sm:block ${step >= s.id ? 'text-white' : 'text-gray-500'}`}>
                
                  {s.name}
                </span>
              </div>
              {stepIdx !== steps.length - 1 &&
            <div
              className="absolute top-4 left-0 -ml-px mt-0.5 h-0.5 w-full bg-[#2A2A34]"
              aria-hidden="true">
              
                  <div
                className="h-full bg-red-600 transition-all duration-500 ease-in-out"
                style={{
                  width: step > s.id ? '100%' : '0%'
                }} />
              
                </div>
            }
            </li>
          )}
        </ol>
      </nav>

      <Card className="p-6 md:p-8 border-t-4 border-t-red-500">
        <motion.div
          key={step}
          initial={{
            opacity: 0,
            x: 20
          }}
          animate={{
            opacity: 1,
            x: 0
          }}
          exit={{
            opacity: 0,
            x: -20
          }}
          transition={{
            duration: 0.3
          }}>
          
          {/* Step 1: Basic Info */}
          {step === 1 &&
          <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                {t('election:electionDetails')}
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {t('election:organization')}
                </label>
                <select
                name="orgId"
                value={formData.orgId}
                onChange={handleChange}
                className="block w-full rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-base p-3 border bg-[#1A1A24]/80 border-[#2A2A34] text-white">
                
                  <option value="">{t('election:selectOrg')}</option>
                  {MOCK_ORGS.filter((o) => o.owner === '0x7a3B...4f2E').map(
                  (org) =>
                  <option key={org.id} value={org.id}>
                        {org.name}
                      </option>

                )}
                </select>
              </div>
              <Input
              label={t('election:electionName')}
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Board Member Election 2024"
              required />
            
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {t('election:description')}
                </label>
                <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="block w-full rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-base p-3 border bg-[#1A1A24]/80 border-[#2A2A34] text-white"
                placeholder={t('election:descriptionPlaceholder')} />
              
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {t('election:votingType')}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div
                  className={`border rounded-xl p-4 cursor-pointer transition-colors ${formData.type === 'single' ? 'border-red-500 bg-red-500/10 ring-1 ring-red-500/20' : 'border-[#2A2A34] bg-[#1A1A24] hover:border-red-500/30'}`}
                  onClick={() =>
                  setFormData({
                    ...formData,
                    type: 'single'
                  })
                  }>
                  
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-white">
                        {t('election:singleChoice')}
                      </h4>
                      <div
                      className={`w-4 h-4 rounded-full border ${formData.type === 'single' ? 'border-4 border-red-500' : 'border-gray-600'}`} />
                    
                    </div>
                    <p className="text-sm text-gray-400">
                      {t('election:singleChoiceDesc')}
                    </p>
                  </div>
                  <div
                  className={`border rounded-xl p-4 cursor-pointer transition-colors ${formData.type === 'multiple' ? 'border-red-500 bg-red-500/10 ring-1 ring-red-500/20' : 'border-[#2A2A34] bg-[#1A1A24] hover:border-red-500/30'}`}
                  onClick={() =>
                  setFormData({
                    ...formData,
                    type: 'multiple'
                  })
                  }>
                  
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-white">
                        {t('election:multipleChoice')}
                      </h4>
                      <div
                      className={`w-4 h-4 rounded border ${formData.type === 'multiple' ? 'bg-red-500 border-red-500' : 'border-gray-600'}`} />
                    
                    </div>
                    <p className="text-sm text-gray-400">
                      {t('election:multipleChoiceDesc')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-6 flex justify-end">
                <Button
                variant="primary"
                onClick={() => setStep(2)}
                disabled={!formData.name || !formData.orgId}>
                
                  {t('common:nextStep')}
                </Button>
              </div>
            </div>
          }

          {/* Step 2: Candidates */}
          {step === 2 &&
          <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {t('election:addCandidates')}
                </h2>
                <Button
                variant="outline"
                size="sm"
                onClick={addCandidate}
                leftIcon={<PlusIcon className="w-4 h-4" />}>
                
                  {t('election:addCandidate')}
                </Button>
              </div>
              <div className="space-y-4">
                {candidates.map((candidate, index) =>
              <div
                key={candidate.id}
                className="bg-[#1A1A24] p-4 rounded-xl border border-[#2A2A34] relative">
                
                    <div className="absolute top-4 right-4">
                      <button
                    onClick={() => removeCandidate(candidate.id)}
                    className="text-gray-500 hover:text-red-400 transition-colors"
                    disabled={candidates.length <= 2}>
                    
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                    <h4 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">
                      {t('election:candidateNum', {
                    num: index + 1
                  })}
                    </h4>
                    <div className="space-y-4">
                      <Input
                    label={t('election:nameOption')}
                    value={candidate.name}
                    onChange={(e) =>
                    handleCandidateChange(
                      candidate.id,
                      'name',
                      e.target.value
                    )
                    }
                    placeholder="e.g. Alice Smith or Yes" />
                  
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          {t('election:descriptionOptional')}
                        </label>
                        <input
                      type="text"
                      value={candidate.description}
                      onChange={(e) =>
                      handleCandidateChange(
                        candidate.id,
                        'description',
                        e.target.value
                      )
                      }
                      className="block w-full rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-base p-2 border bg-[#111118] border-[#2A2A34] text-white"
                      placeholder="Brief bio or explanation" />
                    
                      </div>
                    </div>
                  </div>
              )}
              </div>
              <div className="pt-6 flex justify-between">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  {t('common:back')}
                </Button>
                <Button
                variant="primary"
                onClick={() => setStep(3)}
                disabled={candidates.some((c) => !c.name)}>
                
                  {t('common:nextStep')}
                </Button>
              </div>
            </div>
          }

          {/* Step 3: Schedule */}
          {step === 3 &&
          <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                {t('election:votingSchedule')}
              </h2>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start mb-6">
                <InfoIcon className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-blue-300">
                    {t('election:blockchainTime')}
                  </h4>
                  <p className="text-sm text-blue-400/80 mt-1">
                    {t('election:blockchainTimeDesc')}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                label={t('election:startDateTime')}
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                icon={<CalendarIcon className="w-5 h-5" />}
                required />
              
                <Input
                label={t('election:endDateTime')}
                type="datetime-local"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                icon={<CalendarIcon className="w-5 h-5" />}
                required />
              
              </div>
              <div className="pt-6 flex justify-between">
                <Button variant="ghost" onClick={() => setStep(2)}>
                  {t('common:back')}
                </Button>
                <Button
                variant="primary"
                onClick={() => setStep(4)}
                disabled={!formData.startDate || !formData.endDate}>
                
                  {t('election:reviewElection')}
                </Button>
              </div>
            </div>
          }

          {/* Step 4: Review */}
          {step === 4 &&
          <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                {t('election:reviewDeploy')}
              </h2>
              <div className="bg-[#0A0A0F] rounded-xl p-6 border border-[#1A1A24] space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
                    {t('election:basicInfo')}
                  </h3>
                  <p className="text-lg font-bold text-white">
                    {formData.name}
                  </p>
                  <p className="text-gray-400 mt-1">{formData.description}</p>
                  <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#1A1A24] text-gray-300">
                    {formData.type === 'single' ?
                  t('election:singleChoice') :
                  t('election:multipleChoice')}
                  </div>
                </div>
                <div className="border-t border-[#1A1A24] pt-4">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                    {t('election:candidatesCount', {
                    count: candidates.length
                  })}
                  </h3>
                  <ul className="space-y-2">
                    {candidates.map((c, i) =>
                  <li key={i} className="flex items-center text-gray-300">
                        <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs font-bold mr-3">
                          {i + 1}
                        </span>
                        <span className="font-medium">{c.name}</span>
                      </li>
                  )}
                  </ul>
                </div>
                <div className="border-t border-[#1A1A24] pt-4">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
                    {t('election:scheduleLabel')}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        {t('election:starts')}
                      </p>
                      <p className="text-sm font-medium text-white">
                        {new Date(formData.startDate).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        {t('election:ends')}
                      </p>
                      <p className="text-sm font-medium text-white">
                        {new Date(formData.endDate).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-sm text-yellow-300">
                <strong>{t('common:warning')}:</strong>{' '}
                {t('election:deployWarning')}
              </div>
              <div className="pt-6 flex justify-between items-center border-t border-[#1A1A24]">
                <Button
                variant="ghost"
                onClick={() => setStep(3)}
                disabled={isCreating}>
                
                  {t('common:back')}
                </Button>
                <Button
                variant="primary"
                size="lg"
                onClick={handleSubmit}
                loading={isCreating}
                className="shadow-lg shadow-red-500/20">
                
                  {t('election:deployToBlockchain')}
                </Button>
              </div>
            </div>
          }
        </motion.div>
      </Card>
    </div>);

}