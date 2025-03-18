import classNames from "classnames";
import { useGraphContext } from "../../context/GraphContext"
import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";

export const SearchInput = () => {
  const { searchQuery, setSearchQuery } = useGraphContext();
  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    if (!isOpened) {
      setSearchQuery('');
    }
  }, [isOpened])

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value !== searchQuery) {
      setSearchQuery(value);
    }
  }

  return <div className={classNames("node-search", { "node-search--opened": isOpened })}>
    <button className="node-search__btn node-search__btn--open" data-tooltip-id="search-tooltip" onClick={() => setIsOpened(true)}></button>
    <input className="node-search__input"
      type="text"
      defaultValue={searchQuery}
      value={searchQuery}
      placeholder="search nodes..."
      onChange={handleSearchInput}
    />
    <button className="node-search__btn node-search__btn--close" onClick={() => setIsOpened(false)}></button>
    <Tooltip id="search-tooltip"
      place="top"
      content="Search Nodes"
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