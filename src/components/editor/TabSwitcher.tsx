import React from 'react';
import { Code2, Eye } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

interface TabSwitcherProps {
  activeTab: 'code' | 'preview';
  onTabChange: (tab: 'code' | 'preview') => void;
}

const TabSwitcher: React.FC<TabSwitcherProps> = ({ activeTab, onTabChange }) => {
  const { toast } = useToast()
  return (
    <div className="flex border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => onTabChange('code')}
        className={`px-4 py-2 flex text-sm items-center gap-2 ${
          activeTab === 'code'
            ? 'bg-blue-500 text-white'
            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
      >
        <Code2 size={16} />
        Code
      </button>
      <button
        onClick={() => {
          onTabChange('preview')
          toast({
            title: "Preview Mode",
            description: "The preview will be available shortly within 60-120 seconds."
          })
        }}
        className={`px-4 py-2 flex text-sm items-center gap-2 ${
          activeTab === 'preview'
            ? 'bg-blue-500 text-white'
            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
      >
        <Eye size={16} />
        Preview
      </button>
    </div>
  );
};

export default TabSwitcher;