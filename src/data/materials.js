// Hardcoded fallback defaults — used if database is offline or app is loading for the first time
export const DEFAULT_MATERIALS = {
  '8mm':  { pcsPerBundle: 20, bundlesPerTon: 20, pcsPerTon: { wholesale: 210, retail: 133 } },
  '10mm': { pcsPerBundle: 15, bundlesPerTon: 15, pcsPerTon: { wholesale: 135, retail: 133 } },
  '12mm': { pcsPerBundle: 10, bundlesPerTon: 10, pcsPerTon: { wholesale: 94,  retail: 93  } },
  '16mm': { pcsPerBundle: 5,  bundlesPerTon: 5,  pcsPerTon: { wholesale: 53,  retail: 52  } },
  '20mm': { pcsPerBundle: 3,  bundlesPerTon: 3,  pcsPerTon: { wholesale: 34,  retail: 33  } },
  '25mm': { pcsPerBundle: 2,  bundlesPerTon: 2,  pcsPerTon: { wholesale: 22,  retail: 21  } },
};

const STORAGE_KEY = 'rodtally_materials_cache';

/**
 * Loads materials configuration.
 * Prioritizes:
 *   1. Cached database overrides (from localStorage)
 *   2. Default hardcoded fallbacks
 */
export function getMaterials() {
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Object.keys(parsed).length > 0) {
        return parsed;
      }
    }
  } catch {
    // Fail silently, use defaults
  }
  return DEFAULT_MATERIALS;
}

// Export static properties matching legacy code exports to prevent breaking imports
export const MATERIALS = getMaterials();
export const MATERIAL_SIZES = Object.keys(MATERIALS);
