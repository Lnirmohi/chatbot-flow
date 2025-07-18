import type { ReactFlowInstance, ReactFlowJsonObject, Node, Edge } from "@xyflow/react";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

export function checkEmptyTargetHandles(rfInstance: ReactFlowInstance) {
  const nodesPresenet = rfInstance.getNodes();
  let emptyTargetHandlesCount = 0;

  if (nodesPresenet.length < 1) return false;

  for (const {id} of nodesPresenet) {
    const targetCount = rfInstance.getNodeConnections({
      nodeId: id, 
      type: 'target'
    }).length;
    
    if (targetCount === 0) {
      emptyTargetHandlesCount++;

      if (emptyTargetHandlesCount > 1) {
        return true;
      }
    }
  }
  

  return false;
}

export type SavedRFInstance = Record<string, ReactFlowJsonObject<Node, Edge>>;

export function useSaveInstances(): [
  SavedRFInstance, 
  Dispatch<SetStateAction<SavedRFInstance>>
] {
  const [savedInstances, setSavedInstances] = useState<SavedRFInstance>({});

  useEffect(() => {
    const instances = localStorage.getItem('savedInstances');

    if (instances && typeof instances === 'string') {
      const parsedInstance = JSON.parse(instances) as unknown;

      if (isSavedInstance(parsedInstance)) {
        setSavedInstances(parsedInstance);
      }

    } else {
      localStorage.setItem(
        'savedInstances', 
        JSON.stringify(savedInstances)
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('savedInstances', JSON.stringify(savedInstances));
  }, [savedInstances]);

  return [savedInstances, setSavedInstances];
}

function isSavedInstance(instance: unknown): instance is SavedRFInstance {

  if (instance === null || typeof instance !== 'object') return false;

  return Object.entries(instance).every(([key, val]) => {
    if (typeof key === 'string' 
      && 'node' in val 
      && 'edge' in val
    ) {
      return true;
    } else {
      return false;
    }
  });
}