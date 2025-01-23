// @ts-nocheck
// Types
import type { ITreeNode } from '../types/tree-node.type'

export function useTraversing() {
  /**
   * Goes through the tree via `parent` property, for each node, callback is
   * called to handle the node
   */
  const traverseParents = <T extends IItem>(
    nodes: IItem<T>[],
    callback: (parentNode: IItem<T> | null, currentNode: IItem<T>) => void,
    options: { parentField?: string, stop?: boolean } = {},
  ) => {
    // FIXME: Implement `stop`
    const { parentField = 'parent' } = options

    nodes.forEach(node => {
      if (node[parentField]) {
        const parent = node[parentField]

        callback(node[parentField], node)

        if (parent[parentField]) {
          traverseParents([parent], callback, options)
        }
      } else {
        callback(null, node)
      }
    })
  }

  /**
   * Goes through the tree via `children` property, for each node, callback is
   * called to handle the node
   */
  function traverseChildren<T extends IItem>(
    nodes: IItem<T>[] | undefined,
    callback: (
      parentNode: IItem<T> | null,
      currentNode: IItem<T>,
      idx: number
    ) => void,
    options: { childrenField?: string, childIdx?: number } = {},
    parentNode?: IItem<T>,
  ) {
    const { childrenField = 'children', childIdx } = options

    nodes?.forEach((node, idx) => {
      if (node[childrenField]) {
        callback(parentNode || null, node, childIdx ?? idx)

        node[childrenField].forEach((childNode: IItem<T>, childIdx: number) => {
          traverseChildren(
            [childNode],
            callback,
            { ...options, childIdx },
            node,
          )
        })
      } else {
        callback(parentNode || null, node, childIdx ?? idx)
      }
    })
  }

  /**
   * WARNING: This function MUTATES THE ORIGINAL ARRAY
   * Requires `children` property on the nodes!
   *
   * @param options.assignParent Assigns the full `parent` object to each node
   * Be aware that this will mutate the original array.
   */
  const flattenTree = <T extends IItem = IItem>(
    nodes: ITreeNode<T>[],
    options?: { assignParent?: boolean },
  ) => {
    const { assignParent = false } = options || {}
    const flattenedNodes: ITreeNode<T>[] = []

    traverseChildren(nodes, (parentNode, currentNode) => {
      if (assignParent) {
        currentNode.parent = parentNode || null
      }

      flattenedNodes.push(currentNode)
    })

    return flattenedNodes
  }

  /**
   * WARNING: This function MUTATES THE ORIGINAL ARRAY
   * Requires `parent` property on the nodes!
   */
  const flatToTree = <T extends IItem = IItem>(nodes: ITreeNode<T>[], allNodes: ITreeNode<T>[]) => {
    const nodeById: Record<ITreeNode['id'], ITreeNode<T>> = {}

    // To keep track of nodes that have already been added to some parent node
    const usedNodeIdsByParentId: Record<
      ITreeNode['id'],
      Record<ITreeNode['id'], boolean>
    > = {}

    const nodeParentByNodeId = allNodes.reduce((agg, node) => {
      if (node.parent?.id) {
        agg[node.id] = node.parent
      }

      return agg
    }, {} as Record<ITreeNode['id'], ITreeNode>)

    traverseParents(nodes, (parentNode, currentNode) => {
      // This should trigger only when we filtered a node that has no children
      // Any other node should be handled in the `else if` lower
      if (!parentNode && !usedNodeIdsByParentId[currentNode.id]) {
        currentNode.children = []

        nodeById[currentNode.id] = currentNode
      }

      // For each parent of node, we reset the children and add it into the result
      else if (parentNode && nodeById[parentNode.id] === undefined) {
        parentNode.parent = nodeParentByNodeId[parentNode.id] as ITreeNode<T>
        parentNode.children = []

        nodeById[parentNode.id] = parentNode
      }

      // For any nested node (~ node with a parent)
      if (
        parentNode
        && usedNodeIdsByParentId[parentNode.id]?.[currentNode.id] === undefined
      ) {
        // We add the child nodes to the parent created above
        nodeById[parentNode.id]?.children?.push(currentNode)

        // Any node can only be added once to a parent,
        // so we keep track of the nodeIds we added to a parent
        if (usedNodeIdsByParentId[parentNode.id] === undefined) {
          usedNodeIdsByParentId[parentNode.id] = {}
        }

        usedNodeIdsByParentId[parentNode.id]![currentNode.id] = true
      }
    })

    return Object.values(nodeById).filter(node => !node.parent)
  }

  /**
   * Gets children nodes of specified nodes ~ only the lowest level of children
   * for each node is returned
   */
  const getChildren = (nodes: ITreeNode[], allNodes: ITreeNode[]) => {
    const childrenById: Record<ITreeNode['id'], ITreeNode> = {}

    const nodesByParentId = allNodes.reduce((agg, node) => {
      if (node.parent?.id) {
        if (agg[node.parent.id] === undefined) {
          agg[node.parent.id] = []
        }

        agg[node.parent.id]?.push(node)
      }

      return agg
    }, {} as Record<ITreeNode['id'], ITreeNode[]>)

    const getChildNode = (nodes?: ITreeNode[]) => {
      nodes?.forEach(node => {
        const childrenNodes = nodesByParentId[node.id]

        if (childrenNodes) {
          getChildNode(childrenNodes)
        } else {
          childrenById[node.id] = node
        }
      })
    }

    getChildNode(nodes)

    return Object.values(childrenById)
  }

  /**
   * WARNING: This function MUTATES THE ORIGINAL ARRAY ~ it adds `children`
   */
  const createTreeFromFlat = <T extends IItem = IItem>(nodes: ITreeNode<T>[]) => {
    const nodeById = nodes.reduce((agg, node) => {
      agg[node.id] = node
      node.children = []

      return agg
    }, {} as Record<ITreeNode['id'], ITreeNode<T>>)

    nodes.forEach(node => {
      if (node.parentId) {
        const parentNode = nodeById[node.parentId] as ITreeNode<T>

        if (parentNode.children === undefined) {
          parentNode.children = []
        }

        parentNode.children.push(node)
      }
    })

    return Object.values(nodeById).filter(node => !node.parentId)
  }

  return {
    createTreeFromFlat,
    flattenTree,
    flatToTree,
    getChildren,
    traverseChildren,
  }
}
