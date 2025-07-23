import React, { useState } from 'react';
import { FaCrown, FaFlag, FaHistory, FaUsers } from 'react-icons/fa';
import LoyaltyTiers from './LoyaltyTiers';
import MilestoneDefinitions from './MilestoneDefinitions';
import LoyaltyTransactions from './LoyaltyTransactions';
import LoyaltyAccounts from './LoyaltyAccounts';

type TabType = 'tiers' | 'milestones' | 'transactions' | 'accounts';

const LoyaltyAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('tiers');

  const tabs = [
    {
      id: 'tiers' as TabType,
      name: 'Quản lý Hạng Thành viên',
      icon: FaCrown,
      description: 'Quản lý các mức hạng loyalty tier'
    },
    {
      id: 'milestones' as TabType,
      name: 'Quản lý Mốc Quà Tặng',
      icon: FaFlag,
      description: 'Quản lý các mốc chi tiêu và voucher quà tặng'
    },
    {
      id: 'transactions' as TabType,
      name: 'Lịch sử Giao dịch',
      icon: FaHistory,
      description: 'Xem lịch sử cộng/trừ điểm của tất cả user'
    },
    {
      id: 'accounts' as TabType,
      name: 'Quản lý Tài khoản',
      icon: FaUsers,
      description: 'Quản lý tài khoản loyalty của user'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'tiers':
        return <LoyaltyTiers />;
      case 'milestones':
        return <MilestoneDefinitions />;
      case 'transactions':
        return <LoyaltyTransactions />;
      case 'accounts':
        return <LoyaltyAccounts />;
      default:
        return <LoyaltyTiers />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quản lý Loyalty</h1>
              <p className="mt-1 text-sm text-gray-500">
                Hệ thống quản lý điểm thưởng và hạng thành viên
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    isActive
                      ? 'border-adminprimary text-adminprimary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Description */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-3">
            <p className="text-sm text-gray-600">
              {tabs.find(tab => tab.id === activeTab)?.description}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default LoyaltyAdmin; 