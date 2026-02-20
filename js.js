let wins = 0;
let losses = 0;
let streak = 0;
let fieldData;
let socket;
let disconnectedForcibly;

window.addEventListener('onEventReceived', function (obj) {
  const listener = obj.detail.listener;
  const event = obj.detail.event;

  if (listener == "message") {
    let isMod = event.data.badges.find(badge => badge.type == "moderator");

    let [command, subcommand, ...args] = event.data.text.split(" ");
    // {Potential for commands here in the future.
  }

  else if (event.listener == "widget-button") {
    if (event.field == "add1Win") updateRecord(wins + 1, losses, streak + 1);
    if (event.field == "add1Loss") updateRecord(wins, losses + 1, 0);
    if (event.field == "remove1Win") updateRecord(Math.max(0, wins - 1), losses, streak);
    if (event.field == "remove1Loss") updateRecord(wins, Math.max(0, losses - 1), streak);
    if (event.field == "reset") updateRecord(0, 0, 0);
  }
});

window.addEventListener('onWidgetLoad', async function (obj) {
  fieldData = obj.detail.fieldData;
  let username = obj.detail.channel.username;
  await loadState();

  if (!fieldData.accounts) return;

  // Slight delay to avoid spamming API when changing variables
  setTimeout(() => {
    startSocket(username, fieldData.token);
  }, 2000)

  if (fieldData.resetWhenOffline) {
    checkLastOnline(username);
    setInterval(async () => {
      checkLastOnline(username);
    }, 301000) // 5m 1s - Cache for this endpoint is 5m
  }

  // Just in case we somehow get completely disconnected accidentally
  setInterval(() => {
    if (!disconnectedForcibly) startSocket(username, fieldData.token);
  }, 10000)
});

/**
 * Socket Connection
 */
function startSocket(username, token) {
  if (socket?.active) return;

  socket = io('https://api.lati00lati.org/clashroyale', {
    transports: ['websocket'],
    auth: {
      username: username,
      token: token,
    }
  });

  socket.on('connect', () => {
    let accounts = fieldData.accounts.split(",");
    for (let i = 0; i < accounts.length; i++) {
      socket.emit('subscribeToPlayer', { tag: accounts[i] });
    };
  });

  socket.on('battle_result', (data) => {
    console.log('Received battle_result')
    let result = data.result;
    let battle = data.battle;

    if (result == 'win') updateRecord(wins + 1, losses, streak + 1)
    else if (result == 'loss') updateRecord(wins, losses + 1, 0)
    else if (result == 'tie') { }
  });

  socket.on('kick', (data) => {
    let error = data.error;
    let message = data.message;

    disconnectedForcibly = true;
    setText(error)
    console.log(`Error: ${message}`)
  })

  socket.on("connect_error", (err) => {
    console.log("Failed to connect: " + err)
  });

  socket.on('disconnect', (reason) => {
    switch (reason) {
      case 'io server disconnect':
        console.log("Server disconnected.");
        break

      case 'io client disconnect':
        console.log("Client disconnected.");
        break

      case 'reconnect failed':
        console.log("Failed to reconnect.");
        break

      default:
        console.log(reason);
        break

    }
  });
}

async function checkLastOnline(username) {
  if (wins == 0 && losses == 0) return;
  
  let response = await fetch(`https://decapi.me/twitch/uptime/${username}`);
  let uptime = await response.text();

  if (!uptime.includes("offline")) await SE_API.store.set("last_online", Date.now());
  else {
    let lastOnline = (await SE_API.store.get("last_online"))?.value ?? 0;
    if (Date.now() - lastOnline > 900000) { // 15m offline grace period for temporary disconnects
      updateRecord(0, 0, 0);
    }
  }
}

async function updateRecord(newWins, newLosses, newStreak) {
  wins = newWins;
  losses = newLosses;
  streak = newStreak;

  let totalWins = wins + fieldData.initialWins;
  let totalLosses = losses + fieldData.initialLosses;

  let newText = fieldData.displayText.replace("{wins}", totalWins).replace("{losses}", totalLosses).replace("{streak}", streak);

  setText(newText);
  saveState();
}

function setText(text) {
  document.getElementById("winstreak_text").innerHTML = text;
}

function saveState() {
  SE_API.store.set('lati_winstreak', {
    wins: wins,
    losses: losses,
    streak: streak,
  });
}

async function loadState() {
  let savedData = await SE_API.store.get('lati_winstreak');
  wins = savedData?.wins ?? 0;
  losses = savedData?.losses ?? 0;
  streak = savedData?.streak ?? 0;
  await updateRecord(wins, losses, streak);
}
