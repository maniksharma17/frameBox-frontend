import React, { useEffect } from 'react';
import { useResizable } from '../../hooks/useResizable';
import ResizablePanel from './ResizablePanel';

interface EditorLayoutProps {
  stepsPanel: React.ReactNode;
  filesPanel: React.ReactNode;
  editorPanel: React.ReactNode;
  inputPanel: React.ReactNode;
}

const EditorLayout: React.FC<EditorLayoutProps> = ({ stepsPanel, filesPanel, editorPanel, inputPanel }) => {
  const {
    width: stepsWidth,
    isResizing: isResizingSteps,
    startResizing: startResizingSteps,
    stopResizing: stopResizingSteps,
    resize: resizeSteps,
  } = useResizable(400, 300, 500); // Adjusted initial and min width for steps panel

  const {
    width: filesWidth,
    isResizing: isResizingFiles,
    startResizing: startResizingFiles,
    stopResizing: stopResizingFiles,
    resize: resizeFiles,
  } = useResizable(300, 200, 350); // Adjusted max width for files panel

  useEffect(() => {
    if (isResizingSteps || isResizingFiles) {
      document.addEventListener('mouseup', isResizingSteps ? stopResizingSteps : stopResizingFiles);
      return () => {
        document.removeEventListener('mouseup', isResizingSteps ? stopResizingSteps : stopResizingFiles);
      };
    }
  }, [isResizingSteps, isResizingFiles, stopResizingSteps, stopResizingFiles]);

  return (
    <div 
      className="flex-1 flex overflow-hidden"
      onMouseMove={(e) => {
        if (isResizingSteps) resizeSteps(e);
        if (isResizingFiles) resizeFiles(e);
      }}
    >
      <ResizablePanel
        width={stepsWidth}
        onResize={resizeSteps}
        onResizeStart={startResizingSteps}
        className="hidden md:block"
      >
        {inputPanel}
        {stepsPanel}
      </ResizablePanel>

      <ResizablePanel
        width={filesWidth}
        onResize={resizeFiles}
        onResizeStart={startResizingFiles}
      >
        {filesPanel}
      </ResizablePanel>

      <div className="flex-1 min-w-0 flex flex-col">
        {editorPanel}
      </div>
    </div>
  );
};

export default EditorLayout;