import React, { useState, useCallback, useLayoutEffect } from "react"
import { useTheme } from "@geist-ui/core"
import { AST } from "@/parser"
import {
  GRAPH_NODE_BORDER_RADIUS,
  GRAPH_NODE_MARGIN_HORIZONTAL,
  GRAPH_GROUP_NODE_PADDING_VERTICAL,
  GRAPH_NODE_MIN_HEIGHT,
  GRAPH_NODE_MIN_WIDTH,
} from "@/constants"
import { withNameQuantifier } from "./with-name-quantifier"
import Nodes from "./nodes"
import MidConnect from "./mid-connect"
import Content from "./content"
type Props = {
  index: number
  x: number
  y: number
  node: AST.Node
  children: React.ReactNode
  selected: boolean
  onLayout: (index: number, layout: [number, number]) => void
}

const _GroupLikeNode = ({
  index,
  x,
  y,
  node,
  selected,
  children,
  onLayout,
}: Props) => {
  const { palette } = useTheme()
  const [layout, setLayout] = useState<[number, number]>([0, 0])

  useLayoutEffect(() => {
    if (
      (node.type === "group" || node.type === "lookAroundAssertion") &&
      node.children.length === 0
    ) {
      const layout: [number, number] = [
        GRAPH_NODE_MIN_WIDTH,
        GRAPH_NODE_MIN_HEIGHT,
      ]
      onLayout(index, layout)
      setLayout(layout)
    }
  }, [index, node, onLayout])

  const handleNodesLayout = useCallback(
    (_: number, [width, height]: [number, number]) => {
      const layout: [number, number] = [
        width + 2 * GRAPH_NODE_MARGIN_HORIZONTAL,
        height + 2 * GRAPH_GROUP_NODE_PADDING_VERTICAL,
      ]
      onLayout(index, layout)
      setLayout(layout)
    },
    [index, onLayout]
  )
  if (node.type !== "group" && node.type !== "lookAroundAssertion") {
    return null
  }

  const { id, children: nodeChildren } = node
  const connectY = y + layout[1] / 2
  return (
    <Content
      id={node.id}
      selected={selected}
      x={x}
      y={y}
      width={layout[0]}
      height={layout[1]}
      rx={GRAPH_NODE_BORDER_RADIUS}
      ry={GRAPH_NODE_BORDER_RADIUS}
      stroke={palette.accents_3}
      className="transparent-fill second-stroke"
    >
      {nodeChildren.length > 0 && (
        <>
          <MidConnect
            start={[x, connectY]}
            end={[x + GRAPH_NODE_MARGIN_HORIZONTAL, connectY]}
          />
          <MidConnect
            start={[x + layout[0] - GRAPH_NODE_MARGIN_HORIZONTAL, connectY]}
            end={[x + layout[0], connectY]}
          />
        </>
      )}
      {children}
      <Nodes
        id={id}
        index={0}
        x={x + GRAPH_NODE_MARGIN_HORIZONTAL}
        y={y + GRAPH_GROUP_NODE_PADDING_VERTICAL}
        nodes={nodeChildren}
        onLayout={handleNodesLayout}
      />
    </Content>
  )
}
const GroupLikeNode = withNameQuantifier(_GroupLikeNode)
GroupLikeNode.displayName = "GroupLikeGroup"
export default GroupLikeNode
