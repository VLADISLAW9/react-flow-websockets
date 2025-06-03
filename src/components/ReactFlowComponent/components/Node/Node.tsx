import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { AppNode } from "@/utils/types/AppNode";

export const Node = ({ data, isConnectable }: NodeProps<AppNode>) => {
  return (
    <>
      <Handle
        type="target"
        className="z-10! w-2! h-2!"
        position={Position.Left}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={isConnectable}
      />
      <div className=" w-20 h-30 drop-shadow-xl p-1 bg-amber-200">
        <h1>{data.label}</h1>
      </div>
      <Handle
        className="z-10 w-2! h-2!"
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </>
  );
};
