import React, { useState, useEffect, useRef } from 'react';

const JupiterLendingViz = () => {
  const [placedTokens, setPlacedTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState({ title: '', description: '' });
  const [connections, setConnections] = useState([]);
  const [animatedConnections, setAnimatedConnections] = useState([]);
  const canvasRef = useRef(null);

  // Jupiter Lending Protocol tokens with actual ecosystem data
  const tokens = [
    { id: 'JLP', name: 'JLP', color: '#00D4AA', type: 'core', description: 'Jupiter Liquidity Provider token' },
    { id: 'SOL', name: 'SOL', color: '#9945FF', type: 'collateral', description: 'Solana native token' },
    { id: 'USDC', name: 'USDC', color: '#2775CA', type: 'stable', description: 'USD Coin stablecoin' },
    { id: 'JTO', name: 'JTO', color: '#FFB800', type: 'governance', description: 'Jupiter DAO governance token' },
    { id: 'USDT', name: 'USDT', color: '#26A17B', type: 'stable', description: 'Tether stablecoin' },
    { id: 'mSOL', name: 'mSOL', color: '#7C65C1', type: 'liquid-staking', description: 'Marinade staked SOL' },
    { id: 'jitoSOL', name: 'jitoSOL', color: '#FF6B9D', type: 'liquid-staking', description: 'Jito staked SOL' },
    { id: 'bonkSOL', name: 'bSOL', color: '#FF4500', type: 'liquid-staking', description: 'BlazeStake staked SOL' }
  ];

  const handleCanvasClick = (e) => {
    if (!selectedToken || isAnalyzing) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPlacedTokens([...placedTokens, {
      ...selectedToken,
      x,
      y,
      placedId: Date.now()
    }]);
    setSelectedToken(null);
  };

  const analyzeConnections = (tokens) => {
    const connectionMap = [];

    // Define lending relationships based on JLP mechanics
    const relationships = {
      'JLP-USDC': { type: 'primary-liquidity', strength: 1.0, desc: 'Primary liquidity pair' },
      'JLP-SOL': { type: 'collateral', strength: 0.9, desc: 'Collateral backing' },
      'SOL-USDC': { type: 'lending-pair', strength: 0.95, desc: 'Core lending market' },
      'SOL-mSOL': { type: 'derivative', strength: 0.85, desc: 'Liquid staking derivative' },
      'SOL-jitoSOL': { type: 'derivative', strength: 0.85, desc: 'Liquid staking derivative' },
      'SOL-bonkSOL': { type: 'derivative', strength: 0.80, desc: 'Liquid staking derivative' },
      'mSOL-USDC': { type: 'lending-pair', strength: 0.75, desc: 'LST lending market' },
      'jitoSOL-USDC': { type: 'lending-pair', strength: 0.75, desc: 'LST lending market' },
      'bonkSOL-USDC': { type: 'lending-pair', strength: 0.70, desc: 'LST lending market' },
      'JTO-JLP': { type: 'governance', strength: 0.6, desc: 'Governance relationship' },
      'USDC-USDT': { type: 'stable-pair', strength: 0.95, desc: 'Stablecoin liquidity' },
      'USDT-SOL': { type: 'lending-pair', strength: 0.85, desc: 'Alternative stable lending' },
      'JTO-USDC': { type: 'governance-liquidity', strength: 0.65, desc: 'DAO treasury pair' }
    };

    // Create connections between placed tokens
    for (let i = 0; i < tokens.length; i++) {
      for (let j = i + 1; j < tokens.length; j++) {
        const key1 = `${tokens[i].id}-${tokens[j].id}`;
        const key2 = `${tokens[j].id}-${tokens[i].id}`;
        const relationship = relationships[key1] || relationships[key2];

        if (relationship) {
          connectionMap.push({
            from: tokens[i],
            to: tokens[j],
            type: relationship.type,
            strength: relationship.strength,
            description: relationship.desc,
            x1: tokens[i].x,
            y1: tokens[i].y,
            x2: tokens[j].x,
            y2: tokens[j].y
          });
        }
      }
    }

    return connectionMap;
  };

  const revealNetwork = async () => {
    if (placedTokens.length < 2) {
      alert('Place at least 2 tokens to see their relationships!');
      return;
    }

    setIsAnalyzing(true);
    const networkConnections = analyzeConnections(placedTokens);

    setConnections([]);
    setAnimatedConnections([]);

    // Animate connections
    let delay = 0;
    networkConnections.forEach((conn, index) => {
      setTimeout(() => {
        setAnimatedConnections(prev => [...prev, { ...conn, progress: 0, id: index }]);

        const startTime = Date.now();
        const duration = 400;

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);

          setAnimatedConnections(prev =>
            prev.map(c => c.id === index ? { ...c, progress } : c)
          );

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };

        requestAnimationFrame(animate);
      }, delay);

      delay += 150;
    });

    // Generate analysis
    setTimeout(async () => {
      const tokenNames = placedTokens.map(t => t.name).join(', ');
      const connectionDetails = networkConnections.map(c =>
        `${c.from.name} ↔ ${c.to.name}: ${c.description} (${c.type})`
      ).join('\n');

      const prompt = `Analyze this Jupiter Lending Protocol token network configuration:

<network_details>
Tokens placed: ${tokenNames}
Number of tokens: ${placedTokens.length}
Active connections: ${networkConnections.length}

Connection details:
${connectionDetails}
</network_details>

Based on these specific tokens and their relationships in the Jupiter ecosystem, explain:

1. What this configuration reveals about the lending/liquidity strategy
2. Key risk factors or opportunities in these relationships
3. How capital flows through these connections

Focus on:
- Collateral efficiency (95% LTV mechanics where relevant)
- Liquidity depth and stability
- Derivative relationships (especially LSTs)
- Smart contract dependencies

Respond with:
Title: A concise name for this network configuration (e.g., "Stablecoin-Backed Liquidity Stack")
Analysis: 2-3 sentences explaining the strategic implications and risk profile of this token configuration in the JLP ecosystem.

Return as JSON:
{
  "title": "Network Configuration Name",
  "analysis": "Detailed analysis paragraph"
}`;

      try {
        const response = await window.claude.complete(prompt);
        const result = JSON.parse(response);

        setAnalysis({
          title: result.title,
          description: result.analysis
        });
      } catch (error) {
        console.error('Error:', error);
        setAnalysis({
          title: 'Token Network Configuration',
          description: `This configuration connects ${placedTokens.length} tokens through ${networkConnections.length} lending and liquidity relationships in the Jupiter ecosystem.`
        });
      }

      setIsAnalyzing(false);
    }, delay + 400);
  };

  const reset = () => {
    setPlacedTokens([]);
    setConnections([]);
    setAnimatedConnections([]);
    setAnalysis({ title: '', description: '' });
    setSelectedToken(null);
  };

  const getConnectionColor = (type) => {
    const colors = {
      'primary-liquidity': 'rgba(0, 212, 170, 0.8)',
      'collateral': 'rgba(153, 69, 255, 0.7)',
      'lending-pair': 'rgba(39, 117, 202, 0.7)',
      'derivative': 'rgba(124, 101, 193, 0.6)',
      'governance': 'rgba(255, 184, 0, 0.6)',
      'stable-pair': 'rgba(38, 161, 123, 0.7)',
      'governance-liquidity': 'rgba(255, 184, 0, 0.5)'
    };
    return colors[type] || 'rgba(255, 255, 255, 0.5)';
  };

  const getConnectionWidth = (strength) => {
    return 1 + (strength * 2.5);
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(147, 51, 234, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(147, 51, 234, 0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Main canvas */}
      <div
        ref={canvasRef}
        className="absolute inset-0 cursor-crosshair"
        onClick={handleCanvasClick}
      >
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {animatedConnections.map((conn, i) => (
            <g key={i}>
              <line
                x1={conn.x1}
                y1={conn.y1}
                x2={conn.x1 + (conn.x2 - conn.x1) * conn.progress}
                y2={conn.y1 + (conn.y2 - conn.y1) * conn.progress}
                stroke={getConnectionColor(conn.type)}
                strokeWidth={getConnectionWidth(conn.strength)}
                strokeLinecap="round"
                filter="url(#glow)"
              />
              {/* Connection label */}
              {conn.progress === 1 && (
                <text
                  x={(conn.x1 + conn.x2) / 2}
                  y={(conn.y1 + conn.y2) / 2 - 8}
                  fill="white"
                  fontSize="11"
                  fontFamily="monospace"
                  textAnchor="middle"
                  opacity="0.7"
                >
                  {conn.type}
                </text>
              )}
            </g>
          ))}
        </svg>

        {/* Placed tokens */}
        {placedTokens.map((token) => (
          <div
            key={token.placedId}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: token.x, top: token.y }}
          >
            <div className="relative group">
              <div
                className="w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-white font-bold border-2"
                style={{
                  backgroundColor: token.color,
                  borderColor: 'rgba(255, 255, 255, 0.3)'
                }}
              >
                {token.name}
              </div>
              <div
                className="absolute inset-0 w-16 h-16 rounded-full blur-md opacity-50"
                style={{ backgroundColor: token.color }}
              />

              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-black/90 text-white text-xs px-3 py-2 rounded whitespace-nowrap">
                  {token.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-6 left-6 right-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Jupiter Lending Protocol Network
            </h1>
            <p className="text-purple-300 text-sm">
              Visualize token relationships and lending mechanics
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={revealNetwork}
              disabled={isAnalyzing || placedTokens.length < 2}
              className={`bg-purple-600 text-white px-6 py-2.5 rounded-lg font-medium
                ${isAnalyzing || placedTokens.length < 2 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-500'}
                transition-all duration-200 shadow-lg`}
            >
              {isAnalyzing ? 'Analyzing...' : 'Reveal Network'}
            </button>

            <button
              onClick={reset}
              className="bg-slate-700 text-white px-6 py-2.5 rounded-lg font-medium
                hover:bg-slate-600 transition-all duration-200 shadow-lg"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Token palette */}
      <div className="absolute left-6 top-32 bg-black/40 backdrop-blur-md rounded-lg p-4 border border-purple-500/30">
        <h3 className="text-white text-sm font-semibold mb-3">Available Tokens</h3>
        <div className="space-y-2">
          {tokens.map(token => (
            <button
              key={token.id}
              onClick={() => setSelectedToken(token)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all
                ${selectedToken?.id === token.id
                  ? 'bg-purple-600 ring-2 ring-purple-400'
                  : 'bg-slate-800/50 hover:bg-slate-700/50'}`}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: token.color }}
              >
                {token.name}
              </div>
              <div className="flex-1 text-left">
                <div className="text-white text-sm font-medium">{token.name}</div>
                <div className="text-purple-300 text-xs">{token.type}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Analysis panel */}
      {analysis.title && (
        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-gradient-to-r from-purple-900/90 to-indigo-900/90 backdrop-blur-md rounded-lg p-6 shadow-2xl border border-purple-500/30">
            <h2 className="text-2xl font-bold text-purple-200 mb-3">
              {analysis.title}
            </h2>
            <p className="text-purple-100 leading-relaxed">
              {analysis.description}
            </p>

            {/* Network stats */}
            <div className="mt-4 pt-4 border-t border-purple-500/30 flex gap-6">
              <div>
                <div className="text-purple-300 text-xs">Tokens</div>
                <div className="text-white text-xl font-bold">{placedTokens.length}</div>
              </div>
              <div>
                <div className="text-purple-300 text-xs">Connections</div>
                <div className="text-white text-xl font-bold">{animatedConnections.length}</div>
              </div>
              <div>
                <div className="text-purple-300 text-xs">Network Density</div>
                <div className="text-white text-xl font-bold">
                  {placedTokens.length > 1
                    ? Math.round((animatedConnections.length / (placedTokens.length * (placedTokens.length - 1) / 2)) * 100)
                    : 0}%
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {placedTokens.length === 0 && !selectedToken && (
        <div className="absolute bottom-6 left-6 right-6 text-center">
          <p className="text-purple-300 text-sm">
            Select a token from the palette, then click on the canvas to place it
          </p>
        </div>
      )}

      {selectedToken && (
        <div className="absolute bottom-6 left-6 right-6 text-center">
          <p className="text-purple-300 text-sm">
            Click anywhere to place <span className="font-bold text-white">{selectedToken.name}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default JupiterLendingViz;
