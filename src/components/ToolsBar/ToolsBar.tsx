import type { ElementType, SVGProps } from "react";

import { useDragAndDrop } from "@formkit/drag-and-drop/react";

import { MaterialSymbolsStopOutline } from "../icons";
import { ToolsBarItem } from "./components";
import type { AppNode } from "@/utils/types/AppNode";
import { useReactFlow } from "@xyflow/react";
import { useReactFlowStore, useWebSocketStore } from "@/utils/stores";

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
  const { addNode } = useWebSocketStore();

  const [ref] = useDragAndDrop<HTMLUListElement>(TOOLS_BAR_ITEMS, {
    nativeDrag: false,
    onDragend: (data: any) => {
      const { nodes, setNodes } = useReactFlowStore.getState();

      const newNode = {
        data: { label: "Block" },
        id: Date.now().toString(),
        position: screenToFlowPosition(data.state.coordinates),
      };

      setNodes([...nodes, newNode]);

      addNode(newNode);
    },
  });

  return (
    <ul
      ref={ref}
      className=" px-10 border-b-gray-100 py-5 shadow-xl flex flex-col gap-4"
    >
      {TOOLS_BAR_ITEMS.map((toolsBarItem) => (
        <ToolsBarItem key={toolsBarItem.name} {...toolsBarItem} />
      ))}
    </ul>
  );
};
