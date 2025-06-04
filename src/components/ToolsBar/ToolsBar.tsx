import type { ElementType, SVGProps } from "react";

import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { useReactFlow } from "@xyflow/react";
import { useShallow } from "zustand/shallow";

import { socketActions } from "@/utils/lib/socket";
import { useReactFlowStore, useRoomStore } from "@/utils/stores";

import {
  MaterialSymbolsAccountCircle,
  MaterialSymbolsStopOutline,
} from "../icons";
import { ToolsBarItem } from "./components";

const TOOLS_BAR_ITEMS: {
  name: string;
  Icon: ElementType<SVGProps<SVGSVGElement>>;
}[] = [
  {
    name: "Блок",
    Icon: MaterialSymbolsStopOutline,
  },
];

export const ToolsBar = () => {
  const { screenToFlowPosition } = useReactFlow();

  const { users } = useRoomStore(
    useShallow((state) => ({ users: state.users })),
  );

  const [ref] = useDragAndDrop<HTMLUListElement>(TOOLS_BAR_ITEMS, {
    nativeDrag: false,
    onDragend: (data: any) => {
      const { nodes, setNodes } = useReactFlowStore.getState();

      const newNode = {
        data: { label: "Block" },
        type: "node",
        id: Date.now().toString(),
        position: screenToFlowPosition(data.state.coordinates),
      };

      setNodes([...nodes, newNode]);
      socketActions.addNode(newNode);
    },
  });

  return (
    <div className=" px-10 w-[250px] border-b-gray-100 py-5 justify-between shadow-xl flex flex-col gap-4">
      <ul ref={ref}>
        {TOOLS_BAR_ITEMS.map((toolsBarItem) => (
          <ToolsBarItem key={toolsBarItem.name} {...toolsBarItem} />
        ))}
      </ul>
      <ul className="flex flex-col gap-2">
        {users.map((user) => (
          <div key={user.id} className="flex items-center gap-1">
            <MaterialSymbolsAccountCircle color={user.color} />
            <p className={`text-xs text-[${user.color}]`}>{user.name}</p>
          </div>
        ))}
      </ul>
    </div>
  );
};
