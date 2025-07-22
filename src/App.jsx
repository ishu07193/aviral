import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [position, setPosition] = useState(null);
  const [entryPrice, setEntryPrice] = useState(null);
  const [pnl, setPnl] = useState(0);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [livePrice, setLivePrice] = useState(0);

  // 🧠 Connect to Binance WebSocket for live BTC price
  useEffect(() => {
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setLivePrice(parseFloat(data.p));
    };

    return () => ws.close(); // Cleanup on unmount
  }, []);

  function handleBuy() {
    if (!position) {
      setPosition("long");
      setEntryPrice(livePrice);
      addTrade("Buy", livePrice);
    }
  }

  function handleSell() {
    if (position === "long") {
      const profit = livePrice - entryPrice;
      setPnl(prev => prev + profit);
      setPosition(null);
      setEntryPrice(null);
      addTrade("Sell", livePrice);
    }
  }

  function addTrade(type, price) {
    setTradeHistory(prev => [
      ...prev,
      {
        type,
        price: price.toFixed(2),
        time: new Date().toLocaleTimeString()
      }
    ]);
  }

  return (
    <div className="container">
      <h1>Trading Chart Demo</h1>

      <iframe
        title="TradingView Widget"
        src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview_7e6e3&symbol=BINANCE:BTCUSDT&interval=5&hidesidetoolbar=1&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=[]&theme=Light&style=1&timezone=Etc/UTC&withdateranges=1&hidevolume=1&hidelegend=1&hideideas=1&enabled_features=[]&disabled_features=[]&locale=en&utm_source=aviral.vercel.app"
        width="100%"
        height="400"
        frameBorder="0"
        allowTransparency
        scrolling="no"
      ></iframe>

      <div className="price-info">
        <p>Live Price (BTCUSDT): ₹{livePrice.toFixed(2)}</p>
        <p>Current PnL: ₹{pnl.toFixed(2)}</p>
      </div>

      <div className="btns">
        <button onClick={handleBuy} className="buy">Buy</button>
        <button onClick={handleSell} className="sell">Sell</button>
      </div>

      <h3>Trade History</h3>
      <ul className="history">
        {tradeHistory.map((trade, index) => (
          <li key={index}>
            {trade.time} — {trade.type} @ ₹{trade.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
