import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { CopyIcon, CheckIcon, ShieldIcon, UsersIcon } from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { generateOrgCode } from '../../utils/helpers';
import { toast } from 'sonner';
interface OrgFormProps {
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
}
export function OrgForm({ onSubmit, isLoading }: OrgFormProps) {
  const { t } = useTranslation('organization');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    memberLimit: '1000',
    approvalType: 'manual'
  });
  const [orgCode] = useState(generateOrgCode());
  const [copied, setCopied] = useState(false);
  const handleChange = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>

  {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      ...formData,
      code: orgCode
    });
  };
  const copyCode = () => {
    navigator.clipboard.writeText(orgCode);
    setCopied(true);
    toast.success(t('codeCopied'));
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-genos">
      <div className="space-y-4">
        <Input
          label={t('orgName')}
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Decentralized Autonomous DAO"
          required
          icon={<ShieldIcon className="w-5 h-5" />} />
        

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-300 mb-1">
            
            {t('description')}
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className="block w-full rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-base transition-colors bg-[#1A1A24]/80 text-white border-[#2A2A34] p-3"
            placeholder={t('descriptionPlaceholder')} />
          
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={t('initialMemberLimit')}
            name="memberLimit"
            type="number"
            value={formData.memberLimit}
            onChange={handleChange}
            min="1"
            icon={<UsersIcon className="w-5 h-5" />} />
          

          <div>
            <label
              htmlFor="approvalType"
              className="block text-sm font-medium text-gray-300 mb-1">
              
              {t('memberApproval')}
            </label>
            <select
              id="approvalType"
              name="approvalType"
              value={formData.approvalType}
              onChange={handleChange}
              className="block w-full rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-base transition-colors bg-[#1A1A24]/80 text-white border-[#2A2A34] p-3">
              
              <option value="manual">{t('manualApproval')}</option>
              <option value="auto">{t('autoApprove')}</option>
            </select>
          </div>
        </div>

        <div className="bg-[#0A0A0F] p-4 rounded-xl border border-[#1A1A24] mt-6">
          <h4 className="text-sm font-medium text-gray-300 mb-2">
            {t('orgInviteCode')}
          </h4>
          <p className="text-xs text-gray-500 mb-3">{t('shareCodeDesc')}</p>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-[#1A1A24] border border-[#2A2A34] rounded-lg px-4 py-2 font-mono text-lg text-center tracking-widest font-bold text-white">
              {orgCode}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={copyCode}
              className="h-[46px]">
              
              {copied ?
              <CheckIcon className="w-5 h-5 text-green-500" /> :

              <CopyIcon className="w-5 h-5" />
              }
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-[#1A1A24]">
        <Button
          type="submit"
          variant="primary"
          fullWidth
          size="lg"
          loading={isLoading}
          disabled={!formData.name}>
          
          {t('createOnBlockchain')}
        </Button>
      </div>
    </form>);

}