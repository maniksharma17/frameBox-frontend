import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Step } from '../types';

interface StepsProps {
  steps: Step[];
}

const Steps: React.FC<StepsProps> = ({ steps }) => {
  
  return (
    <div className="border m-2 h-[70vh] rounded-lg overflow-y-scroll bg-gray-50 dark:bg-[#1A1A1D] border-r border-gray-200 dark:border-gray-700">
      <h2 className="mb-4 border-b dark:border-gray-700">
        <h2 className='text-lg font-semibold p-2'>Steps</h2>
      </h2>
      <div className="space-y-4 p-4">
        {steps.map((step, index) => {
          const filePath = step.title.split(':')[1]
          const action = step.title.split(':')[0]
          return <div key={index} className="flex gap-3 items-center">
          <div className="mt-1">
            {step.status==="completed" ? (
              <CheckCircle2 className="text-green-500" size={20} />
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600" />
            )}
          </div>
          <div className='flex flex-row flex-wrap gap-2 items-center'>
            <p>{action}</p>
            <code className='rounded-md text-sm p-2 bg-gray-200 text-black dark:bg-gray-900 dark:text-white'>
              {filePath}
            </code>
          </div>
        </div>
        })}
      </div>
    </div>
  );
};

export default Steps;