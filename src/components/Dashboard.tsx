import '@xyflow/react/dist/style.css';

import { useCallback, useContext, useRef, useState, type DragEvent } from 'react';
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
  type ReactFlowInstance,
  type ReactFlowJsonObject,
  Panel,
} from '@xyflow/react';
import SendMessagesNode from './SendMessageNode';
import { CustomEdge } from './CustomEdge';
import NodesPanel from './NodePanel';
import DnDContext, { DnDProvider } from '../utils/DnDContext';
import SettingsPanel from './SettingsPanel';
import { checkEmptyTargetHandles, useSaveInstances } from '../utils/utils';
import { toast } from 'react-toastify';
import Header from './Header';

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
  const [selectedFlowName, setSelectedFlowName] = useState('');
  const [savedInstance, setSavedInstance] = useSaveInstances();

  const { screenToFlowPosition, setViewport } = useReactFlow();
  const [type, setType] = useContext(DnDContext);
  const allSavedInstances = Object.keys(savedInstance);
 
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

  const saveFlow = useCallback((newFlowName: string) => {
    console.log(rfInstance);
    if (rfInstance) {
      const emptyHandlesPresent = checkEmptyTargetHandles(rfInstance);

      if (emptyHandlesPresent) {
        toast.error("Cannot save flow");
      }
      
      const flow = rfInstance.toObject();

      if (newFlowName.length) {
        setSavedInstance(prev => {
          return {
            ...prev,
            [newFlowName]: flow
          };
        });

        toast.success("Flow saved");
      } else {
        if (newFlowName.length === 0)  {
          handleFlowCreate(true, flow);
        }
      }
    }
  }, [rfInstance, selectedFlowName, setSavedInstance]);

  const resetFlow = () => {
    if (rfInstance) {
      rfInstance.setNodes([]);
      rfInstance.setEdges([]);
      rfInstance.setViewport({ x: 0, y: 0, zoom: 1 });

      setNodes([]);
      setEdges([]);
      setSelectedNode(null);
    }
  }

  const handleFlowCreate = (update=false, flow?: ReactFlowJsonObject<Node, Edge>) => {
    const newFlowName = prompt("Enter name for the flow");
                    
    if (newFlowName) {

      if (flow) {
        setSavedInstance(prev => {
          return {
            ...prev,
            [newFlowName]: flow
          };
        });
      }

      const flowAlreadyExist = allSavedInstances.includes(newFlowName);
      if (flowAlreadyExist) {
        toast.error(`Flow with same name alaready exist: ${newFlowName}`);
      } else {
        setSelectedFlowName(newFlowName);
        if (!update) {
          resetFlow();
        }
      }
    }
  }

  const handleFlowSelect = useCallback((name: string) => {
    setSelectedFlowName(name);
    
    if (name in savedInstance && rfInstance) {
      const foundInst = savedInstance[name];
      // rfInstance.setNodes([...foundInst.nodes]);
      // rfInstance.setEdges([...foundInst.edges]);
      // rfInstance.setViewport({x: 0, y: 0, zoom: 1});

      setNodes(foundInst.nodes);
      setEdges(foundInst.edges);
      setViewport({x: 0, y: 0, zoom: 1});
      setSelectedNode(null);
    }
  }, [rfInstance, savedInstance]);
 
  return (
    <div className="flex flex-col w-full h-full">
      <Header 
        saveFlow={saveFlow} 
        savedInstanceNames={allSavedInstances} 
        flowName={selectedFlowName}
        onFlowSelect={handleFlowSelect}
      />
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
            <Panel position="top-left">
              <div>
                <button 
                  className="rounded-sm bg-blue-400 text-white font-medium p-3 shadow-lg hover:cursor-pointer active:scale-95"
                  onClick={() => handleFlowCreate()}
                >
                  + New flow
                </button>
              </div>
            </Panel>
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

