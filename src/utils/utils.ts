import type { ReactFlowInstance, ReactFlowJsonObject, Node, Edge } from "@xyflow/react";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

// check if there are more than one Nodes and more than one Node has empty target handles 
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

// hook for managing react flow saved instances, parsing and storing using localStorage
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

// type guard to check if the obj is type of SavedRFInstance
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