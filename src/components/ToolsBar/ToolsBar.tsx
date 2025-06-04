import type { ElementType, SVGProps } from 'react';

import { useDragAndDrop } from '@formkit/drag-and-drop/react';
import { useReactFlow } from '@xyflow/react';

import { useReactFlowStore } from '@/utils/stores';

import { MaterialSymbolsStopOutline } from '../icons';
import { ToolsBarItem } from './components';

const TOOLS_BAR_ITEMS: {
  name: string;
  Icon: ElementType<SVGProps<SVGSVGElement>>;
}[] = [
  {
    name: 'Блок',
    Icon: MaterialSymbolsStopOutline
  }
];

export const ToolsBar = () => {
  const { screenToFlowPosition } = useReactFlow();

  const [ref] = useDragAndDrop<HTMLUListElement>(TOOLS_BAR_ITEMS, {
    nativeDrag: false,
    onDragend: (data: any) => {
      const { nodes, setNodes } = useReactFlowStore.getState();

      const newNode = {
        data: { label: 'Block' },
        type: 'node',
        id: Date.now().toString(),
        position: screenToFlowPosition(data.state.coordinates)
      };

      setNodes([...nodes, newNode]);
    }
  });

  return (
    <ul ref={ref} className=' px-10 border-b-gray-100 py-5 shadow-xl flex flex-col gap-4'>
      {TOOLS_BAR_ITEMS.map((toolsBarItem) => (
        <ToolsBarItem key={toolsBarItem.name} {...toolsBarItem} />
      ))}
    </ul>
  );
};
