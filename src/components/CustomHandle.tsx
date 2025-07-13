import React from 'react';
import { Handle, useNodeConnections } from '@xyflow/react';
import type { HandleProps } from '@xyflow/system';

export default function CustomHandle (props: HandleProps) {
  const connections = useNodeConnections({
    handleType: props.type,
  });

  return (
    <Handle
      {...props}
      isConnectable={
        props.type === 'target'
          ? connections.length < 1
          : true
      }
    />
  );
};
