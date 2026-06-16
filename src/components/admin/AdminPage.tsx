import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Users, Settings, ShieldAlert, Crown, Tag, Wrench, Shield, LayoutTemplate, RefreshCw, BarChart3 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import UsersPanel from './UsersPanel';
import RolesPanel from './RolesPanel';
import SectionsPanel from './SectionsPanel';
import SettingsPanel from './SettingsPanel';
import GuildsPanel from './GuildsPanel';
import ConstructorPanel from './ConstructorPanel';
import ParsersPanel from './ParsersPanel';
import AnalyticsPanel from './AnalyticsPanel';

interface AdminPageProps {
  onBack: () => void;
}

type Tab = 'users' | 'roles' | 'sections' | 'settings' | 'guilds' | 'constructor' | 'parsers' | 'analytics';

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'users', label: 'Пользователи', icon: <Users className="w-4 h-4" /> },
  { id: 'analytics', label: 'Статистика', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'constructor', label: 'Конструктор', icon: <LayoutTemplate className="w-4 h-4" /> },
  { id: 'guilds', label: 'Гильдии', icon: <Shield className="w-4 h-4" /> },
  { id: 'roles', label: 'Роли и Звания', icon: <Tag className="w-4 h-4" /> },
  { id: 'sections', label: 'Разделы сайта', icon: <Wrench className="w-4 h-4" /> },
  { id: 'parsers', label: 'Парсеры', icon: <RefreshCw className="w-4 h-4" /> },
  { id: 'settings', label: 'Настройки', icon: <Settings className="w-4 h-4" /> },
];

export default function AdminPage({ onBack }: AdminPageProps) {
  const {
    user, canAccessAdminPanel, ensureWikiLoaded, ensureSupportLoaded, ensureGuideMetaLoaded,
    ensureGuidesLoaded, ensureChatLoaded, ensureAccountsLoaded, ensureGuildsLoaded,
  } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('users');

  useEffect(() => {
    void Promise.all([
      ensureAccountsLoaded(), ensureGuidesLoaded(), ensureChatLoaded(),
      ensureWikiLoaded(), ensureSupportLoaded(), ensureGuideMetaLoaded(),
    ]);
  }, [ensureAccountsLoaded, ensureGuidesLoaded, ensureChatLoaded, ensureWikiLoaded, ensureSupportLoaded, ensureGuideMetaLoaded]);

  useEffect(() => {
    if (activeTab === 'guilds') void ensureGuildsLoaded();
  }, [activeTab, ensureGuildsLoaded]);

  if (!user || !canAccessAdminPanel()) {
    return (
      <div className="min-h-screen pt-20 pb-16 flex items-center justify-center">
        <div className="text-center">
          <ShieldAlert className="w-16 h-16 text-crimson-400 mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-bold text-white mb-2">Доступ запрещён</h2>
          <p className="text-ink-400 mb-6">Эта страница доступна только администраторам.</p>
          <button type="button" onClick={onBack} className="px-6 py-2 bg-gold-400/20 text-gold-400 rounded-lg cursor-pointer hover:bg-gold-400/30">
            Вернуться
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <button type="button" onClick={onBack} className="p-2 rounded-lg text-ink-400 hover:text-gold-400 hover:bg-ink-800/50 cursor-pointer">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
              <Crown className="w-7 h-7 text-purple-400" /> Панель Администратора
            </h1>
            <p className="text-ink-400 text-sm mt-1">Управление сайтом, пользователями и контентом</p>
          </div>
        </div>

        <div className="flex gap-1 mb-6 overflow-x-auto border-b border-ink-700/50 pb-px">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium cursor-pointer whitespace-nowrap transition-colors ${
                activeTab === tab.id ? 'text-gold-400 border-b-2 border-gold-400 -mb-px' : 'text-ink-400 hover:text-ink-200'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'users' && <UsersPanel />}
        {activeTab === 'analytics' && <AnalyticsPanel />}
        {activeTab === 'constructor' && <ConstructorPanel />}
        {activeTab === 'guilds' && <GuildsPanel />}
        {activeTab === 'roles' && <RolesPanel />}
        {activeTab === 'sections' && <SectionsPanel />}
        {activeTab === 'parsers' && <ParsersPanel />}
        {activeTab === 'settings' && <SettingsPanel />}
      </div>
    </div>
  );
}
