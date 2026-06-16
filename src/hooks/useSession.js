import { useState, useEffect } from 'react';
import { MATERIALS, MATERIAL_SIZES } from '../data/materials';

const STORAGE_KEY = 'rodtally_session';

const DEFAULTS = {
  selectedMaterial: '12mm',
  saleType: 'wholesale',
  bundleCount: 0,
  countMode: 'free',
  targetType: 'tons',
  targetValue: 1,
};

function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;

    const data = JSON.parse(raw);
    return {
      selectedMaterial: MATERIAL_SIZES.includes(data.selectedMaterial)
        ? data.selectedMaterial
        : DEFAULTS.selectedMaterial,
      saleType: data.saleType === 'retail' ? 'retail' : 'wholesale',
      bundleCount:
        Number.isInteger(data.bundleCount) && data.bundleCount >= 0
          ? data.bundleCount
          : DEFAULTS.bundleCount,
      countMode: data.countMode === 'target' ? 'target' : 'free',
      targetType: data.targetType === 'pieces' ? 'pieces' : 'tons',
      targetValue:
        typeof data.targetValue === 'number' && data.targetValue > 0
          ? data.targetValue
          : DEFAULTS.targetValue,
    };
  } catch {
    return DEFAULTS;
  }
}

function saveSession(session) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // localStorage may be full — fail silently
  }
}

export function useSession(addSession) {
  const initial = loadSession();
  const [selectedMaterial, setSelectedMaterial] = useState(initial.selectedMaterial);
  const [saleType, setSaleType] = useState(initial.saleType);
  const [bundleCount, setBundleCount] = useState(initial.bundleCount);
  const [countMode, setCountMode] = useState(initial.countMode);
  const [targetType, setTargetType] = useState(initial.targetType);
  const [targetValue, setTargetValue] = useState(initial.targetValue);

  useEffect(() => {
    saveSession({
      selectedMaterial,
      saleType,
      bundleCount,
      countMode,
      targetType,
      targetValue,
    });
  }, [selectedMaterial, saleType, bundleCount, countMode, targetType, targetValue]);

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
