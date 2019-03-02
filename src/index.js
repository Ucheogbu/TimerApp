import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import registerServiceWorker from './registerServiceWorker';
import TimerDashboard from './App';

ReactDOM.render(<TimerDashboard />, document.getElementById('root'));
registerServiceWorker();
