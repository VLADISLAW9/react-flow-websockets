import { useDragAndDrop } from '@formkit/drag-and-drop/react';
import { useReactFlow } from '@xyflow/react';

import { useUsersStore } from '@/utils/stores';

import { MaterialSymbolsAccountCircle, MaterialSymbolsStopOutline } from '../icons';
import { reactFlow } from '@/utils/lib/reactFlow/instance';

const TOOLS_BAR_ITEMS = [
  {
    name: 'Блок',
    Icon: MaterialSymbolsStopOutline
  }
];

export const ToolsBar = () => {
  const { screenToFlowPosition } = useReactFlow();
  const { users } = useUsersStore();

  const [ref] = useDragAndDrop<HTMLUListElement>(TOOLS_BAR_ITEMS, {
    nativeDrag: false,
    onDragend: (data: any) => {
      const newNode = {
        data: { label: 'Block' },
        type: 'node',
        id: Date.now().toString(),
        position: screenToFlowPosition(data.state.coordinates)
      };

      reactFlow.addNode(newNode);
    }
  });

  return (
    <div className=' px-10 w-[250px] border-b-gray-100 py-5 justify-between shadow-xl flex flex-col gap-4'>
      <ul ref={ref}>
        {TOOLS_BAR_ITEMS.map((toolsBarItems) => (
          <li
            key={toolsBarItems.name}
            className='flex cursor-grab px-5 py-2 shadow-sm rounded-2xl items-center gap-1'
          >
            <toolsBarItems.Icon height={20} width={20} />
            <p>{toolsBarItems.name}</p>
          </li>
        ))}
      </ul>
      <ul className='flex flex-col gap-2'>
        {users.map((user) => (
          <div key={user.id} className='flex items-center gap-1'>
            <MaterialSymbolsAccountCircle color={user.color} />
            <p className={`text-xs text-[${user.color}]`}>{user.name}</p>
          </div>
        ))}
      </ul>
    </div>
  );
};
