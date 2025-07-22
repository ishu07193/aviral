import React, { useState } from 'react';
import './App.css';

function App() {
  const [position, setPosition] = useState(null);
  const [entryPrice, setEntryPrice] = useState(null);
  const [pnl, setPnl] = useState(0);
  const [tradeHistory, setTradeHistory] = useState([]);

  // Fake current price - later link it to actual chart
  const [currentPrice, setCurrentPrice] = useState(3750 + Math.random() * 100);

  function handleBuy() {
    if (!position) {
      setPosition("long");
      setEntryPrice(currentPrice);
      addTrade("Buy", currentPrice);
    }
  }

  function handleSell() {
    if (position === "long") {
      const profit = currentPrice - entryPrice;
      setPnl(prev => prev + profit);
      setPosition(null);
      setEntryPrice(null);
      addTrade("Sell", currentPrice);
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
        src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview_7e6e3&symbol=NASDAQ:AAPL&interval=5&hidesidetoolbar=1&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=[]&theme=Light&style=1&timezone=Etc/UTC&withdateranges=1&hidevolume=1&hidelegend=1&hideideas=1&enabled_features=[]&disabled_features=[]&locale=en&utm_source=aviral.vercel.app"
        width="100%"
        height="400"
        frameBorder="0"
        allowTransparency
        scrolling="no"
      ></iframe>

      <div className="price-info">
        <p>Current Price: ₹{currentPrice.toFixed(2)}</p>
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
