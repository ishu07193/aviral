import React, { useEffect, useRef, useState } from "react";

const App = () => {
  const chartRef = useRef(null);
  const [price, setPrice] = useState(0);
  const [pnl, setPnl] = useState(0);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [entryPrice, setEntryPrice] = useState(null);

  useEffect(() => {
    const widget = new window.TradingView.widget({
      container_id: "tvchart",
      symbol: "CBOE:AAPL",
      interval: "1",
      theme: "light",
      style: "1",
      locale: "en",
      toolbar_bg: "#f1f3f6",
      hide_side_toolbar: false,
      withdateranges: true,
      enable_publishing: false,
      allow_symbol_change: true,
      autosize: true,
    });

    widget.onChartReady(() => {
      const symbol = widget.activeChart().symbol();
      widget.activeChart().onDataLoaded().subscribe(null, () => {
        widget.activeChart().onSymbolChanged().subscribe(null, () => {
          setPrice(0);
        });

        widget.activeChart().onRealtimeUpdate().subscribe(null, () => {
          const lastBar = widget.activeChart()._model._mainSeries._bars._items.slice(-1)[0];
          if (lastBar && lastBar.v && lastBar.v[4]) {
            setPrice(lastBar.v[4]);
          }
        });
      });
    });
  }, []);

  const handleBuy = () => {
    const time = new Date().toLocaleTimeString();
    setTradeHistory((prev) => [...prev, `${time} — Buy @ ₹${price.toFixed(2)}`]);
    setEntryPrice(price);
  };

  const handleSell = () => {
    const time = new Date().toLocaleTimeString();
    setTradeHistory((prev) => [...prev, `${time} — Sell @ ₹${price.toFixed(2)}`]);
    if (entryPrice !== null) {
      const profit = price - entryPrice;
      setPnl((prev) => prev + profit);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Trading Chart Demo</h1>
      <div id="tvchart" ref={chartRef} className="w-full max-w-4xl h-[500px] mb-4"></div>
      <div className="mb-4 text-xl">Current Price: ₹{price.toFixed(2)}</div>
      <div className="mb-4 text-xl">Current PnL: ₹{pnl.toFixed(2)}</div>
      <div className="space-x-4 mb-6">
        <button onClick={handleBuy} className="px-4 py-2 bg-blue-500 text-white rounded">
          Buy
        </button>
        <button onClick={handleSell} className="px-4 py-2 bg-red-500 text-white rounded">
          Sell
        </button>
      </div>
      <div className="text-left w-full max-w-md">
        <h2 className="text-xl font-semibold mb-2">Trade History</h2>
        <ul className="list-disc list-inside">
          {tradeHistory.map((entry, idx) => (
            <li key={idx}>{entry}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
