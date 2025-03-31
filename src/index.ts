import React from 'react';
import { SelectionInfoContainer } from './components/SelectionInfo';
import { Slider } from './components/Slider';

export { SelectionInfoContainer, Slider };

declare global {
  interface Window {
    MapprComponents?: Record<string, React.FC<never>>;
  }
}

if (typeof window !== "undefined") {
  window.MapprComponents = window.MapprComponents || {};
  window.MapprComponents.SelectionInfoContainer = SelectionInfoContainer;
  window.MapprComponents.Slider = Slider;
}