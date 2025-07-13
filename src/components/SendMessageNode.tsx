import { Handle, Position } from "@xyflow/react";
import { useState } from "react";

export default function SendMessagesNode() {
  const [value, setValue] = useState('Default value');
 
  return (
    <div className="flex flex-col gap-2 shadow-lg bg-white min-w-[240px] rounded-b-sm">
      <p className="px-2 py-2.5 bg-cyan-400 rounded-t-sm text-xs font-medium">Send Messages</p>
      <p className="px-1 py-2 text-xs text-gray-600 font-normal">{value}</p>
      <Handle type="source" position={Position.Left} />
      <Handle type="target" position={Position.Right} />
    </div>
  );
}