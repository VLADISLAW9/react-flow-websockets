import type { NodeProps } from '@xyflow/react';

import { Handle, Position } from '@xyflow/react';

import type { AppNode } from '@/utils/types/AppNode';

export const Node = ({ data, isConnectable }: NodeProps<AppNode>) => {
  return (
    <>
      <Handle
        className='z-10! w-2! h-2!'
        type='target'
        isConnectable={isConnectable}
        onConnect={(params) => console.log('handle onConnect', params)}
        position={Position.Left}
      />
      <div className=' w-20 h-30 drop-shadow-xl p-1 bg-amber-200'>
        <h1>{data.label}</h1>
      </div>
      <Handle
        className='z-10 w-2! h-2!'
        type='source'
        isConnectable={isConnectable}
        position={Position.Right}
      />
    </>
  );
};
