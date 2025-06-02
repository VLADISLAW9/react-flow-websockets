import type { ElementType, SVGProps } from "react";

import { useDragAndDrop } from "@formkit/drag-and-drop/react";

import { MaterialSymbolsStopOutline } from "../icons";
import { ToolsBarItem } from "./components";
import type { AppNode } from "@/types/AppNode";
import { useReactFlow } from "@xyflow/react";
import { useReactFlowStore } from "@/stores";

const TOOLS_BAR_ITEMS: {
  name: string;
  Icon: ElementType<SVGProps<SVGSVGElement>>;
}[] = [
  {
    name: "Блок",
    Icon: MaterialSymbolsStopOutline,
  },
];

interface ToolBarProps {
  webSocketSend: any;
}

export const ToolsBar = ({ webSocketSend }: ToolBarProps) => {
  const { screenToFlowPosition } = useReactFlow();

  const [ref] = useDragAndDrop<HTMLUListElement>(TOOLS_BAR_ITEMS, {
    nativeDrag: false,
    onDragend: (data: any) => {
      const { nodes, setNodes } = useReactFlowStore.getState();

      const newNode: AppNode = {
        data: { label: "Block" },
        id: Date.now().toString(),
        position: screenToFlowPosition(data.state.coordinates),
      };

      setNodes([...nodes, newNode]);
      webSocketSend(
        JSON.stringify({ type: "ADD_NODE", payload: { node: newNode } }),
      );
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
