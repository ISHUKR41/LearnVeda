/**
 * FILE: MindMap.tsx
 * PURPOSE: Interactive, expandable mind-map tree component for topic revision.
 *          Displays hierarchical concept relationships with animated branch expansion,
 *          color-coded depth levels, and expand/collapse all functionality.
 *
 * FEATURES:
 *   - Expandable/collapsible tree nodes
 *   - Animated slide-down transitions
 *   - Color-coded depth levels (up to 5 colors)
 *   - Expand All / Collapse All toggle
 *   - Leaf nodes with visual distinction
 *   - Lucide React professional icons
 *   - Fully responsive design
 *
 * USED BY: DeepResearchChapterClient.tsx
 * LAST UPDATED: 2026-06-08
 */

"use client";

import React, { useState, useCallback } from "react";
import {
  GitBranch,
  ChevronRight,
  Maximize2,
  Minimize2,
  Circle,
} from "lucide-react";
import styles from "./MindMap.module.css";

/* ── Data shape for a mind map node ── */
export interface MindMapNode {
  /** Unique identifier for this node */
  id: string;
  /** Display label for the node */
  label: string;
  /** Optional child nodes forming the tree hierarchy */
  children?: MindMapNode[];
}

/* ── Component Props ── */
interface MindMapProps {
  /** Root nodes of the mind map tree */
  nodes: MindMapNode[];
  /** Optional title override (defaults to "Mind Map") */
  title?: string;
}

/* ── Recursive node component ── */
function MindMapNodeItem({
  node,
  depth,
  expandedNodes,
  toggleNode,
}: {
  node: MindMapNode;
  depth: number;
  expandedNodes: Set<string>;
  toggleNode: (id: string) => void;
}) {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedNodes.has(node.id);
  const levelClass = `level${Math.min(depth, 4)}`;

  if (!hasChildren) {
    /* Leaf node — no expand button */
    return (
      <li className={styles.leafNode}>
        <Circle size={8} className={styles.leafIcon} />
        <span>{node.label}</span>
      </li>
    );
  }

  return (
    <li className={`${styles.node} ${styles[levelClass]}`}>
      <button
        className={styles.nodeHeader}
        onClick={() => toggleNode(node.id)}
        aria-expanded={isExpanded}
      >
        <span className={`${styles.expandIcon} ${isExpanded ? styles.expanded : ""}`}>
          <ChevronRight size={14} />
        </span>
        <span className={styles.nodeDot} />
        <span className={styles.nodeLabel}>{node.label}</span>
        <span className={styles.childCount}>{node.children!.length}</span>
      </button>

      {isExpanded && (
        <ul className={styles.children}>
          {node.children!.map((child) => (
            <MindMapNodeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              expandedNodes={expandedNodes}
              toggleNode={toggleNode}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

/* ── Collect all node IDs recursively ── */
function collectAllIds(nodes: MindMapNode[]): string[] {
  const ids: string[] = [];
  const traverse = (nodeList: MindMapNode[]) => {
    nodeList.forEach((n) => {
      if (n.children && n.children.length > 0) {
        ids.push(n.id);
        traverse(n.children);
      }
    });
  };
  traverse(nodes);
  return ids;
}

/* ── Main MindMap Component ── */
export default function MindMap({ nodes, title = "Mind Map" }: MindMapProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [allExpanded, setAllExpanded] = useState(false);

  const toggleNode = useCallback((id: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    if (allExpanded) {
      setExpandedNodes(new Set());
      setAllExpanded(false);
    } else {
      setExpandedNodes(new Set(collectAllIds(nodes)));
      setAllExpanded(true);
    }
  }, [allExpanded, nodes]);

  if (!nodes || nodes.length === 0) return null;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.title}>
          <span className={styles.titleIcon}>
            <GitBranch size={18} />
          </span>
          {title}
        </h3>
        <button className={styles.expandAllBtn} onClick={toggleAll}>
          {allExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          {allExpanded ? "Collapse All" : "Expand All"}
        </button>
      </div>

      {/* Tree */}
      <ul className={styles.tree}>
        {nodes.map((node) => (
          <MindMapNodeItem
            key={node.id}
            node={node}
            depth={0}
            expandedNodes={expandedNodes}
            toggleNode={toggleNode}
          />
        ))}
      </ul>
    </div>
  );
}
