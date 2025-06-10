import { useEffect, useMemo } from "react";
import { useGraphContext } from "../../context/GraphContext";
import { useAngularInjector } from "../../hooks/useAngularInjector";
import { Node } from "../../types/node"
import { rgbToRgba } from "../../utils/colorUtils";
import { NodeLabel } from "../Mappers/NodeLabel";

type NodeListProps = {
  nodes: Node[];
}
export const NodesList = ({ nodes }: NodeListProps) => {
  const { settings, layout, selectedNodeId, selectedScrollDisabled, colorScaler, searchQuery } = useGraphContext();
  const hoverService = useAngularInjector('hoverService');
  const selectService = useAngularInjector('selectService');

  useEffect(() => {
    if (!selectedNodeId || selectedScrollDisabled) return;
    const el = document.getElementById(`nodelist-item-${selectedNodeId}`);
    if (!el) return;

    el.scrollIntoView({ behavior: 'smooth' });
  }, [selectedNodeId, selectedScrollDisabled]);

  const renderNodes = useMemo(() => {
    if (!settings) {
      return nodes;
    }

    return nodes.filter(x => {
      if (!searchQuery || !searchQuery.trim()) {
        return true;
      }

      const label = x.attr[settings.labelAttr] as string;
      if (!label) return false;
      return label.toLowerCase().includes(searchQuery.toLowerCase());
    })
  }, [nodes, settings, searchQuery]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedNodeId]);

  const handleKeyDown: EventListener = (e: Event) => {
    const evt = e as KeyboardEvent;

    const listContainer = document.querySelector('.list-unstyled');

    if (!listContainer?.checkVisibility()) {
      return;
    }

    if (!['ArrowDown', 'ArrowUp'].includes(evt.key) || !selectService || !selectedNodeId) {
      return;
    }

    e.preventDefault();

    const el = document.getElementById(`nodelist-item-${selectedNodeId}`);
    if (!el) return;

    if (evt.key === 'ArrowDown') {
      const nextEl = el.nextElementSibling;
      if (!nextEl) return;
    }
    const { nextEl, direction } = evt.key === 'ArrowDown' ? { nextEl: el.nextElementSibling, direction: 'next' } : { nextEl: el.previousElementSibling, direction: 'prev' };
    if (!nextEl) return;

    const nextId = nextEl.id.replace('nodelist-item-', '');
    const nextNode = nodes.find(node => node.id === nextId);
    if (!nextNode) return;

    selectService.selectSingleNode(nextId, true);
    const boundingRect = nextEl.getBoundingClientRect();
    const containerRect = listContainer.parentElement?.getBoundingClientRect();
    const elTop = boundingRect.top - (containerRect?.top || 0);
    const visibility = nextEl.checkVisibility() && elTop > 0 && boundingRect.bottom <= (containerRect?.bottom || window.innerHeight);

    const shouldScroll = !visibility && ((direction === 'next' && evt.key === 'ArrowDown') || (direction === 'prev' && evt.key === 'ArrowUp'));
    if (shouldScroll) {
      nextEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

  }

  if (!settings) return null;

  const handleMouseEnter = (id: string) => {
    if (!hoverService) return;
    hoverService.hoverNodes({ ids: id });
  }

  const handleMouseLeave = () => {
    if (!hoverService) return;
    hoverService.unhover()
  }

  const handleMouseDown = (id: string) => {
    if (!selectService) return;
    selectService.selectSingleNode(id, true);
  }


  const getNodeColor = (node: Node) => {
    if (layout && settings) {
      const colorVal = node.attr[settings.nodeColorAttr];
      if (colorVal && colorScaler) {
        return colorScaler(node);
      }
    }

    return settings.nodeColorDefaultValue;
  }

  const getHighlightColor = (node: Node) => {
    const res = getNodeColor(node);
    return rgbToRgba(res, .376);
  }

  return <ul className="list-unstyled">
    {renderNodes.map((node) => (
      <li
        key={node.id}
        className={`panel-item list-item pointable-cursor`}
        style={{ background: node.id === selectedNodeId ? getHighlightColor(node) : "#fff" }}
        id={`nodelist-item-${node.id}`}
        onMouseEnter={() => handleMouseEnter(node.id)}
        onMouseLeave={handleMouseLeave}
        onMouseDown={() => handleMouseDown(node.id)}
      >
        <div className="row vert-align truncate">
          <div className="col-xs-2">
            <div className="big-circle" style={{ background: getNodeColor(node) }}></div>
          </div>
          <div className="col-xs-10">
            <h6 className="less-gutter list-item__title truncate">
              <NodeLabel node={node} />
            </h6>
          </div>
        </div>
      </li>
    ))}
  </ul>
}