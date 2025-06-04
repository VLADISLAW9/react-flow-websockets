import type { Edge, OnConnect, OnEdgesChange, OnNodesChange } from '@xyflow/react';

import { addEdge, applyEdgeChanges, applyNodeChanges } from '@xyflow/react';
import { create } from 'zustand';

import type { AppNode } from '@/utils/types/AppNode';

export interface UseReactFlowStore {
  edges: Edge[];
  nodes: AppNode[];
  onConnect: OnConnect;
  onEdgesChange: OnEdgesChange;
  onNodesChange: OnNodesChange<AppNode>;
  setEdges: (edges: Edge[]) => void;
  setNodes: (nodes: AppNode[]) => void;
}

export const useReactFlowStore = create<UseReactFlowStore>((set, get) => ({
  nodes: [],
  edges: [],
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes)
    });
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges)
    });
  },
  onConnect: (connection) => {
    set({
      edges: addEdge(connection, get().edges)
    });
  },
  setNodes: (nodes) => {
    set({ nodes });
  },
  setEdges: (edges) => {
    set({ edges });
  }
}));
