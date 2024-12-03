const axios = require('axios');
const fs = require('fs');
const chalk = require('chalk');

// Header with ASCII Art
function printHeader() {
  const header = `
+===========================+
+                    _ _    +
+    ___ _____ ___  |_|_|   +
+   | -_|     | . | | | |   +
+   |___|_|_|_|___|_| |_|   +
+   -@copycatcodex|___|     +
+===========================+
`;
  console.log(chalk.green.bold(header));
}

// Logging Helper Functions
const log = {
  info: (message) => console.log(chalk.cyan(`    ├─ ${message}`)),
  success: (message) => console.log(chalk.green(`    ├─ ${message}`)),
  error: (message) => console.log(chalk.red(`    ├─ ${message}`)),
  section: (message) => console.log(chalk.bold.yellow(`==${message}`)),
  game: (index, gameName) =>
    console.log(chalk.magenta(`    Game ${index}: Play game: ${gameName}`)),
  gameResult: (pointsWon, message) => {
    console.log(chalk.cyan(`        ├─ ${message}`));
    console.log(chalk.yellow(`        ├─ Points won: ${pointsWon}`));
  },
};

// Read Data from `data.json`
const accountData = JSON.parse(fs.readFileSync('data.json', 'utf-8'));

// Helper Functions
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Create Axios Instance
const createAxiosInstance = (userAgent) => {
  return axios.create({
    headers: {
      'User-Agent': userAgent,
    },
  });
};

// Login Function
const login = async (queryId, userAgent) => {
  const axiosInstance = createAxiosInstance(userAgent);

  try {
    const response = await axiosInstance.post('https://emojiapp.xyz/api/auth', {
      initData: queryId,
      refererId: null,
    });

    const user = response.data.user;
    const token = response.data.token;

    log.success(`Logged in as ${user.username} (${user.nameSurname})`);
    return { token, amountOfTickets: user.amountOfTickets, axiosInstance };
  } catch (error) {
    log.error(`Login failed for queryId: ${queryId}`);
    return null;
  }
};

// Check Free Ticket
const checkFreeTicket = async (token, axiosInstance) => {
  try {
    const response = await axiosInstance.post(
      'https://emojiapp.xyz/api/users/free-tickets-eligibility',
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.canClaim) {
      log.info('Free ticket available to claim');
      await claimFreeTicket(token, axiosInstance);
    } else {
      log.info('Cannot claim free ticket at the moment.');
    }
  } catch (error) {
    log.error('Error checking free ticket');
  }
};

// Claim Free Ticket
const claimFreeTicket = async (token, axiosInstance) => {
  try {
    const response = await axiosInstance.post(
      'https://emojiapp.xyz/api/users/claim-free-tickets',
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.data.success) {
      log.success('Tickets claimed successfully!');
    }
  } catch (error) {
    log.error('Error claiming free ticket');
  }
};

// Fetch Quests
const fetchQuests = async (token, axiosInstance) => {
  try {
    const response = await axiosInstance.get('https://emojiapp.xyz/api/quests', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const quests = response.data.quests;
    const availableQuests = {
      daily: quests.daily.filter((q) => !q.completed && q.option !== 'PAYMENT'),
      oneTime: quests.oneTime.filter((q) => !q.completed && q.option !== 'PAYMENT'),
      special: quests.special.filter((q) => !q.completed && q.option !== 'PAYMENT'),
    };

    log.info('Available quests: { daily: [...], oneTime: [...], special: [...] }');
    return availableQuests;
  } catch (error) {
    log.error('Error fetching quests');
  }
};

// Claim Quest
const claimQuest = async (token, questId, axiosInstance) => {
  try {
    const response = await axiosInstance.get(
      `https://emojiapp.xyz/api/quests/verify?questId=${questId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.message === 'Quest completed and reward granted') {
      const user = response.data.user;
      log.success(`Quest completed. New ticket count: ${user.amountOfTickets}`);
    }
  } catch (error) {
    log.error('Error claiming quest');
  }
};

// Play Games
const playGames = async (token, amountOfTickets, axiosInstance) => {
  if (amountOfTickets === 0) {
    log.info('No game to play. Tickets are 0.');
    return;
  }

  const getRandomGame = () => {
    const games = ['Darts', 'Football', 'Basketball'];
    return games[Math.floor(Math.random() * games.length)];
  };

  for (let i = 0; i < amountOfTickets; i++) {
    const gameName = getRandomGame();
    log.game(i + 1, gameName);

    try {
      const response = await axiosInstance.post(
        'https://emojiapp.xyz/api/play',
        { gameName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data) {
        const { pointsWon, message } = response.data;
        log.gameResult(pointsWon, message);
      }
    } catch (error) {
      log.error(`Failed to play game: ${gameName}`);
    }

    await delay(3000);
  }
};

// Main Function
const main = async () => {
  printHeader();
  let accountIndex = 1;

  for (const { queryId, userAgent } of accountData) {
    log.section(`Processing Account #${accountIndex}`);

    const loginResult = await login(queryId, userAgent);
    if (!loginResult) {
      accountIndex++;
      continue;
    }

    const { token, amountOfTickets, axiosInstance } = loginResult;

    await checkFreeTicket(token, axiosInstance);

    const availableQuests = await fetchQuests(token, axiosInstance);
    for (const quest of availableQuests.daily) {
      await claimQuest(token, quest.id, axiosInstance);
    }

    await playGames(token, amountOfTickets, axiosInstance);

    console.log(`\n    Account #${accountIndex} processing completed.`);
    console.log('=======================================\n');
    accountIndex++;
  }

  console.log(chalk.green.bold('✔ All accounts completed. Wait 4 hours before restarting.'));
  await delay(14400000);
  console.log(chalk.blue.bold('🔁 Restarting process...'));
  main();
};

// Start the Process
main();
