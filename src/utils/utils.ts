import type { ReactFlowInstance } from "@xyflow/react";

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