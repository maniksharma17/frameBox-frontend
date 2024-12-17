import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FileCode } from 'lucide-react';
import { FileStructure } from '../types';

interface FileExplorerProps {
  files: FileStructure[];
  onFileSelect: (content: string) => void;
}

const FileExplorerItem: React.FC<{ item: FileStructure; onFileSelect: (content: string) => void }> = ({
  item,
  onFileSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (item.type === 'folder') {
      setIsOpen(!isOpen);
    } else if (item.content) {
      onFileSelect(item.content);
    }
  };

  return (
    <div className="ml-2">
      <div
        className="flex items-center gap-2 py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 overflow-x-scroll cursor-pointer rounded"
        onClick={handleClick}
      >
        {item.type === 'folder' ? (
          <>
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            <Folder size={16} className="text-blue-500" />
          </>
        ) : (
          <FileCode size={16} className="ml-5 text-gray-500" />
        )}
        <span className="truncate">{item.name}</span>
      </div>
      {item.type === 'folder' && isOpen && item.children && (
        <div className="ml-1">
          {item.children.map((child, index) => (
            <FileExplorerItem key={index} item={child} onFileSelect={onFileSelect} />
          ))}
        </div>
      )}
    </div>
  );
};

const FileExplorer: React.FC<FileExplorerProps> = ({ files, onFileSelect }) => {
  return (
    <div className="h-auto overflow-y-auto bg-gray-50 dark:bg-[#1A1A1D] rounded-lg m-2 border dark:border-gray-700">
      <div className='border-b dark:border-gray-700'>
        <h2 className="text-lg font-semibold p-2">Files</h2>
      </div>
      <div className="p-4">
        <div className="space-y-1">
          {files.map((item, index) => (
            <FileExplorerItem key={index} item={item} onFileSelect={onFileSelect} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileExplorer;