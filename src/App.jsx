import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

export default function App() {
  const chartContainerRef = useRef();

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: { background: { color: '#ffffff' }, textColor: '#333' },
      grid: { vertLines: { color: '#eee' }, horzLines: { color: '#eee' } },
    });

    const candlestickSeries = chart.addCandlestickSeries();

    candlestickSeries.setData([
      { time: '2025-07-22', open: 3720, high: 3750, low: 3700, close: 3740 },
      { time: '2025-07-23', open: 3740, high: 3760, low: 3730, close: 3745 },
      { time: '2025-07-24', open: 3745, high: 3780, low: 3740, close: 3775 },
      { time: '2025-07-25', open: 3775, high: 3790, low: 3750, close: 3760 },
    ]);

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  const handleTrade = (type) => {
    alert(`${type} order placed (demo)`);
  };

  return (
    <div style={{ maxWidth: '900px', margin: 'auto', padding: '20px' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Trading Chart Demo</h1>
      <div ref={chartContainerRef} style={{ marginBottom: '20px' }} />
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <button onClick={() => handleTrade('Buy')} style={{ background: 'green', color: 'white', padding: '10px 20px' }}>Buy</button>
        <button onClick={() => handleTrade('Sell')} style={{ background: 'red', color: 'white', padding: '10px 20px' }}>Sell</button>
      </div>
    </div>
  );
}