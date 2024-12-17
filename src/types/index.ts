export enum StepType {
  CreateFile,
  CreateFolder,
  EditFile,
  RunScript,
  RemoveFile
}

export interface Step {
  id: number,
  title: string,
  description: string,
  type: StepType,
  status: 'pending'|'in-progress'|'completed',
  code?: string,
  path?: string
}

export interface FileStructure {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileStructure[];
  path?: string
}

export interface ThemeState {
  isDark: boolean;
  toggle: () => void;
}