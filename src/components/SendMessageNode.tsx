import { useState } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import CustomHandle from "./CustomHandle";

export default function SendMessagesNode({selected, data}: NodeProps) {

  const message = data?.value && typeof data.value === 'string'
    ? data.value
    : '';

  return (
    <div 
      className={`
        flex flex-col gap-2 shadow-lg bg-white min-w-[240px] rounded-b-sm 
        ${selected ? 'border-2 border-amber-500 rounded-sm' : ''}`}
    >
      <p className="px-2 py-2.5 bg-cyan-400 rounded-t-sm text-xs font-medium">Send Messages</p>
      <p className="px-1 py-2 text-xs text-gray-600 font-normal">{message}</p>
      <CustomHandle type="source" position={Position.Left} />
      <CustomHandle type="target" position={Position.Right} />
    </div>
  );
}