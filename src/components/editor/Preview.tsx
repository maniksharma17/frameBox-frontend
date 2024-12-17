import { WebContainer } from '@webcontainer/api';
import React, { useEffect, useState } from 'react';
import Spinner from '../Spinner';

interface PreviewProps {
  webcontainer: WebContainer
}

const Preview: React.FC<PreviewProps> = ({ webcontainer }) => {

  const [url, setUrl] = useState("")

  useEffect(()=>{
    const init = async () => {
      await webcontainer.spawn('npm', ['install']);
      await webcontainer.spawn('npm', ['run', 'dev']);

      webcontainer.on('server-ready', (port, url) => {
        setUrl(url)
        console.log(port)
  });
    }
    
    init()
  }, [webcontainer])

  return (
  <>
  {url?
    <iframe 
    width={"100%"}
    height={"100%"}
    title="Preview"
    className="w-full h-full bg-white dark:bg-gray-900"
    src={url}
  />
  : <div className='flex items-center justify-center h-full'><Spinner /></div>} 
  </>
);
};

export default Preview;