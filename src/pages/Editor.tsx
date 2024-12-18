import React, { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import EditorLayout from '../components/layout/EditorLayout';
import TabSwitcher from '../components/editor/TabSwitcher';
import CodeEditor from '../components/editor/CodeEditor';
import Preview from '../components/editor/Preview';
import FileExplorer from '../components/FileExplorer';
import Steps from '../components/Steps';
import { FileStructure, Step, StepType } from '../types';
import axios from "axios"
import { parseXmlAndGenerateSteps, parseXmlToJsonSteps } from '../steps';
import { useLocation } from 'react-router-dom';
import { useWebContainer } from '../hooks/useContainer';
import { FileSystemTree, WebContainer } from '@webcontainer/api';
import { ChevronRight } from 'lucide-react';
import { Download } from 'lucide-react';
import Spinner from '@/components/Spinner';
import JSZip from "jszip";
import { saveAs } from "file-saver";

const EditorPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [currentFile, setCurrentFile] = useState('');
  
  // webcontainer instance
  const webcontainer = useWebContainer()

  const [steps, setSteps] = useState<Step[]>([])
  const [stepsPrompt, setStepsPrompt] = useState("")

  const [files, setFiles] = useState<FileStructure[]>([])

  const location = useLocation();
  const prompt = location.state.prompt;
  const [userPrompt, setUserPrompt] = useState("")
  const [backendMessages, setBackendMessages] = useState<{
    role: "user"|"assistant", 
    content: string
  }[]>([])

  const [isUserInputOpen, setIsUserInputOpen] = useState(false)

  async function init() {
    try{
      const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/template`, {
        prompt
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      setStepsPrompt(response.data.uiPrompt)
      const {prompts} = response.data

      setBackendMessages([...prompts, prompt].map(prompt => ({
        role: "user",
        content: prompt
      })))

      const codeResponse = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/chat`, {
        messages: [...prompts, prompt].map((prompt) => ({
          role: "user",
          content: prompt
        }))
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      setSteps((steps) => ([...steps, ...parseXmlAndGenerateSteps(codeResponse.data, steps).map(x => ({
        ...x,
        status: "pending" as const
      }))]))

      setBackendMessages((x) => [...x, {
        role: "assistant",
        content: codeResponse.data
      }])

      
    } catch(error){
      console.error(error)
    } finally{
      setIsUserInputOpen(true)
    }
  }

  useEffect(()=>{
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) 

  useEffect(() => {
    const createFileSystemTree = (files: FileStructure[]): FileSystemTree => {
      return files.reduce<FileSystemTree>((acc, file) => {
        if (file.type === 'file') {
          acc[file.name] = {
            file: {
              contents: file.content || ''
            }
          };
        } else if (file.type === 'folder') {
          acc[file.name] = {
            directory: file.children 
              ? createFileSystemTree(file.children)
              : {}
          };
        }
        return acc;
      }, {});
    };
    
    const mountFiles = async () => {
      if (files && files.length > 0) {
        const fileSystemTree = createFileSystemTree(files);
        console.log(fileSystemTree)
        await webcontainer?.mount(fileSystemTree);
      }
    };
  
    mountFiles();
  }, [webcontainer, files]);


  useEffect(()=>{
    const steps = parseXmlToJsonSteps(stepsPrompt)
    setSteps(steps)
      
  }, [stepsPrompt])

  useEffect(() => {
    let originalFiles = [...files];
    let updateHappened = false;
    steps.filter(({status}) => status === "pending").map(step => {
      updateHappened = true;
      if (step?.type === StepType.CreateFile) {
        let parsedPath = step.path?.split("/") ?? []; // ["src", "components", "App.tsx"]
        let currentFileStructure = [...originalFiles]; // {}
        const finalAnswerRef = currentFileStructure;

        let currentFolder = ""
        while(parsedPath.length) {
          currentFolder =  `${currentFolder}/${parsedPath[0]}`;
          const currentFolderName = parsedPath[0];
          parsedPath = parsedPath.slice(1);
  
          if (!parsedPath.length) {
            // final file
            const file = currentFileStructure.find(x => x.path === currentFolder)
            if (!file) {
              currentFileStructure.push({
                name: currentFolderName,
                type: 'file',
                path: currentFolder,
                content: step.code
              })
            } else {
              file.content = step.code;
            }
          } else {
            /// in a folder
            const folder = currentFileStructure.find(x => x.path === currentFolder)
            if (!folder) {
              // create the folder
              currentFileStructure.push({
                name: currentFolderName,
                type: 'folder',
                path: currentFolder,
                children: []
              })
            }
            
            // did not use folder as it might be undefined
            currentFileStructure = currentFileStructure.find(x => x.path === currentFolder)!.children!;
          }
        }
        originalFiles = finalAnswerRef;
      }

    })

    if (updateHappened) {

      setFiles(originalFiles)
      setSteps(steps => steps.map((s: Step) => {
        return {
          ...s,
          status: "completed"
        }
        
      }))
    }
  }, [steps, files]);

  const downloadZip = async () => {
    const zip = new JSZip();

    const addFilesToZip = (items: FileStructure[], folder: JSZip) => {
      items.forEach((item) => {
        if (item.type === 'file' && item.content !== undefined) {
          folder.file(item.name, item.content);
        } else if (item.type === 'folder' && item.children) {
          const subFolder = folder.folder(item.name);
          if (subFolder) addFilesToZip(item.children, subFolder);
        }
      });
    };

    addFilesToZip(files, zip);

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, 'frameBox-project.zip');
  };

  const editorPanel = (
    <div className="h-full flex flex-col">
      <div className="h-12 flex flex-row gap-2 justify-between items-center px-4 mt-2 border-gray-200 dark:border-gray-700">
        <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />
        <button onClick={downloadZip} className='border hover:scale-105 transition duration-300 hover:bg-gray-700 hover:text-white p-2 rounded-lg text-sm border-gray-400 dark:border-gray-700'>
          <div className='flex flex-row items-center gap-2'>
            <Download size={16}/>
            <p>Download ZIP</p>
          </div>
        </button>
      </div>
      <div className="flex-1">
        {activeTab === 'code' ? (
          <CodeEditor value={currentFile} />
        ) : (
          <Preview webcontainer={webcontainer as WebContainer} />
        )}
      </div>
    </div>
  );
    const inputPanel = isUserInputOpen? (
      <div className="w-auto m-2 flex flex-col gap-2 mb-4">
        <div className='flex flex-row gap-2 text-xs items-center p-2'>
          <ChevronRight size={16}/>
          <p><code>{prompt.split('.')[0]}</code></p>
        </div>
        <div className='flex flex-row bg-gradient-to-r from-indigo-400 to-blue-100 p-1 dark:from-gray-400 dark:to-gray-600 rounded-lg'>
          <textarea
              value={userPrompt}
              onChange={(e)=>{
                setUserPrompt(e.target.value)
              }}
              placeholder="Want to make changes? Tell us!"
              rows={2}
              className="w-full rounded-lg bg-gray-50 dark:bg-[#1A1A1D] text-gray-800 dark:text-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition duration-300"
            />
            <button
            className="w-fit text-gray-700 font-semibold rounded-lg py-1 transition-all duration-400 transform "
            onClick={async ()=>{
              try{
                setIsUserInputOpen(false)
                const codeResponse = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/chat`, {
                  messages: [
                    ...backendMessages,
                    {
                      role: "user",
                      content: userPrompt
                    }
                  ]
                }, {
                  headers: {
                    'Content-Type': 'application/json'
                  }
                })

                setSteps((steps) => ([...steps, ...parseXmlAndGenerateSteps(codeResponse.data, steps).map(x => ({
                  ...x,
                  status: "pending" as const
                }))]))
          
                setBackendMessages((x) => [...x, {
                  role: "assistant",
                  content: codeResponse.data
                }])          

                } catch(e){
                  console.log(e)
                } finally{
                  setIsUserInputOpen(true)
                  setUserPrompt("")
                }
              }
            }>
              <ChevronRight color={"gray"} />
            </button>
        </div>   
      </div>
  ): <div className='flex w-full justify-center my-10'><Spinner /></div>;

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-[#1A1A1D] text-gray-900 dark:text-white">
      <Navbar />
        
      <EditorLayout
        inputPanel={inputPanel}
        stepsPanel={<Steps steps={steps as Step[]} />}
        filesPanel={<FileExplorer files={files} onFileSelect={setCurrentFile} />}
        editorPanel={editorPanel}
      />
    </div>
  );
};

export default EditorPage;