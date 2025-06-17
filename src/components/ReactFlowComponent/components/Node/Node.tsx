import type { NodeProps } from '@xyflow/react';

import { Button } from '@mantine/core';
import { Handle, Position } from '@xyflow/react';

import type { AppNode } from '@/utils/types/AppNode';

import { useNodeDrawerStore } from '@/utils/stores';

export const Node = ({ data, isConnectable, ...props }: NodeProps<AppNode>) => {
  const nodeDrawerStore = useNodeDrawerStore();

  return (
    <>
      <Handle
        className='z-10! w-2! h-2!'
        type='target'
        isConnectable={isConnectable}
        position={Position.Left}
      />
      <div className=' w-20 h-30 drop-shadow-xl p-1 bg-amber-200'>
        <h1>{data.label}</h1>
        <Button
          size='compact-xs'
          onClick={() =>
            nodeDrawerStore.open({
              data,
              position: {
                x: props.positionAbsoluteX,
                y: props.positionAbsoluteY
              },
              ...props
            })
          }
        >
          {'>'}
        </Button>
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
