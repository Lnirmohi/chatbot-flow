import { useReactFlow, type Node } from "@xyflow/react";
import { useEffect, useState } from "react";

export default function SettingsPanel({
  selectedNode,
  onBackClick
}: {
  selectedNode: Node | null;
  onBackClick: () => void
}) {
  const { updateNodeData } = useReactFlow();
  
  const [val, setVal] = useState(selectedNode?.data?.value as string ?? '');

  useEffect(() => {
    if (!selectedNode) {
      onBackClick();
    }

    setVal(selectedNode?.data?.value as string ?? '');
  }, [onBackClick, selectedNode]);
  
  return (
    <section>
      <div className="flex justify-between">
        <button 
          className="flex text-sm text-gray-600 hover:text-black"
          onClick={() => {
            onBackClick();
          }}
        >
          <span className="mr-2 text-3xl font-bold hover:cursor-pointer">←</span>
        </button>
        <p className="py-2 font-medium text-gray-500 pr-4">Settings Panel</p>
      </div>
      
      <hr className="py-2" />

      <div className="flex flex-col gap-2 px-4">
        <textarea 
          value={val} 
          onChange={e => {
            setVal(e.target.value);
          }}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <button 
          type="button" 
          onClick={() => {
            if (selectedNode) {
              updateNodeData(selectedNode.id, {...selectedNode.data, value: val});
              setVal('');
            }
          }}
          className="py-2.5 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        >
          Save Changes
        </button>
      </div>
    </section>
  );
}