import '@xyflow/react/dist/style.css';

import { useCallback, useContext, useRef, useState, type DragEvent, type JSX, type ReactNode } from 'react';
import {
  ReactFlow,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type FitViewOptions,
  type OnConnect,
  type OnNodesChange,
  type OnEdgesChange,
  type OnNodeDrag,
  type DefaultEdgeOptions,
  Controls,
  Background,
  useReactFlow,
  ReactFlowProvider,
  type NodeProps,
  type ReactFlowInstance,
} from '@xyflow/react';
import SendMessagesNode from './SendMessageNode';
import { CustomEdge } from './CustomEdge';
import NodesPanel from './NodePanel';
import DnDContext, { DnDProvider } from '../utils/DnDContext';
import SettingsPanel from './SettingsPanel';
import { checkEmptyTargetHandles } from '../utils/utils';

const initialNodes: Node[] = [];
 
const initialEdges: Edge[] = [];

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};
 
const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
};

const onNodeDrag: OnNodeDrag = (_, node) => {
  // console.log('drag event', node.data);
};

const nodeTypes = {
  textUpdater: SendMessagesNode,
};

const edgeTypes = {
  'custom-edge': CustomEdge,
};

let id = 0;
const getId = () => `dndnode_${id++}`;

function Dashboard() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  const { screenToFlowPosition } = useReactFlow();
  const [type, setType] = useContext(DnDContext);
 
  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );
  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
 
      // check if the dropped element is valid
      if (!type) {
        return;
      }
 
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };
 
      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, type],
  );

  const saveFlow = useCallback(() => {
    if (rfInstance) {
      const emptyHandlesPresnet = checkEmptyTargetHandles(rfInstance);

      if (emptyHandlesPresnet) alert("Can not save");
      
      const flow = rfInstance.toObject();
      localStorage.setItem('flowInstance', JSON.stringify(flow));
    }
  }, [rfInstance]);
 
  return (
    <div className="flex flex-col w-full h-full">
      <button
        className={`
          self-end m-4 px-4 py-2 ring-1 ring-gray-400 text-blue-500
          hover:ring-1 hover:ring-blue-500 hover:cursor-pointer 
          rounded-sm
        `}
        onClick={() => {
          saveFlow();
        }}
      >
        Save changes
      </button>
      <section className='flex w-full h-full border-1 border-t-gray-400'>
        <div style={{ width: '80%', height: '90%' }} ref={reactFlowWrapper} className='basis-[80%]'>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeDrag={onNodeDrag}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
            fitViewOptions={fitViewOptions}
            defaultEdgeOptions={defaultEdgeOptions}
            onNodeClick={(e, node) => {
              setSelectedNode(node);
            }}
            onNodesDelete={(node) => {
              if (node[0].id === selectedNode?.id) {
                setSelectedNode(null);
              }
            }}
            onInit={setRfInstance}
          >
            <Controls />
            <Background />
          </ReactFlow>
        </div>

        <aside className='basis-[20%] border-l-2 border-gray-300'>
          {selectedNode
            ? <SettingsPanel 
                selectedNode={selectedNode}
                onBackClick={() => {setSelectedNode(null);}}
              />
            : <NodesPanel />
          }
        </aside>
      </section>
      
    </div>
  );
}

export default function DashboardWithProvider() {
  return (
    <ReactFlowProvider>
      <DnDProvider>
        <Dashboard />
      </DnDProvider>
    </ReactFlowProvider>
  );
}

