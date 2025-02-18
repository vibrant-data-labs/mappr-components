import React from 'react';
import { SelectionInfoContainer } from './components/SelectionInfo';

export { SelectionInfoContainer };

declare global {
  interface Window {
    MapprComponents?: Record<string, React.FC<never>>;
  }
}

if (typeof window !== "undefined") {
  window.MapprComponents = window.MapprComponents || {};
  window.MapprComponents.SelectionInfoContainer = SelectionInfoContainer;
}