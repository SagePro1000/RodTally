import { useState, useEffect } from 'react';
import { MATERIALS, MATERIAL_SIZES } from '../data/materials';

const STORAGE_KEY = 'rodtally_session';

const DEFAULTS = {
  selectedMaterial: '12mm',
  saleType: 'wholesale',
  pieceCount: 0,
  incrementHistory: [],
  countMode: 'free',
  targetType: 'tons',
  targetValue: 1,
  bundleSize16: 5,
};

function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;

    const data = JSON.parse(raw);
    const selectedMaterial = MATERIAL_SIZES.includes(data.selectedMaterial)
      ? data.selectedMaterial
      : DEFAULTS.selectedMaterial;
    const material = MATERIALS[selectedMaterial];

    let pieceCount = DEFAULTS.pieceCount;
    if (Number.isInteger(data.pieceCount) && data.pieceCount >= 0) {
      pieceCount = data.pieceCount;
    } else if (Number.isInteger(data.bundleCount) && data.bundleCount >= 0) {
      pieceCount = data.bundleCount * material.pcsPerBundle;
    }

    const incrementHistory = Array.isArray(data.incrementHistory)
      ? data.incrementHistory.filter((n) => Number.isInteger(n) && n > 0)
      : [];

    return {
      selectedMaterial,
      saleType: data.saleType === 'retail' ? 'retail' : 'wholesale',
      pieceCount,
      incrementHistory,
      countMode: data.countMode === 'target' ? 'target' : 'free',
      targetType: data.targetType === 'pieces' ? 'pieces' : 'tons',
      targetValue:
        typeof data.targetValue === 'number' && data.targetValue > 0
          ? data.targetValue
          : DEFAULTS.targetValue,
      bundleSize16: data.bundleSize16 === 6 ? 6 : 5,
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

function targetPiecesFor(material, saleType, targetValue, bundleSize16Override) {
  const pcsPerBundle = bundleSize16Override != null ? bundleSize16Override : material.pcsPerBundle;
  // Recalculate pcsPerTon based on override bundle size for 16mm
  const pcsPerTon = bundleSize16Override != null
    ? Math.round((material.pcsPerTon[saleType] / material.pcsPerBundle) * bundleSize16Override)
    : material.pcsPerTon[saleType];
  return Math.round(targetValue * pcsPerTon);
}

export function useSession(addSession) {
  const initial = loadSession();
  const [selectedMaterial, setSelectedMaterial] = useState(initial.selectedMaterial);
  const [saleType, setSaleType] = useState(initial.saleType);
  const [pieceCount, setPieceCount] = useState(initial.pieceCount);
  const [incrementHistory, setIncrementHistory] = useState(initial.incrementHistory ?? []);
  const [countMode, setCountMode] = useState(initial.countMode);
  const [targetType, setTargetType] = useState(initial.targetType);
  const [targetValue, setTargetValue] = useState(initial.targetValue);
  const [bundleSize16, setBundleSize16] = useState(initial.bundleSize16);

  const material = MATERIALS[selectedMaterial];

  // Effective bundle size: override only for 16mm in set-target tons mode
  const use16mmOverride = selectedMaterial === '16mm' && countMode === 'target' && targetType === 'tons';
  const effectiveBundleSize = use16mmOverride ? bundleSize16 : material.pcsPerBundle;

  const pieces = pieceCount;
  const fullBundles = Math.floor(pieceCount / effectiveBundleSize);
  const partialPieces = pieceCount % effectiveBundleSize;

  const targetPieces = countMode === 'target' && targetType === 'tons'
    ? targetPiecesFor(material, saleType, targetValue, use16mmOverride ? bundleSize16 : null)
    : 0;

  let displayTons = (pieces / material.pcsPerTon[saleType]).toFixed(2);
  if (countMode === 'target' && targetType === 'tons' && pieces === targetPieces) {
    displayTons = parseFloat(targetValue).toFixed(2);
  }

  const tons = displayTons;
  const countingPieces = countMode === 'target' && targetType === 'pieces';
  const bundleOnly = countMode === 'target' && targetType === 'tons';

  const targetReached =
    countMode === 'target' &&
    (targetType === 'pieces'
      ? pieces >= targetValue
      : pieces >= targetPiecesFor(material, saleType, targetValue, use16mmOverride ? bundleSize16 : null));

  useEffect(() => {
    saveSession({
      selectedMaterial,
      saleType,
      pieceCount,
      incrementHistory,
      countMode,
      targetType,
      targetValue,
      bundleSize16,
    });
  }, [selectedMaterial, saleType, pieceCount, incrementHistory, countMode, targetType, targetValue, bundleSize16]);

  function count(unit = 'bundle') {
    if (targetReached) return;

    const effectiveUnit = countingPieces ? 'piece' : unit;
    let increment = effectiveUnit === 'piece' ? 1 : effectiveBundleSize;

    if (countMode === 'target') {
      const targetPcs = targetType === 'pieces'
        ? targetValue
        : targetPiecesFor(material, saleType, targetValue, use16mmOverride ? bundleSize16 : null);

      const remaining = targetPcs - pieceCount;
      increment = Math.min(increment, remaining);
    }

    if (increment <= 0) return;
    setPieceCount((prev) => prev + increment);
    setIncrementHistory((prev) => [...prev, increment]);
  }

  function undo() {
    setIncrementHistory((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      setPieceCount((count) => Math.max(0, count - last));
      return prev.slice(0, -1);
    });
  }

  function reset() {
    if (pieceCount > 0) {
      addSession({
        timestamp: new Date().toISOString(),
        material: selectedMaterial,
        saleType,
        bundles: fullBundles,
        partialPieces,
        pieces,
        tons,
        targetReached: countMode === 'target' ? targetReached : undefined,
      });
    }
    setPieceCount(0);
    setIncrementHistory([]);
  }

  return {
    selectedMaterial,
    setSelectedMaterial,
    saleType,
    setSaleType,
    pieceCount,
    fullBundles,
    partialPieces,
    pieces,
    tons,
    countingPieces,
    bundleOnly,
    countMode,
    setCountMode,
    targetType,
    setTargetType,
    targetValue,
    setTargetValue,
    bundleSize16,
    setBundleSize16,
    targetReached,
    countBundle: count,
    undo,
    reset,
    hasCount: (incrementHistory ?? []).length > 0,
  };
}
