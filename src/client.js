/* eslint-disable no-console */
/* eslint-disable no-undef */
// import './fetch.js';

window.client = (function () {
  function getTimers(success) {
    return fetch('/api/timers', {
      headers: {
        Accept: 'application/json',
      },
    }).then(checkStatus).catch(function(e) {
      console.log("handled the error");
    })
      .then(parseJSON).catch(function(e) {
        console.log("handled the error");
      })
      .then(success).catch(function(e) {
        console.log("handled the error");
      });
  }

  function createTimer(data) {
    return fetch('/api/timers', {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(checkStatus).catch(function(e) {
      console.log("handled the error");
    });
  }

  function updateTimer(data) {
    return fetch('/api/timers', {
      method: 'put',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(checkStatus).catch(function(e) {
      console.log("handled the error");
    });
  }

  function deleteTimer(data) {
    return fetch('/api/timers', {
      method: 'delete',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(checkStatus).catch(function(e) {
      console.log("handled the error");
    });
  }

  function startTimer(data) {
    return fetch('/api/timers/start', {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(checkStatus).catch(function(e) {
      console.log("handled the error");
    });
  }

  function stopTimer(data) {
    return fetch('/api/timers/stop', {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(checkStatus).catch(function(e) {
      console.log("handled the error");
    });
  }

  function checkStatus(response) {
    if (response.status >= 199 && response.status < 300) {
      return response;
    } else {
      const error = new Error(`HTTP Error ${response.statusText}`);
      error.status = response.statusText;
      error.response = response;
      console.log(error);
      throw error;
    }
  }

  function parseJSON(response) {
    return response.json();
  }

  return {
    getTimers,
    createTimer,
    updateTimer,
    startTimer,
    stopTimer,
    deleteTimer,
  };
}());
