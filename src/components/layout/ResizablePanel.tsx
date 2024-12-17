import React, { MouseEvent } from 'react';

interface ResizablePanelProps {
  width: number;
  onResize: (e: MouseEvent) => void;
  onResizeStart: (e: MouseEvent) => void;
  children: React.ReactNode;
  className?: string;
}

const ResizablePanel: React.FC<ResizablePanelProps> = ({
  width,
  onResize,
  onResizeStart,
  children,
  className = '',
}) => {
  return (
    <div
      className={`relative h-full ${className}`}
      style={{ width: `${width}px` }}
      onMouseMove={onResize}
    >
      {children}
      <div
        className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-gray-200 dark:bg-gray-700 hover:bg-blue-500 dark:hover:bg-blue-600"
        onMouseDown={onResizeStart}
      />
    </div>
  );
};

export default ResizablePanel;