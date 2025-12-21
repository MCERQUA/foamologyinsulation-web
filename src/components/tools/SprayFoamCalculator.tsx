import React, { useState, useCallback } from 'react';

type BuildingType = 'metal' | 'shed' | 'crawl' | 'attic' | 'garage' | 'barn';

interface CalculationResult {
  wallArea: number;
  ceilingArea: number;
  gableArea: number;
  totalArea: number;
  wallBoardFeet: number;
  ceilingBoardFeet: number;
  totalBoardFeet: number;
}

interface Dimensions {
  length: string;
  width: string;
  wallHeight: string;
  peakHeight: string;
  wallThickness: string;
  ceilingThickness: string;
}

const SprayFoamCalculator: React.FC = () => {
  const [buildingType, setBuildingType] = useState<BuildingType>('metal');
  const [activeField, setActiveField] = useState<keyof Dimensions>('length');
  const [dimensions, setDimensions] = useState<Dimensions>({
    length: '',
    width: '',
    wallHeight: '',
    peakHeight: '',
    wallThickness: '3',
    ceilingThickness: '5',
  });
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const buildingTypes: { id: BuildingType; label: string; emoji: string }[] = [
    { id: 'metal', label: 'Metal Bldg', emoji: '🏭' },
    { id: 'shed', label: 'Shed', emoji: '🏠' },
    { id: 'crawl', label: 'Crawl', emoji: '🔲' },
    { id: 'attic', label: 'Attic', emoji: '🔺' },
    { id: 'garage', label: 'Garage', emoji: '🚗' },
    { id: 'barn', label: 'Pole Barn', emoji: '🏚️' },
  ];

  const handleNumberPress = useCallback((num: string) => {
    setDimensions(prev => {
      const currentValue = prev[activeField];
      if (num === '.' && currentValue.includes('.')) return prev;
      if (currentValue.length >= 5) return prev;
      return { ...prev, [activeField]: currentValue + num };
    });
    setShowResult(false);
  }, [activeField]);

  const handleClear = useCallback(() => {
    setDimensions(prev => ({ ...prev, [activeField]: '' }));
    setShowResult(false);
  }, [activeField]);

  const handleClearAll = useCallback(() => {
    setDimensions({
      length: '',
      width: '',
      wallHeight: '',
      peakHeight: '',
      wallThickness: '3',
      ceilingThickness: '5',
    });
    setResult(null);
    setShowResult(false);
  }, []);

  const handleBackspace = useCallback(() => {
    setDimensions(prev => ({
      ...prev,
      [activeField]: prev[activeField].slice(0, -1),
    }));
    setShowResult(false);
  }, [activeField]);

  const nextField = useCallback(() => {
    const fields: (keyof Dimensions)[] = ['length', 'width', 'wallHeight', 'peakHeight'];
    const filteredFields = buildingType === 'crawl'
      ? fields.filter(f => f !== 'peakHeight')
      : fields;
    const currentIndex = filteredFields.indexOf(activeField);
    if (currentIndex < filteredFields.length - 1) {
      setActiveField(filteredFields[currentIndex + 1]);
    }
  }, [activeField, buildingType]);

  const calculateResults = useCallback(() => {
    const length = parseFloat(dimensions.length) || 0;
    const width = parseFloat(dimensions.width) || 0;
    const wallHeight = parseFloat(dimensions.wallHeight) || 0;
    const peakHeight = parseFloat(dimensions.peakHeight) || wallHeight;
    const wallThickness = parseFloat(dimensions.wallThickness) || 3;
    const ceilingThickness = parseFloat(dimensions.ceilingThickness) || 5;

    if (length <= 0 || width <= 0 || wallHeight <= 0) {
      return;
    }

    let wallArea = 0;
    let ceilingArea = 0;
    let gableArea = 0;

    switch (buildingType) {
      case 'metal':
      case 'barn':
      case 'garage': {
        wallArea = 2 * length * wallHeight + 2 * width * wallHeight;
        const rise = peakHeight - wallHeight;
        if (rise > 0) {
          gableArea = 2 * (0.5 * width * rise);
        }
        const run = width / 2;
        const slopeLength = Math.sqrt(rise * rise + run * run);
        ceilingArea = rise > 0 ? 2 * length * slopeLength : length * width;
        break;
      }
      case 'shed': {
        wallArea = 2 * length * wallHeight + 2 * width * wallHeight;
        const rise = peakHeight - wallHeight;
        if (rise > 0) {
          gableArea = 2 * (0.5 * width * rise);
          const run = width / 2;
          const slopeLength = Math.sqrt(rise * rise + run * run);
          ceilingArea = 2 * length * slopeLength;
        } else {
          ceilingArea = length * width;
        }
        break;
      }
      case 'crawl': {
        const perimeter = 2 * (length + width);
        wallArea = perimeter * wallHeight;
        ceilingArea = length * width;
        break;
      }
      case 'attic': {
        const rise = peakHeight - wallHeight;
        const run = width / 2;
        const slopeLength = Math.sqrt(rise * rise + run * run);
        ceilingArea = 2 * length * slopeLength;
        if (rise > 0) {
          gableArea = 2 * (0.5 * width * rise);
        }
        wallArea = gableArea;
        gableArea = 0;
        break;
      }
    }

    const totalArea = wallArea + ceilingArea + gableArea;
    const wallBoardFeet = (wallArea + gableArea) * wallThickness;
    const ceilingBoardFeet = ceilingArea * ceilingThickness;
    const totalBoardFeet = wallBoardFeet + ceilingBoardFeet;

    setResult({
      wallArea: Math.round(wallArea),
      ceilingArea: Math.round(ceilingArea),
      gableArea: Math.round(gableArea),
      totalArea: Math.round(totalArea),
      wallBoardFeet: Math.round(wallBoardFeet),
      ceilingBoardFeet: Math.round(ceilingBoardFeet),
      totalBoardFeet: Math.round(totalBoardFeet),
    });
    setShowResult(true);
  }, [dimensions, buildingType]);

  const inputFields: { key: keyof Dimensions; label: string; shortLabel: string; unit: string; show: boolean }[] = [
    { key: 'length', label: 'Length', shortLabel: 'L', unit: 'ft', show: true },
    { key: 'width', label: 'Width', shortLabel: 'W', unit: 'ft', show: true },
    { key: 'wallHeight', label: 'Wall Ht', shortLabel: 'H', unit: 'ft', show: true },
    { key: 'peakHeight', label: 'Peak Ht', shortLabel: 'P', unit: 'ft', show: buildingType !== 'crawl' },
  ];

  const thicknessFields: { key: keyof Dimensions; label: string }[] = [
    { key: 'wallThickness', label: 'Walls' },
    { key: 'ceilingThickness', label: 'Ceiling' },
  ];

  return (
    <div className="w-full max-w-md mx-auto select-none">
      {/* Calculator Body - Dark glass effect */}
      <div
        className="rounded-[2rem] overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #1a3a5c 0%, #0d1f30 100%)',
          boxShadow: `
            0 30px 60px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(255, 255, 255, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `,
        }}
      >
        {/* Building Type Selector - Horizontal scroll */}
        <div className="px-4 pt-4 pb-2 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 min-w-max">
            {buildingTypes.map(type => (
              <button
                key={type.id}
                onClick={() => {
                  setBuildingType(type.id);
                  setShowResult(false);
                }}
                className={`
                  flex flex-col items-center justify-center
                  min-w-[4.5rem] h-16 rounded-xl
                  transition-all duration-200 active:scale-95
                `}
                style={{
                  background: buildingType === type.id
                    ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.5), rgba(21, 101, 192, 0.6))'
                    : 'rgba(255, 255, 255, 0.08)',
                  border: buildingType === type.id
                    ? '2px solid rgba(100, 181, 246, 0.6)'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: buildingType === type.id
                    ? '0 0 25px rgba(33, 150, 243, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
                    : 'none',
                }}
              >
                <span className="text-xl mb-0.5">{type.emoji}</span>
                <span className={`text-[10px] font-medium ${buildingType === type.id ? 'text-white' : 'text-white/50'}`}>
                  {type.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Display Area */}
        <div className="px-4 py-3">
          {/* Dimension Inputs - Large touch targets */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {inputFields.filter(f => f.show).map(field => (
              <button
                key={field.key}
                onClick={() => setActiveField(field.key)}
                className={`
                  relative p-3 rounded-xl text-center
                  transition-all duration-150 active:scale-95
                  min-h-[4.5rem]
                `}
                style={{
                  background: activeField === field.key
                    ? 'linear-gradient(180deg, rgba(33, 150, 243, 0.3), rgba(33, 150, 243, 0.15))'
                    : 'rgba(0, 20, 40, 0.6)',
                  border: activeField === field.key
                    ? '2px solid rgba(100, 181, 246, 0.6)'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: activeField === field.key
                    ? '0 0 20px rgba(33, 150, 243, 0.2), inset 0 0 20px rgba(33, 150, 243, 0.1)'
                    : 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
                }}
              >
                <div className="text-[10px] text-white/40 uppercase tracking-wide">{field.label}</div>
                <div className="text-2xl font-bold font-mono text-cyan-300 mt-1">
                  {dimensions[field.key] || '0'}
                </div>
                <div className="text-xs text-white/30">{field.unit}</div>
              </button>
            ))}
          </div>

          {/* Thickness Selectors */}
          <div className="flex gap-4 mb-3 px-2">
            {thicknessFields.map(field => (
              <div key={field.key} className="flex-1">
                <div className="text-[10px] text-white/40 text-center mb-1 uppercase">{field.label}</div>
                <div className="flex justify-center gap-1">
                  {['2', '3', '4', '5', '6'].map(t => (
                    <button
                      key={t}
                      onClick={() => setDimensions(prev => ({ ...prev, [field.key]: t }))}
                      className={`
                        w-9 h-9 rounded-lg text-sm font-bold
                        transition-all duration-150 active:scale-90
                      `}
                      style={{
                        background: dimensions[field.key] === t
                          ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.5), rgba(56, 142, 60, 0.6))'
                          : 'rgba(255, 255, 255, 0.08)',
                        color: dimensions[field.key] === t ? 'white' : 'rgba(255,255,255,0.5)',
                        border: dimensions[field.key] === t
                          ? '2px solid rgba(129, 199, 132, 0.6)'
                          : '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      {t}"
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Results Panel - Slides up when calculated */}
        {showResult && result && (
          <div
            className="mx-4 mb-3 rounded-xl overflow-hidden animate-slide-up"
            style={{
              background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.15), rgba(56, 142, 60, 0.1))',
              border: '1px solid rgba(129, 199, 132, 0.3)',
            }}
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-green-300 font-semibold text-sm">Results</span>
                <button
                  onClick={() => setShowResult(false)}
                  className="text-white/40 text-xs"
                >
                  Hide
                </button>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div className="text-white/50">Walls</div>
                <div className="text-right font-mono text-white font-medium">
                  {result.wallArea.toLocaleString()} <span className="text-white/40">sqft</span>
                </div>
                {result.gableArea > 0 && (
                  <>
                    <div className="text-white/50">Gables</div>
                    <div className="text-right font-mono text-white font-medium">
                      {result.gableArea.toLocaleString()} <span className="text-white/40">sqft</span>
                    </div>
                  </>
                )}
                <div className="text-white/50">Ceiling</div>
                <div className="text-right font-mono text-white font-medium">
                  {result.ceilingArea.toLocaleString()} <span className="text-white/40">sqft</span>
                </div>
                <div className="col-span-2 border-t border-white/10 my-1" />
                <div className="text-cyan-300 font-medium">Total Area</div>
                <div className="text-right font-mono text-cyan-300 font-bold text-lg">
                  {result.totalArea.toLocaleString()} <span className="text-sm">sqft</span>
                </div>
                <div className="text-yellow-300 font-medium">Board Feet</div>
                <div className="text-right font-mono text-yellow-300 font-bold text-lg">
                  {result.totalBoardFeet.toLocaleString()} <span className="text-sm">BF</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Number Pad - Large touch-friendly buttons */}
        <div className="p-4 pt-2">
          <div className="grid grid-cols-4 gap-2">
            {/* Row 1: Clear buttons + operators */}
            <button
              onClick={handleClearAll}
              className="h-14 rounded-xl font-bold text-lg text-red-300 active:scale-95 transition-transform"
              style={{
                background: 'rgba(239, 83, 80, 0.25)',
                border: '1px solid rgba(239, 83, 80, 0.3)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              AC
            </button>
            <button
              onClick={handleClear}
              className="h-14 rounded-xl font-bold text-lg text-orange-300 active:scale-95 transition-transform"
              style={{
                background: 'rgba(255, 152, 0, 0.25)',
                border: '1px solid rgba(255, 152, 0, 0.3)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              C
            </button>
            <button
              onClick={handleBackspace}
              className="h-14 rounded-xl font-bold text-lg text-blue-300 active:scale-95 transition-transform flex items-center justify-center"
              style={{
                background: 'rgba(33, 150, 243, 0.25)',
                border: '1px solid rgba(33, 150, 243, 0.3)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
              </svg>
            </button>
            <button
              onClick={nextField}
              className="h-14 rounded-xl font-bold text-lg text-blue-300 active:scale-95 transition-transform"
              style={{
                background: 'rgba(33, 150, 243, 0.25)',
                border: '1px solid rgba(33, 150, 243, 0.3)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              Next
            </button>

            {/* Number rows */}
            {[['7', '8', '9', '.'], ['4', '5', '6', '0'], ['1', '2', '3', '00']].map((row, rowIndex) => (
              row.map((num, colIndex) => (
                <button
                  key={num}
                  onClick={() => handleNumberPress(num)}
                  className="h-14 rounded-xl font-bold text-2xl text-white active:scale-95 transition-transform"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    boxShadow: `
                      inset 0 1px 0 rgba(255,255,255,0.2),
                      inset 0 -1px 0 rgba(0,0,0,0.1),
                      0 2px 8px rgba(0,0,0,0.2)
                    `,
                  }}
                >
                  {num}
                </button>
              ))
            ))}
          </div>

          {/* Calculate Button - Extra large */}
          <button
            onClick={calculateResults}
            className="w-full h-16 mt-3 rounded-xl font-bold text-xl text-white active:scale-98 transition-transform"
            style={{
              background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.7) 0%, rgba(56, 142, 60, 0.8) 100%)',
              border: '2px solid rgba(129, 199, 132, 0.5)',
              boxShadow: `
                0 0 30px rgba(76, 175, 80, 0.3),
                inset 0 1px 0 rgba(255,255,255,0.3),
                0 4px 15px rgba(0,0,0,0.3)
              `,
            }}
          >
            CALCULATE
          </button>
        </div>

        {/* Footer */}
        <div className="pb-4 pt-1 text-center">
          <span className="text-[10px] text-white/30 tracking-wider uppercase">
            Foamology Insulation Estimator
          </span>
        </div>
      </div>
    </div>
  );
};

export default SprayFoamCalculator;
