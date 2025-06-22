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
  getNodeById: (nodeId: AppNode['id'] | null) => AppNode | undefined;
  setEdges: (edges: Edge[]) => void;
  setNodeData: (nodeId: AppNode['id'], data: AppNode['data']) => void;
  setNodes: (nodes: AppNode[]) => void;
}

export const useReactFlowStore = create<UseReactFlowStore>((set, get) => ({
  nodes: [],
  edges: [],

  getNodeById: (nodeId) => {
    return get().nodes.find((node) => node.id === nodeId);
  },

  setNodeData: (nodeId, data) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      )
    }));
  },

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
