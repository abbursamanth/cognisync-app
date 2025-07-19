import React from 'react';
import { Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

interface Props {
  data: number[];
}

export default function EEGGraph({ data }: Props) {
  // Generate highly detailed, dynamic wave patterns
  const generateWaveData = (baseData: number[], type: 'alpha' | 'beta' | 'gamma') => {
    const now = Date.now() / 1000; // Current time for continuous flow
    
    const patterns = {
      alpha: {
        baseFreq: 0.4,
        microFreqs: [0.8, 1.2, 1.7, 2.1],
        baseAmp: 35,
        microAmps: [0.4, 0.3, 0.2, 0.15],
        noiseScale: 0.8
      },
      beta: {
        baseFreq: 0.6,
        microFreqs: [1.1, 1.5, 2.0, 2.4],
        baseAmp: 28,
        microAmps: [0.35, 0.25, 0.2, 0.15],
        noiseScale: 0.6
      },
      gamma: {
        baseFreq: 0.8,
        microFreqs: [1.4, 1.8, 2.3, 2.7],
        baseAmp: 22,
        microAmps: [0.3, 0.2, 0.15, 0.1],
        noiseScale: 0.4
      }
    };
    
    const { baseFreq, microFreqs, baseAmp, microAmps, noiseScale } = patterns[type];
    
    return baseData.map((_, i) => {
      const x = i / baseData.length;
      const t = x * Math.PI * 2 + now;
      let value = 0;
      
      // Base wave
      value += Math.sin(t * baseFreq) * baseAmp;
      
      // Add micro-variations
      microFreqs.forEach((freq, idx) => {
        const microT = t + Math.sin(x * Math.PI * (idx + 1)) * 0.2;
        value += Math.sin(microT * freq) * baseAmp * microAmps[idx];
        // Add subtle phase shifts
        value += Math.sin(microT * freq * 1.1 + Math.cos(t)) * baseAmp * microAmps[idx] * 0.5;
      });
      
      // Add controlled random noise for micro-details
      const noise = (Math.sin(t * 50 + x * 100) + Math.sin(t * 30 + x * 80)) * noiseScale;
      value += noise;
      
      return value;
    });
  };

  // Create three distinct wave patterns
  const alpha = generateWaveData(data, 'alpha');
  const beta = generateWaveData(data, 'beta');
  const gamma = generateWaveData(data, 'gamma');

  return (
    <LineChart
      data={{
        labels: [],
        datasets: [
          { data: alpha, color: () => 'rgba(0, 0, 0, 0.45)' },
          { data: beta, color: () => 'rgba(0, 0, 0, 0.35)' },
          { data: gamma, color: () => 'rgba(0, 0, 0, 0.25)' }
        ],
      }}
      width={screenWidth + 60} // Further increased width for better edge coverage
      height={320} // Increased height for more pronounced waves
      withDots={false}
      withInnerLines={false}
      withOuterLines={false}
      withVerticalLabels={false}
      withHorizontalLabels={false}
      withShadow={false}
      segments={0}
      chartConfig={{
        backgroundColor: 'transparent',
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        strokeWidth: 2.5, // Increased thickness
        propsForBackgroundLines: {
          strokeWidth: 0
        },
        propsForDots: {
          r: '0'
        },
        useShadowColorFromDataset: true
      }}
      bezier
      style={{
        position: 'absolute',
        left: -20, // Increased offset to ensure waves touch the left edge
        backgroundColor: 'transparent',
        paddingHorizontal: 0,
        paddingVertical: 0,
        margin: 0
      }}
    />
  );
}
