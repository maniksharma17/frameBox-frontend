import React from 'react';
import MonacoEditor from '@monaco-editor/react';
import useTheme from '../../hooks/useTheme';

interface CodeEditorProps {
  value: string;
  language?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ value, language = 'javascript' }) => {
  const { theme } = useTheme()

  return (
    <section className='border dark:border-gray-700 m-4'>
      <MonacoEditor
        height="calc(90vh - 64px)"
        defaultLanguage={language}
        theme={theme=="dark" ? 'vs-dark' : 'light'}
        value={value}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        }}
      />
    </section>
    
  );
};

export default CodeEditor;