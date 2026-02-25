import React, { useState, useEffect, useRef } from 'react';

const InteractiveGrass = () => {
  const canvasRef = useRef(null);
  const stars = useRef(null);
  const [grass, setGrass] = useState([]);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [discoveries, setDiscoveries] = useState([]);
  const [discoveryPoints, setDiscoveryPoints] = useState([]);
  const [timeOfDay, setTimeOfDay] = useState('day');
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [isGenerating, setIsGenerating] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [collectedDiscoveries, setCollectedDiscoveries] = useState([]);
  const [gameState, setGameState] = useState('start'); // 'start', 'exploring', 'summary'
  const [timerActive, setTimerActive] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [location, setLocation] = useState('');
  const [discoveryTracker, setDiscoveryTracker] = useState({});
  const [recentDiscoveries, setRecentDiscoveries] = useState([]);
  const [audioContext, setAudioContext] = useState(null);
  const [ambientGain, setAmbientGain] = useState(null);

  // Initialize audio context and ambient sound
  useEffect(() => {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    setAudioContext(context);

    // Create park ambient sounds
    const masterGain = context.createGain();
    masterGain.gain.value = 0;

    // Background wind/breeze noise
    const bufferSize = 2 * context.sampleRate;
    const noiseBuffer = context.createBuffer(1, bufferSize, context.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = context.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const windFilter = context.createBiquadFilter();
    windFilter.type = 'lowpass';
    windFilter.frequency.value = 500;

    const windGain = context.createGain();
    windGain.gain.value = 0.3;

    whiteNoise.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(masterGain);
    whiteNoise.start(0);

    // Bird chirping function
    const createBirdChirp = () => {
      const birdOsc = context.createOscillator();
      const birdGain = context.createGain();
      const birdFilter = context.createBiquadFilter();

      birdOsc.type = 'sine';
      birdFilter.type = 'bandpass';
      birdFilter.frequency.value = 2500;
      birdFilter.Q.value = 10;

      // Random bird chirp pattern
      const freq = 2000 + Math.random() * 1000;
      const startTime = context.currentTime + Math.random() * 5;

      birdOsc.frequency.setValueAtTime(freq, startTime);
      birdOsc.frequency.linearRampToValueAtTime(freq + 500, startTime + 0.05);
      birdOsc.frequency.linearRampToValueAtTime(freq, startTime + 0.1);

      birdGain.gain.setValueAtTime(0, startTime);
      birdGain.gain.linearRampToValueAtTime(0.06, startTime + 0.01);
      birdGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1);

      birdOsc.connect(birdFilter);
      birdFilter.connect(birdGain);
      birdGain.connect(masterGain);

      birdOsc.start(startTime);
      birdOsc.stop(startTime + 0.1);
    };

    // Schedule random bird chirps based on time of day
    const birdInterval = setInterval(() => {
      const hour = new Date().getHours();
      let birdChance = 0.3;

      if (hour >= 5 && hour < 9) {
        birdChance = 0.7;
      } else if (hour >= 9 && hour < 17) {
        birdChance = 0.4;
      } else if (hour >= 17 && hour < 19) {
        birdChance = 0.3;
      } else {
        birdChance = 0.05;
      }

      if (Math.random() < birdChance) {
        createBirdChirp();
      }
    }, 2000);

    // Occasional gentle cricket sound
    const createCricket = () => {
      const cricketOsc = context.createOscillator();
      const cricketGain = context.createGain();

      cricketOsc.type = 'square';
      cricketOsc.frequency.value = 4000;

      const startTime = context.currentTime;
      // Create rhythmic cricket sound
      for (let i = 0; i < 8; i++) {
        cricketGain.gain.setValueAtTime(0, startTime + i * 0.1);
        cricketGain.gain.linearRampToValueAtTime(0.02, startTime + i * 0.1 + 0.01);
        cricketGain.gain.linearRampToValueAtTime(0, startTime + i * 0.1 + 0.05);
      }

      cricketOsc.connect(cricketGain);
      cricketGain.connect(masterGain);

      cricketOsc.start(startTime);
      cricketOsc.stop(startTime + 1);
    };

    // Schedule cricket sounds based on time of day
    const cricketInterval = setInterval(() => {
      const hour = new Date().getHours();
      let cricketChance = 0.2;

      if (hour >= 19 || hour < 5) {
        cricketChance = 0.7;
      } else if (hour >= 17 && hour < 19) {
        cricketChance = 0.4;
      } else if (hour >= 5 && hour < 7) {
        cricketChance = 0.2;
      } else {
        cricketChance = 0.05;
      }

      if (Math.random() < cricketChance) {
        createCricket();
      }
    }, 3000);

    masterGain.connect(context.destination);
    setAmbientGain(masterGain);

    return () => {
      whiteNoise.stop();
      clearInterval(birdInterval);
      clearInterval(cricketInterval);
      context.close();
    };
  }, []);

  // Play discovery sound
  const playDiscoverySound = (rarity) => {
    if (!audioContext) return;

    if (rarity < 0.7) {
      // Common - very light twinkling sound
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.type = 'sine';
      osc.frequency.value = 1500;

      gain.gain.setValueAtTime(0, audioContext.currentTime);
      gain.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.start();
      osc.stop(audioContext.currentTime + 0.15);

    } else if (rarity < 0.9) {
      // Uncommon - delicate sparkle
      for (let i = 0; i < 2; i++) {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.type = 'sine';
        osc.frequency.value = 2000 + (i * 500);

        const startTime = audioContext.currentTime + (i * 0.05);
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.04, startTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);

        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.2);
      }

    } else {
      // Rare - ethereal shimmer
      const osc1 = audioContext.createOscillator();
      const osc2 = audioContext.createOscillator();
      const gain1 = audioContext.createGain();
      const gain2 = audioContext.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.value = 800;
      osc2.frequency.value = 1200;

      // Subtle filter for dreamier sound
      const filter = audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 4000;
      filter.Q.value = 0.5;

      // Very gentle volume envelope
      [gain1, gain2].forEach(gain => {
        gain.gain.setValueAtTime(0, audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(0.03, audioContext.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.8);
      });

      osc1.connect(gain1);
      osc2.connect(gain2);
      gain1.connect(filter);
      gain2.connect(filter);
      filter.connect(audioContext.destination);

      osc1.start();
      osc2.start();

      osc1.stop(audioContext.currentTime + 0.8);
      osc2.stop(audioContext.currentTime + 0.8);
    }
  };

  // Fade in/out ambient sound based on game state
  useEffect(() => {
    if (ambientGain && audioContext) {
      if (gameState === 'exploring') {
        // Adjust volume based on time of day
        let volume = 0.1;
        if (timeOfDay === 'night' || timeOfDay === 'evening') {
          volume = 0.15;
        } else if (timeOfDay === 'dawn' || timeOfDay === 'dusk') {
          volume = 0.12;
        }
        ambientGain.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 1);
      } else {
        ambientGain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1);
      }
    }
  }, [gameState, ambientGain, audioContext, timeOfDay]);

  // Location suggestions for shuffle
  const locationSuggestions = [
    'backyard',
    'soccer field',
    'golf course',
    'school playground',
    'picnic area',
    'meadow',
    'city park',
    'rooftop garden',
    'abandoned lot',
    'zen garden',
    'dog park',
    'highway rest stop',
    'church grounds',
    'college quad',
    'botanical garden',
    'festival grounds',
    'mini-golf course',
    'baseball diamond',
    'cemetery',
    "neighbor's perfect lawn",
    'Singapore botanical gardens',
    'New York Central Park',
    'Tokyo Imperial Gardens',
    'London Hyde Park',
    'Sydney Royal Botanic Garden',
    'Paris Luxembourg Gardens',
    'Barcelona Park Güell',
    'Vancouver Stanley Park',
    'Beijing Temple of Heaven Park',
    'Dubai Zabeel Park'
  ];

  // Shuffle function
  const shuffleLocation = () => {
    const currentIndex = locationSuggestions.indexOf(location);
    let nextIndex;

    do {
      nextIndex = Math.floor(Math.random() * locationSuggestions.length);
    } while (nextIndex === currentIndex && locationSuggestions.length > 1);

    setLocation(locationSuggestions[nextIndex]);
  };

  // Add Google Fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Update time of day based on actual time
  useEffect(() => {
    const updateTimeOfDay = () => {
      const hour = new Date().getHours();
      setCurrentHour(hour);

      if (hour >= 5 && hour < 7) {
        setTimeOfDay('dawn');
      } else if (hour >= 7 && hour < 10) {
        setTimeOfDay('morning');
      } else if (hour >= 10 && hour < 17) {
        setTimeOfDay('day');
      } else if (hour >= 17 && hour < 19) {
        setTimeOfDay('dusk');
      } else if (hour >= 19 && hour < 21) {
        setTimeOfDay('evening');
      } else {
        setTimeOfDay('night');
      }
    };

    updateTimeOfDay();
    const interval = setInterval(updateTimeOfDay, 60000);

    return () => clearInterval(interval);
  }, []);

  // Timer effect
  useEffect(() => {
    let timer;
    if (timerActive) {
      const startTime = Date.now() - elapsedTime * 1000;
      timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timerActive]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Generate grass color based on time of day
  const generateGrassColor = (tod) => {
    let hue, saturation, lightness;

    switch (tod) {
      case 'dawn':
        hue = 95 + Math.random() * 20;
        saturation = 50 + Math.random() * 20;
        lightness = 30 + Math.random() * 15;
        break;
      case 'morning':
        hue = 100 + Math.random() * 30;
        saturation = 60 + Math.random() * 20;
        lightness = 25 + Math.random() * 20;
        break;
      case 'day':
        hue = 100 + Math.random() * 30;
        saturation = 70 + Math.random() * 20;
        lightness = 25 + Math.random() * 20;
        break;
      case 'dusk':
        hue = 85 + Math.random() * 20;
        saturation = 40 + Math.random() * 20;
        lightness = 20 + Math.random() * 15;
        break;
      case 'evening':
        hue = 90 + Math.random() * 20;
        saturation = 30 + Math.random() * 20;
        lightness = 15 + Math.random() * 10;
        break;
      case 'night':
        hue = 100 + Math.random() * 20;
        saturation = 20 + Math.random() * 10;
        lightness = 10 + Math.random() * 10;
        break;
      default:
        hue = 100 + Math.random() * 30;
        saturation = 70;
        lightness = 25 + Math.random() * 20;
    }

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize discovery points
  useEffect(() => {
    const points = [];
    for (let i = 0; i < 5; i++) {
      const margin = 100;
      points.push({
        x: margin + Math.random() * (dimensions.width - 2 * margin),
        y: dimensions.height - 10 - Math.random() * 150,
        discovered: false,
        rarity: Math.random()
      });
    }
    setDiscoveryPoints(points);
  }, [dimensions]);

  // Initialize grass blades
  useEffect(() => {
    const bladesCount = Math.floor((dimensions.width * dimensions.height) / 500);
    const newGrass = [];

    for (let i = 0; i < bladesCount; i++) {
      newGrass.push({
        x: Math.random() * dimensions.width,
        baseY: dimensions.height - 10 - Math.random() * 200,
        height: 40 + Math.random() * 60,
        angle: 0,
        targetAngle: 0,
        width: 2 + Math.random() * 3,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 0.02 + Math.random() * 0.03,
        swayIntensity: 0.01 + Math.random() * 0.03,
        tension: 0.05 + Math.random() * 0.05,
        color: generateGrassColor(timeOfDay)
      });
    }

    // Add extra grass at the bottom edge
    for (let i = 0; i < bladesCount / 4; i++) {
      newGrass.push({
        x: Math.random() * dimensions.width,
        baseY: dimensions.height + Math.random() * 50,
        height: 60 + Math.random() * 80,
        angle: 0,
        targetAngle: 0,
        width: 2 + Math.random() * 3,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 0.02 + Math.random() * 0.03,
        swayIntensity: 0.01 + Math.random() * 0.03,
        tension: 0.05 + Math.random() * 0.05,
        color: `hsl(${100 + Math.random() * 30}, 70%, ${25 + Math.random() * 20}%)`
      });
    }

    setGrass(newGrass);
  }, [dimensions, timeOfDay]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const animate = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      // Draw background with time-based gradients
      const gradient = ctx.createLinearGradient(0, 0, 0, dimensions.height);

      if (timeOfDay === 'dawn') {
        gradient.addColorStop(0, '#FF6B6B');
        gradient.addColorStop(0.3, '#FFB88C');
        gradient.addColorStop(0.7, '#FFE0B2');
        gradient.addColorStop(1, '#90CFA4');
      } else if (timeOfDay === 'morning') {
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(0.7, '#B2EBF2');
        gradient.addColorStop(1, '#B9E3BD');
      } else if (timeOfDay === 'day') {
        gradient.addColorStop(0, '#4DA6FF');
        gradient.addColorStop(0.7, '#87CEEB');
        gradient.addColorStop(1, '#A1D7A9');
      } else if (timeOfDay === 'dusk') {
        gradient.addColorStop(0, '#FF8C42');
        gradient.addColorStop(0.3, '#FFA872');
        gradient.addColorStop(0.7, '#91A6B4');
        gradient.addColorStop(1, '#70997C');
      } else if (timeOfDay === 'evening') {
        gradient.addColorStop(0, '#355C7D');
        gradient.addColorStop(0.3, '#6C5B7B');
        gradient.addColorStop(0.7, '#C06C84');
        gradient.addColorStop(1, '#4A6F54');
      } else if (timeOfDay === 'night') {
        gradient.addColorStop(0, '#0B1A2A');
        gradient.addColorStop(0.3, '#183049');
        gradient.addColorStop(0.7, '#2A4D69');
        gradient.addColorStop(1, '#203A2E');
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      // Add stars at night
      if (timeOfDay === 'night') {
        if (!stars.current) {
          stars.current = [];
          for (let i = 0; i < 100; i++) {
            stars.current.push({
              x: Math.random() * dimensions.width,
              y: Math.random() * dimensions.height * 0.7,
              size: Math.random() * 1.5,
              baseAlpha: Math.random() * 0.3 + 0.7,
              twinkleSpeed: Math.random() * 0.0005 + 0.0002
            });
          }
        }

        const time = Date.now() * 0.001;
        stars.current.forEach(star => {
          const twinkle = Math.sin(time * star.twinkleSpeed) * 0.2 + 0.8;
          ctx.fillStyle = `rgba(255, 255, 255, ${star.baseAlpha * twinkle})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // Add moon at night/evening
      if (timeOfDay === 'night' || timeOfDay === 'evening') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(dimensions.width * 0.8, dimensions.height * 0.2, 40, 0, Math.PI * 2);
        ctx.fill();

        // Moon shadow
        ctx.fillStyle = timeOfDay === 'night' ? '#0B1A2A' : '#355C7D';
        ctx.beginPath();
        ctx.arc(dimensions.width * 0.8 + 10, dimensions.height * 0.2, 40, 0, Math.PI * 2);
        ctx.fill();
      }

      // Add sun during day
      if (timeOfDay === 'day' || timeOfDay === 'morning') {
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(dimensions.width * 0.8, dimensions.height * 0.2, 40, 0, Math.PI * 2);
        ctx.fill();

        // Sun rays
        for (let i = 0; i < 12; i++) {
          const angle = (i * Math.PI * 2) / 12;
          ctx.beginPath();
          ctx.moveTo(
            dimensions.width * 0.8 + Math.cos(angle) * 50,
            dimensions.height * 0.2 + Math.sin(angle) * 50
          );
          ctx.lineTo(
            dimensions.width * 0.8 + Math.cos(angle) * 60,
            dimensions.height * 0.2 + Math.sin(angle) * 60
          );
          ctx.strokeStyle = '#FFD700';
          ctx.lineWidth = 3;
          ctx.stroke();
        }
      }

      // Update and draw grass
      grass.forEach(blade => {
        // Update angle with spring physics
        const angleDiff = blade.targetAngle - blade.angle;
        blade.angle += angleDiff * blade.tension;

        // Natural swaying with individual variations
        blade.sway += blade.swaySpeed;
        const naturalSway = Math.sin(blade.sway) * blade.swayIntensity;

        // Draw blade
        ctx.save();
        ctx.translate(blade.x, blade.baseY);
        ctx.rotate(blade.angle + naturalSway);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(
          blade.width / 2, -blade.height / 2,
          0, -blade.height
        );
        ctx.quadraticCurveTo(
          -blade.width / 2, -blade.height / 2,
          0, 0
        );

        ctx.fillStyle = blade.color;
        ctx.fill();
        ctx.restore();
      });

      // Draw floating discoveries only when exploring
      if (gameState === 'exploring') {
        discoveries.forEach(discovery => {
          ctx.save();
          ctx.globalAlpha = discovery.opacity;
          ctx.font = `bold ${18 + discovery.scale * 6}px Arial`;

          let textColor = discovery.color;
          if (discovery.color === '#4CAF50') {
            textColor = '#388E3C';
          } else if (discovery.color === '#2196F3') {
            textColor = '#1976D2';
          } else if (discovery.color === '#FFD700') {
            textColor = '#B8860B';
          }

          ctx.fillStyle = textColor;
          ctx.strokeStyle = 'white';
          ctx.lineWidth = 4;
          ctx.lineJoin = 'round';
          ctx.miterLimit = 2;
          ctx.textAlign = 'center';

          ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
          ctx.shadowBlur = 8;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;

          const lines = discovery.text.split('\n');
          lines.forEach((line, index) => {
            const yOffset = discovery.y + (index * 25);
            ctx.strokeText(line, discovery.x, yOffset);
            ctx.fillText(line, discovery.x, yOffset);
          });

          ctx.restore();
        });
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [grass, dimensions, discoveries, gameState]);

  // Update floating discoveries
  useEffect(() => {
    if (gameState !== 'exploring') return;

    const updateInterval = setInterval(() => {
      setDiscoveries(prev =>
        prev.map(discovery => ({
          ...discovery,
          y: discovery.y - 1.5,
          opacity: discovery.opacity - 0.005,
          scale: discovery.scale + 0.01
        })).filter(discovery => discovery.opacity > 0)
      );
    }, 16);

    return () => clearInterval(updateInterval);
  }, [gameState]);

  // Generate discovery using Claude API
  const generateClaudeDiscovery = async (x, y, rarity) => {
    if (isGenerating) return;
    setIsGenerating(true);

    try {
      let prompt;
      let color;

      const randomSeed = Math.floor(Math.random() * 10000);

      // Time-specific discovery examples
      let timeSpecificExamples = {
        common: [],
        uncommon: [],
        rare: []
      };

      switch (timeOfDay) {
        case 'dawn':
          timeSpecificExamples.common = ["a dew drop", "a spider web", "a morning newspaper"];
          timeSpecificExamples.uncommon = ["bird eggs", "a sunrise photo", "jogger's earbuds"];
          timeSpecificExamples.rare = ["a meteor fragment", "a rare dawn flower"];
          break;
        case 'morning':
          timeSpecificExamples.common = ["a coffee cup lid", "school supplies", "morning paper"];
          timeSpecificExamples.uncommon = ["breakfast remnants", "lost homework", "morning crow feather"];
          timeSpecificExamples.rare = ["a golden sunrise crystal", "morning glory seed"];
          break;
        case 'day':
          timeSpecificExamples.common = ["a bottle cap", "a lost button", "sandwich wrapper"];
          timeSpecificExamples.uncommon = ["sunglasses", "picnic blanket corner", "frisbee fragment"];
          timeSpecificExamples.rare = ["a sun-bleached artifact", "midday rainbow stone"];
          break;
        case 'dusk':
          timeSpecificExamples.common = ["a ticket stub", "evening newspaper page", "dog toy"];
          timeSpecificExamples.uncommon = ["sunset photo", "evening jogger's headband", "dusk-blooming petal"];
          timeSpecificExamples.rare = ["a sunset agate", "twilight moth wing"];
          break;
        case 'evening':
          timeSpecificExamples.common = ["a dinner napkin", "restaurant receipt", "evening commuter pass"];
          timeSpecificExamples.uncommon = ["evening party invite", "concert ticket stub", "lost dinner reservation"];
          timeSpecificExamples.rare = ["a star emerald", "evening primrose seed"];
          break;
        case 'night':
          timeSpecificExamples.common = ["a glow stick", "flashlight battery", "night owl feather"];
          timeSpecificExamples.uncommon = ["moonstone chip", "nocturnal flower petal", "stargazer's map piece"];
          timeSpecificExamples.rare = ["a fallen star fragment", "lunar crystal", "night bloom essence"];
          break;
      }

      // Get location-specific context and examples
      let locationContext = '';
      let commonExamples = [];
      let uncommonExamples = [];
      let rareExamples = [];

      if (location) {
        const locationLower = location.toLowerCase();

        if (locationLower.includes('soccer') || locationLower.includes('football')) {
          locationContext = ' in soccer field grass';
          commonExamples = ["a missing cleat stud", "a torn goal net thread", "a grass-stained shin guard strap", "a referee's dropped whistle"];
          uncommonExamples = ["a lost team captain's armband", "a piece of championship confetti", "a section of penalty box line chalk"];
          rareExamples = ["a player's lucky pre-game penny", "a World Cup final ticket stub", "a signed soccer card"];
        } else if (locationLower.includes('backyard') || locationLower.includes('back yard')) {
          locationContext = ' in backyard grass';
          commonExamples = ["a dropped clothes pin", "a lost earring back", "a pet collar tag", "a barbecue skewer"];
          uncommonExamples = ["a child's lost tooth", "a wedding ring", "a buried dog toy"];
          rareExamples = ["a 1950s soda bottle cap", "grandmother's lost thimble", "a time capsule corner"];
        } else if (locationLower.includes('golf')) {
          locationContext = ' in golf course grass';
          commonExamples = ["a broken tee", "a lost ball marker", "a scorecard pencil", "a divot repair tool"];
          uncommonExamples = ["a pro's ball marker", "a clubhouse member pin", "a yardage book page"];
          rareExamples = ["a master's tournament ball", "Arnold Palmer's cigar tip", "a hole-in-one commemorative coin"];
        } else if (locationLower.includes('school') || locationLower.includes('playground')) {
          locationContext = ' in school playground grass';
          commonExamples = ["a lunch money quarter", "a broken pencil tip", "a hair tie", "a Pokemon card"];
          uncommonExamples = ["a retainer", "a class ring", "a report card corner"];
          rareExamples = ["a 1980s lunch token", "a vintage marble shooter", "a class of '99 pin"];
        } else if (locationLower.includes('picnic')) {
          locationContext = ' in picnic area grass';
          commonExamples = ["a plastic fork tine", "a bottle cap", "a napkin corner", "a watermelon seed"];
          uncommonExamples = ["a wine cork", "a picnic blanket tag", "a forgotten corkscrew"];
          rareExamples = ["a proposal ring box hinge", "a vintage thermos lid", "a 1960s soda pull tab"];
        } else if (locationLower.includes('meadow')) {
          locationContext = ' in meadow grass';
          commonExamples = ["a rabbit dropping", "a bird feather", "a dried flower head", "an acorn cap"];
          uncommonExamples = ["an arrowhead", "a deer antler tip", "a snake skin piece"];
          rareExamples = ["a fossil impression", "a natural crystal", "a gold nugget fragment", "an ancient pottery shard", "a meteorite piece"];
        } else if (locationLower.includes('park')) {
          locationContext = ' in park grass';
          commonExamples = ["a dog tag", "a frisbee chip", "a tennis ball fuzz", "a picnic fork"];
          uncommonExamples = ["a lost earring", "a festival wristband", "a skateboard wheel"];
          rareExamples = ["a 1920s jazz pin", "a vintage arcade token", "an antique carousel charm", "a famous writer's lost pen cap"];
        } else if (locationLower.includes('singapore') || locationLower.includes('botanical gardens')) {
          locationContext = ' in Singapore botanical garden grass';
          commonExamples = ["a tropical flower petal", "a orchid leaf", "a tourist ticket stub", "a garden map fragment"];
          uncommonExamples = ["a heritage tree plaque piece", "a bonsai exhibition tag", "a bird watching notebook page"];
          rareExamples = ["a Raffles-era trade coin", "a WWII currency piece", "a spice trader's ancient bead", "a rare orchid seed pod"];
        } else if (locationLower.includes('central park') || locationLower.includes('new york')) {
          locationContext = ' in Central Park grass';
          commonExamples = ["a hot dog wrapper", "a metro card", "a tourist map piece", "a horse carriage bolt"];
          uncommonExamples = ["a Broadway ticket stub", "a Yankees cap button", "a film location marker"];
          rareExamples = ["a 1920s speakeasy token", "a legendary performer's button", "a vintage subway token", "an art deco period charm"];
        } else if (locationLower.includes('tokyo') || locationLower.includes('imperial')) {
          locationContext = ' in Tokyo Imperial Garden grass';
          commonExamples = ["a cherry blossom petal", "a crane feather", "a koi food pellet", "a bamboo leaf"];
          uncommonExamples = ["a tea ceremony ticket", "a kimono fabric swatch", "a garden stone fragment"];
          rareExamples = ["an Edo period coin", "a vintage samurai button", "a traditional craft tool piece", "a rare jade fragment"];
        } else if (locationLower.includes('hyde park') || locationLower.includes('london')) {
          locationContext = ' in Hyde Park grass';
          commonExamples = ["a pigeon feather", "a speaker's corner badge", "a royal parks map piece", "a swan feather"];
          uncommonExamples = ["a palace guard button", "a rowing club pin", "a speaker's corner plaque fragment"];
          rareExamples = ["a Victorian jewelry piece", "a literary society pin", "a rare royal commemorative coin", "an antique theater token"];
        } else {
          locationContext = ` in ${location} grass`;
          commonExamples = ["a bottle cap", "a coin", "a button", "a plastic wrapper piece"];
          uncommonExamples = ["a key", "a ring", "a zipper pull", "a earring"];
          rareExamples = ["an antique coin", "a vintage toy piece", "a lost heirloom"];
        }
      } else {
        locationContext = ' in grass';
        commonExamples = ["a bottle cap", "a coin", "a button", "a plastic wrapper piece"];
        uncommonExamples = ["a key", "a ring", "a zipper pull", "a earring"];
        rareExamples = ["an antique coin", "a vintage toy piece", "a lost heirloom"];
      }

      if (rarity < 0.7) {
        // Common - realistic items with examples
        const examples = [...commonExamples, ...timeSpecificExamples.common];
        const example = examples[Math.floor(Math.random() * examples.length)];
        prompt = `Generate a common, realistic object someone would actually find${locationContext} during ${timeOfDay}. 2-4 words. Include "a" or "an". Lowercase. Example: "${example}". Be very specific to the location and time. Seed: ${randomSeed}`;
        color = '#4CAF50';
      } else if (rarity < 0.9) {
        // Uncommon - still realistic but less common
        const examples = [...uncommonExamples, ...timeSpecificExamples.uncommon];
        const example = examples[Math.floor(Math.random() * examples.length)];
        prompt = `Generate an uncommon but real object someone might find${locationContext} during ${timeOfDay}. 2-5 words. Include "a" or "an". Lowercase. Example: "${example}". Must be actually findable in that location at this time. Seed: ${randomSeed}`;
        color = '#2196F3';
      } else {
        // Rare - special historical or valuable items
        const examples = [...rareExamples, ...timeSpecificExamples.rare];
        const example = examples[Math.floor(Math.random() * examples.length)];
        prompt = `Generate a rare but real object someone could find${locationContext} during ${timeOfDay}. 2-5 words. Lowercase. Example: "${example}". Should be exciting or unusual - could be historical, natural wonder, valuable, or whimsical. Consider the time of day. Seed: ${randomSeed}`;
        color = '#FFD700';
      }

      // Add recently discovered items to prompt to avoid duplicates
      const avoidList = recentDiscoveries.slice(-3);
      let finalPrompt = prompt;
      if (avoidList.length > 0) {
        finalPrompt += ` Avoid these recent discoveries: "${avoidList.join('", "')}". Generate something different.`;
      }

      const response = await window.claude.complete(finalPrompt);
      const cleanResponse = response.trim().toLowerCase();

      // Check if we've reached the limit for this discovery
      const currentCount = discoveryTracker[cleanResponse] || 0;
      if (currentCount >= 3) {
        // If we've hit the limit, try to get a different discovery
        const retryPrompt = prompt + ` Avoid: "${cleanResponse}". Also avoid these recent discoveries: "${recentDiscoveries.join('", "')}". Generate something completely different.`;
        const retryResponse = await window.claude.complete(retryPrompt);
        const retryCleanResponse = retryResponse.trim().toLowerCase();

        // Update tracker for the new response
        setDiscoveryTracker(prev => ({
          ...prev,
          [retryCleanResponse]: (prev[retryCleanResponse] || 0) + 1
        }));

        // Update recent discoveries
        setRecentDiscoveries(prev => [...prev, retryCleanResponse].slice(-5));

        // Add to collected discoveries list
        setCollectedDiscoveries(prev => [...prev, {
          text: retryCleanResponse,
          color: color,
          time: elapsedTime,
          rarity: rarity < 0.7 ? 'common' : rarity < 0.9 ? 'uncommon' : 'rare'
        }]);

        // Display logic for retry response
        displayDiscovery(retryCleanResponse, x, y, color);

        // Play discovery sound
        playDiscoverySound(rarity);
      } else {
        // Update tracker
        setDiscoveryTracker(prev => ({
          ...prev,
          [cleanResponse]: currentCount + 1
        }));

        // Update recent discoveries
        setRecentDiscoveries(prev => [...prev, cleanResponse].slice(-5));

        // Add to collected discoveries list
        setCollectedDiscoveries(prev => [...prev, {
          text: cleanResponse,
          color: color,
          time: elapsedTime,
          rarity: rarity < 0.7 ? 'common' : rarity < 0.9 ? 'uncommon' : 'rare'
        }]);

        // Display logic for original response
        displayDiscovery(cleanResponse, x, y, color);

        // Play discovery sound
        playDiscoverySound(rarity);
      }
    } catch (error) {
      console.error('Error generating discovery:', error);
      const fallbacks = [
        "a tiny treasure",
        "a small wonder",
        "something special",
        "a curious find",
        "a hidden gem"
      ];
      const fallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];

      setDiscoveries(prev => [...prev, {
        text: `You found ${fallback}`,
        x: x,
        y: y - 60,
        opacity: 1,
        scale: 0,
        color: '#9C27B0'
      }]);
    } finally {
      setTimeout(() => setIsGenerating(false), 200);
    }
  };

  // Helper function to display discovery
  const displayDiscovery = (text, x, y, color) => {
    // Split long text into lines if necessary
    const maxLength = 20;
    let displayText = text;
    if (text.length > maxLength) {
      const words = text.split(' ');
      let line1 = [];
      let line2 = [];
      let currentLine = line1;

      words.forEach(word => {
        if (currentLine === line1 && line1.join(' ').length + word.length > maxLength) {
          currentLine = line2;
        }
        currentLine.push(word);
      });

      displayText = line1.join(' ') + '\n' + line2.join(' ');
    }

    // Ensure text stays within bounds
    let xPos = x;
    const padding = 150;
    if (xPos < padding) xPos = padding;
    if (xPos > dimensions.width - padding) xPos = dimensions.width - padding;

    setDiscoveries(prev => [...prev, {
      text: `You found ${displayText}`,
      x: xPos,
      y: y - 60,
      opacity: 1,
      scale: 0,
      color: color
    }]);
  };

  // Handle interaction
  const handleInteraction = (e) => {
    if (gameState !== 'exploring') return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check for discoveries
    if (discoveryPoints && discoveryPoints.length > 0) {
      discoveryPoints.forEach((point, index) => {
        if (!point.discovered) {
          const distance = Math.hypot(point.x - x, point.y - y);
          if (distance < 50) {
            generateClaudeDiscovery(point.x, point.y, point.rarity);

            // Mark as discovered and immediately replace with a new point
            const newPoints = [...discoveryPoints];
            // Keep discoveries away from screen edges
            const margin = 100;
            newPoints[index] = {
              x: margin + Math.random() * (dimensions.width - 2 * margin),
              y: dimensions.height - 10 - Math.random() * 150,
              discovered: false,
              rarity: Math.random()
            };
            setDiscoveryPoints(newPoints);
          }
        }
      });
    }

    // Update grass
    const newGrass = grass.map(blade => {
      const distance = Math.hypot(blade.x - x, blade.baseY - y);
      const radius = 100;

      if (distance < radius) {
        const strength = (radius - distance) / radius;
        const dx = blade.x - x;
        const angle = Math.atan2(dx, 50) * strength * 0.5;

        return {
          ...blade,
          targetAngle: angle
        };
      }

      return {
        ...blade,
        targetAngle: 0
      };
    });

    setGrass(newGrass);
  };

  const handleMouseLeave = () => {
    const newGrass = grass.map(blade => ({
      ...blade,
      targetAngle: 0
    }));
    setGrass(newGrass);
  };

  const startExploring = () => {
    // Resume audio context on user interaction (required by browsers)
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }

    setFadeOut(true);
    setTimeout(() => {
      setGameState('exploring');
      setTimerActive(true);
      setFadeOut(false);
    }, 500);
  };

  const goInside = () => {
    setFadeOut(true);
    setTimeout(() => {
      setGameState('summary');
      setTimerActive(false);
      setFadeOut(false);
    }, 500);
  };

  const resetGame = () => {
    setFadeOut(true);
    setTimeout(() => {
      setGameState('start');
      setElapsedTime(0);
      setCollectedDiscoveries([]);
      setDiscoveries([]);
      setLocation('');
      setDiscoveryTracker({});
      setRecentDiscoveries([]);
      setFadeOut(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Always render the grass background */}
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0 cursor-pointer"
        onMouseMove={handleInteraction}
        onTouchMove={(e) => {
          e.preventDefault();
          handleInteraction(e.touches[0]);
        }}
        onMouseLeave={handleMouseLeave}
        onTouchEnd={handleMouseLeave}
      />

      {/* Glassmorphism overlay for start screen */}
      {gameState === 'start' && (
        <div className={`absolute inset-0 flex items-center justify-center ${timeOfDay === 'night' ? 'bg-black/20' : 'bg-black/5'} backdrop-blur-md transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
          <div className="text-center p-8 bg-white/40 backdrop-blur-lg rounded-3xl shadow-2xl max-w-md mx-4 transform transition-all duration-500 hover:scale-105 border border-white/40">
            <h1 className="text-4xl font-light mb-8 text-gray-700 tracking-tight" style={{ fontFamily: 'Quicksand, sans-serif' }}>
              Time to step outside
            </h1>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed font-light" style={{ fontFamily: 'Quicksand, sans-serif' }}>
              {timeOfDay === 'night'
                ? "The night grass holds its secrets..."
                : timeOfDay === 'dawn'
                ? "Dawn breaks, revealing hidden treasures..."
                : timeOfDay === 'evening'
                ? "Evening settles, bringing new mysteries..."
                : timeOfDay === 'dusk'
                ? "Twilight transforms the grass..."
                : "There's magic waiting in the grass..."}
            </p>

            <div className="mb-8">
              <div className="relative">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="where will you explore?"
                  className="w-full px-4 py-3 text-center bg-white/30 border border-white/40 rounded-full text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-md font-light"
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                />
                <button
                  onClick={shuffleLocation}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                  title="Shuffle location"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>

            <button
              onClick={startExploring}
              className="bg-white/50 backdrop-blur-md hover:bg-white/60 text-gray-700 font-medium py-4 px-8 rounded-full text-xl shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:translate-y-0 border border-white/40"
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Go touch some grass
            </button>
          </div>
        </div>
      )}

      {/* Timer overlay when exploring */}
      {gameState === 'exploring' && (
        <div className={`absolute top-6 left-6 bg-white/40 backdrop-blur-md rounded-2xl p-5 shadow-xl transform transition-all duration-300 hover:scale-105 border border-white/40 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/50 rounded-full p-3">
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-light" style={{ fontFamily: 'Quicksand, sans-serif' }}>Time outside</p>
              <p className="text-2xl font-normal text-gray-700" style={{ fontFamily: 'Quicksand, sans-serif' }}>{formatTime(elapsedTime)}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/50 rounded-full p-3">
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {timeOfDay === 'night' || timeOfDay === 'evening' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                )}
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-light" style={{ fontFamily: 'Quicksand, sans-serif' }}>Time of day</p>
              <p className="text-xl font-normal text-gray-700" style={{ fontFamily: 'Quicksand, sans-serif' }}>{timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}</p>
            </div>
          </div>

          {location && (
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-white/50 rounded-full p-3">
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-light" style={{ fontFamily: 'Quicksand, sans-serif' }}>Location</p>
                <p className="text-xl font-normal text-gray-700" style={{ fontFamily: 'Quicksand, sans-serif' }}>{location}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/50 rounded-full p-3">
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-light" style={{ fontFamily: 'Quicksand, sans-serif' }}>Discoveries</p>
              <p className="text-2xl font-normal text-gray-700" style={{ fontFamily: 'Quicksand, sans-serif' }}>{collectedDiscoveries.length}</p>
            </div>
          </div>

          <button
            onClick={goInside}
            className="w-full bg-white/50 backdrop-blur-md hover:bg-white/60 text-gray-700 font-medium py-3 px-6 rounded-xl shadow-md transform transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 border border-white/40"
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            Go back inside
          </button>
        </div>
      )}

      {/* Glassmorphism overlay for summary screen */}
      {gameState === 'summary' && (
        <div className={`absolute inset-0 flex items-center justify-center ${timeOfDay === 'night' ? 'bg-black/20' : 'bg-black/5'} backdrop-blur-md transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
          <div className="bg-white/40 backdrop-blur-lg rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-500 border border-white/40">
            <h2 className="text-3xl font-light mb-6 text-gray-700 text-center" style={{ fontFamily: 'Quicksand, sans-serif' }}>
              {location ? `Your ${location} grass adventure` : 'Your grass adventure'}
            </h2>

            <div className="flex justify-between mb-8 p-4 bg-white/20 rounded-xl">
              <div className="text-center flex-1">
                <p className="text-sm text-gray-600 uppercase tracking-wider font-light" style={{ fontFamily: 'Quicksand, sans-serif' }}>Time outside</p>
                <p className="text-2xl font-normal text-gray-700 pl-4" style={{ fontFamily: 'Quicksand, sans-serif' }}>{formatTime(elapsedTime)}</p>
              </div>
              <div className="w-px bg-white/30"></div>
              <div className="text-center flex-1">
                <p className="text-sm text-gray-600 uppercase tracking-wider font-light" style={{ fontFamily: 'Quicksand, sans-serif' }}>Discoveries</p>
                <p className="text-2xl font-normal text-gray-700 pr-4" style={{ fontFamily: 'Quicksand, sans-serif' }}>{collectedDiscoveries.length}</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-medium mb-4 text-gray-700 text-lg" style={{ fontFamily: 'Quicksand, sans-serif' }}>Your discoveries</h3>
              <div className="max-h-64 overflow-y-auto bg-white/20 rounded-xl p-4 shadow-inner">
                {collectedDiscoveries.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 font-light" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                      Achievement unlocked: <br />
                      Professional grass avoider
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Group discoveries by rarity */}
                    {['rare', 'uncommon', 'common'].map(rarityLevel => {
                      const rarityDiscoveries = collectedDiscoveries.filter(d => d.rarity === rarityLevel);
                      if (rarityDiscoveries.length === 0) return null;

                      return (
                        <div key={rarityLevel} className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            {rarityLevel === 'rare' && (
                              <span className="text-sm font-light text-gray-500" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                                RARE FINDS
                              </span>
                            )}
                            {rarityLevel === 'uncommon' && (
                              <span className="text-sm font-light text-gray-500" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                                UNCOMMON FINDS
                              </span>
                            )}
                            {rarityLevel === 'common' && (
                              <span className="text-sm font-light text-gray-500" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                                COMMON FINDS
                              </span>
                            )}
                          </div>

                          {rarityDiscoveries.map((discovery, index) => (
                            <div
                              key={index}
                              className={`mb-2 p-3 rounded-lg backdrop-blur-sm shadow-sm transform transition-all duration-300 hover:scale-102 flex items-center justify-between ${
                                rarityLevel === 'rare' ? 'bg-yellow-100/40 hover:bg-yellow-100/60' :
                                rarityLevel === 'uncommon' ? 'bg-blue-100/40 hover:bg-blue-100/60' :
                                'bg-green-100/40 hover:bg-green-100/60'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="font-normal text-gray-700" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                                  {discovery.text}
                                </span>
                              </div>
                              <span className="text-gray-500 text-sm ml-2 font-light" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                                {formatTime(discovery.time)}
                              </span>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>

            <button
              onClick={resetGame}
              className="w-full bg-white/50 backdrop-blur-md hover:bg-white/60 text-gray-700 font-medium py-3 px-6 rounded-full shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:translate-y-0 border border-white/40"
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Go outside again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveGrass;
