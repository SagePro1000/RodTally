export const MATERIALS = {
  '8mm':  { pcsPerBundle: 20, bundlesPerTon: 20, pcsPerTon: { wholesale: 210, retail: 133 } },
  '10mm': { pcsPerBundle: 15, bundlesPerTon: 15, pcsPerTon: { wholesale: 135, retail: 133 } },
  '12mm': { pcsPerBundle: 10, bundlesPerTon: 10, pcsPerTon: { wholesale: 94,  retail: 93  } },
  '16mm': { pcsPerBundle: 5,  bundlesPerTon: 5,  pcsPerTon: { wholesale: 53,  retail: 52  } },
  '20mm': { pcsPerBundle: 3,  bundlesPerTon: 3,  pcsPerTon: { wholesale: 34,  retail: 33  } },
  '25mm': { pcsPerBundle: 2,  bundlesPerTon: 2,  pcsPerTon: { wholesale: 22,  retail: 21  } },
};

export const MATERIAL_SIZES = Object.keys(MATERIALS);
