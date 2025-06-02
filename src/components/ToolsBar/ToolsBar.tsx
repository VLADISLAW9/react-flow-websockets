import type { ElementType, SVGProps } from "react";

import { useDragAndDrop } from "@formkit/drag-and-drop/react";

import { MaterialSymbolsStopOutline } from "../icons";
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
  const [ref] = useDragAndDrop<HTMLUListElement>(TOOLS_BAR_ITEMS, {
    nativeDrag: false,
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
