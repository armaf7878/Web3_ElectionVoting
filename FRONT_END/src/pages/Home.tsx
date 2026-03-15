import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  ShieldCheckIcon,
  GlobeIcon,
  ZapIcon,
  LinkIcon,
  ArrowRightIcon } from
'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { APP_NAME } from '../utils/constants';
import { AnimatedBackground } from '../components/common/AnimatedBackground';
export function Home() {
  const { t } = useTranslation('common');
  const features = [
  {
    title: t('home.feature1Title'),
    description: t('home.feature1Desc'),
    icon: <ShieldCheckIcon className="w-8 h-8 text-red-500" />
  },
  {
    title: t('home.feature2Title'),
    description: t('home.feature2Desc'),
    icon: <GlobeIcon className="w-8 h-8 text-red-500" />
  },
  {
    title: t('home.feature3Title'),
    description: t('home.feature3Desc'),
    icon: <ZapIcon className="w-8 h-8 text-red-500" />
  }];

  const steps = [
  {
    num: '01',
    title: t('home.step1Title'),
    desc: t('home.step1Desc')
  },
  {
    num: '02',
    title: t('home.step2Title'),
    desc: t('home.step2Desc')
  },
  {
    num: '03',
    title: t('home.step3Title'),
    desc: t('home.step3Desc')
  }];

  return (
    <div className="min-h-screen bg-[#0A0A0F] font-genos overflow-hidden relative">
      <AnimatedBackground />
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{
              opacity: 0,
              y: 30
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.8
            }}>
            
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-500/10 text-red-400 font-semibold mb-8 border border-red-500/20 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-red-500 mr-2 animate-pulse" />
              {t('home.badge')}
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6">
              {t('home.heroTitle1')} <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400">
                {t('home.heroTitle2')}
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-xl text-gray-400 mx-auto mb-10">
              {t('home.heroSubtitle', {
                appName: t('appName')
              })}
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto text-lg px-8 py-4 shadow-xl shadow-red-500/20">
                  
                  {t('getStarted')}
                  <ArrowRightIcon className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-lg px-8 py-4 bg-[#111118]/50 backdrop-blur-sm">
                  
                  {t('home.connectWallet')}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#111118] relative z-10 border-y border-red-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('home.whyChoose', {
                appName: t('appName')
              })}
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              {t('home.whyChooseSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) =>
            <motion.div
              key={feature.title}
              initial={{
                opacity: 0,
                y: 20
              }}
              whileInView={{
                opacity: 1,
                y: 0
              }}
              viewport={{
                once: true
              }}
              transition={{
                delay: index * 0.2
              }}>
              
                <Card
                hover
                className="h-full border-t-4 border-t-red-500 pt-8 bg-[#1A1A24]/50">
                
                  <div className="bg-red-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-[#0A0A0F] text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(#EF4444 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }} />
        

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('home.howItWorks')}
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              {t('home.howItWorksSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-red-500/20 via-red-500 to-red-500/20" />

            {steps.map((step, index) =>
            <motion.div
              key={step.num}
              initial={{
                opacity: 0,
                scale: 0.9
              }}
              whileInView={{
                opacity: 1,
                scale: 1
              }}
              viewport={{
                once: true
              }}
              transition={{
                delay: index * 0.2
              }}
              className="relative text-center">
              
                <div className="w-24 h-24 mx-auto bg-[#111118] border-4 border-[#1A1A24] rounded-full flex items-center justify-center relative z-10 shadow-xl shadow-red-500/10 mb-6 group hover:border-red-500 transition-colors duration-300">
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-red-400 to-red-600">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-400">{step.desc}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[#111118] border-b border-red-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-[#1A1A24]">
            <motion.div
              initial={{
                opacity: 0
              }}
              whileInView={{
                opacity: 1
              }}
              viewport={{
                once: true
              }}
              className="py-6">
              
              <div className="text-5xl font-black text-red-500 mb-2">1.2M+</div>
              <div className="text-gray-500 font-medium uppercase tracking-wider text-sm">
                {t('stats.votesCast')}
              </div>
            </motion.div>
            <motion.div
              initial={{
                opacity: 0
              }}
              whileInView={{
                opacity: 1
              }}
              viewport={{
                once: true
              }}
              transition={{
                delay: 0.2
              }}
              className="py-6">
              
              <div className="text-5xl font-black text-red-500 mb-2">
                5,400+
              </div>
              <div className="text-gray-500 font-medium uppercase tracking-wider text-sm">
                {t('stats.organizations')}
              </div>
            </motion.div>
            <motion.div
              initial={{
                opacity: 0
              }}
              whileInView={{
                opacity: 1
              }}
              viewport={{
                once: true
              }}
              transition={{
                delay: 0.4
              }}
              className="py-6">
              
              <div className="text-5xl font-black text-red-500 mb-2">
                12,000+
              </div>
              <div className="text-gray-500 font-medium uppercase tracking-wider text-sm">
                {t('stats.electionsHosted')}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-red-500/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 via-red-500 to-red-600" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6">
            {t('home.ctaTitle')}
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            {t('home.ctaSubtitle', {
              appName: t('appName')
            })}
          </p>
          <Link to="/register">
            <Button
              variant="primary"
              size="lg"
              className="text-lg px-10 py-4 shadow-xl shadow-red-500/20">
              
              {t('home.ctaButton')}
            </Button>
          </Link>
        </div>
      </section>

      {/* Simple Footer for Home Page */}
      <footer className="bg-[#0A0A0F] border-t border-red-500/10 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="bg-red-500 p-1.5 rounded-lg">
              <LinkIcon className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              {APP_NAME}
            </span>
          </div>
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} {APP_NAME}.{' '}
            {t('footer.allRightsReserved')}
          </p>
        </div>
      </footer>
    </div>);

}