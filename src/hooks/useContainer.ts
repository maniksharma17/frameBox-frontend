import { useEffect, useState } from "react";
import { WebContainer } from '@webcontainer/api';

export function useWebContainer(){
  const [webContainer, setWebContainer] = useState<WebContainer>()

  async function main() {
    const webContainerInstance = await WebContainer.boot()
    setWebContainer(webContainerInstance)
  }
  useEffect(()=>{
    main()
  }, [])

  return webContainer
}