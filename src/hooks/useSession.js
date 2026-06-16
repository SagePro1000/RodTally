import { useState } from 'react';
import { MATERIALS } from '../data/materials';

export function useSession(addSession) {
  const [selectedMaterial, setSelectedMaterial] = useState('12mm');
  const [saleType, setSaleType] = useState('wholesale');
  const [bundleCount, setBundleCount] = useState(0);
  const [countMode, setCountMode] = useState('free'); // 'free' | 'target'
  const [targetType, setTargetType] = useState('tons'); // 'tons' | 'pieces'
  const [targetValue, setTargetValue] = useState(1);

  const material = MATERIALS[selectedMaterial];
  const pieces = bundleCount * material.pcsPerBundle;
  const tons = (pieces / material.pcsPerTon[saleType]).toFixed(2);

  const targetReached = countMode === 'target' && (
    targetType === 'pieces' ? pieces >= targetValue : parseFloat(tons) >= targetValue
  );

  function countBundle() {
    if (targetReached) return;
    setBundleCount(prev => prev + 1);
  }

  function undo() {
    setBundleCount(prev => Math.max(0, prev - 1));
  }

  function reset() {
    if (bundleCount > 0) {
      addSession({
        timestamp: new Date().toISOString(),
        material: selectedMaterial,
        saleType,
        bundles: bundleCount,
        pieces,
        tons,
        targetReached: countMode === 'target' ? targetReached : undefined,
      });
    }
    setBundleCount(0);
  }

  return {
    selectedMaterial,
    setSelectedMaterial,
    saleType,
    setSaleType,
    bundleCount,
    pieces,
    tons,
    countMode,
    setCountMode,
    targetType,
    setTargetType,
    targetValue,
    setTargetValue,
    targetReached,
    countBundle,
    undo,
    reset,
  };
}
