import { Tooltip } from "react-tooltip";
import cn from 'classnames';
import { NodeAttribute } from "../../types/nodeAttribute";
import { Dropdown } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useGraphContext } from "../../context/GraphContext";

type SortMenuProps = {
  nodeAttrs: NodeAttribute[];
  sortOrder: 'asc' | 'desc';
  onSortFieldChanged?: (field: string) => void;
  onSortOrderChanged?: (order: 'asc' | 'desc') => void;
}

type SortAttrItem = {
  id: string;
  title: string;
}

export const SortMenu = ({ sortOrder, nodeAttrs, onSortFieldChanged, onSortOrderChanged }: SortMenuProps) => {
  const buttonClasses = cn('card__action-sort', {
    'up': sortOrder === 'asc',
    'down': sortOrder === 'desc'
  });

  const { settings } = useGraphContext();

  const [sortTypes, setSortTypes] = useState<SortAttrItem[]>([]);
  const [selectedSortType, setSelectedSortType] = useState<SortAttrItem | null>(null);
  useEffect(() => {
    if (!nodeAttrs.length || !settings) {
      return;
    }


    const sortAttrs = nodeAttrs
      .filter(attr => attr.isNumeric && (attr.visibility.includes('filters') || attr.visibility.includes('profile')))
      .map(attr => ({
        id: attr.id,
        title: attr.title
      }));

    const newSortTypes = [{
      id: settings.labelAttr,
      title: 'Name'
    }, ...sortAttrs];

    setSortTypes(newSortTypes)
    setSelectedSortType(newSortTypes[0]);

  }, [nodeAttrs, settings])

  useEffect(() => {
    if (!selectedSortType) return;

    if (onSortFieldChanged) {
      onSortFieldChanged(selectedSortType.id);
    }
  }, [selectedSortType])

  return <div className="attr-visibility truncate card_type_filter card_type_filter--short">
    <button data-tooltip-id="sort-tooltip" className={buttonClasses} onClick={() => {
      if (onSortOrderChanged) {
        onSortOrderChanged(sortOrder === 'asc' ? 'desc' : 'asc');
      }
    }}></button>

    {sortTypes.length && selectedSortType &&
      <Dropdown className="sort-options">
        <Dropdown.Toggle variant='outline-info' id="dropdown-basic">
          <span className="card__title-full">
            {selectedSortType.title}
          </span>
        </Dropdown.Toggle>

        <Dropdown.Menu className="uib-dropdown-menu uib-dropdown-menu-flexing">
          <div className="uib-dropdown-flex-content">
            <div className="uib-dropdown-flex center">
              <ul className="dd-list list-unstyled">
                {sortTypes.map(sortType => (
                  <Dropdown.Item as="li" key={sortType.id} eventKey={sortType.id} className="row vert-align pointable-cursor">
                    <div className="col-xs-12">
                      <h6 className="no-margin text-capitalize">{sortType.title}</h6>
                    </div>
                  </Dropdown.Item>))}
              </ul>
            </div>
          </div>
        </Dropdown.Menu>
      </Dropdown>
    }
    <Tooltip id="sort-tooltip"
      place="bottom-end"
      content="Reverse Order"
      style={{
        backgroundColor: '#fff',
        border: '1px solid #cecece !important',
        borderRadius: '2px',
        boxShadow: '0 6px 10px #e6e6e6',
        color: '#323c47',
        padding: '8px 14px',
        textAlign: 'center',
        textDecoration: 'none',
        font: '400 14px / 21px Poppins',
        letterSpacing: '1px',
        lineHeight: '1.4em',
        zIndex: 100,
      }} />
  </div>
}
