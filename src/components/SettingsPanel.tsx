import type { Node, NodeProps } from "@xyflow/react";
import { useState } from "react";

export default function SettingsPanel({
  selectedNode,
  setNodeData
}: {
  selectedNode: Node | null;
  setNodeData: (id: string, data: NodeProps['data']) => void;
}) {
  const [val, setVal] = useState(selectedNode?.data?.value as string ?? '');
  
  return (
    <section>
      <p>Settings Panel</p>
      <hr />
      <input 
        value={val} 
        onChange={e => {
          setVal(e.target.value);
        }}
      />
      <button 
        type="button" 
        onClick={() => {
          if (selectedNode) {
            setNodeData(selectedNode.id, {...selectedNode.data, value: val})
          }
        }}>
        Submit
      </button>
    </section>
  );
}