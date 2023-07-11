class Character {
  constructor(name, level, health, drops) {
    this.name = name;
    this.level = level;
    this.health = health;
    this.drops = drops;
  }

  getName() {
    return this.name;
  }

  getLevel() {
    return this.level;
  }

  getHealth() {
    return this.health;
  }

  getDrops() {
    return this.drops;
  }

  attack() {
    console.log("Attacking...");
  }
}

class Boss extends Character {
  constructor(name, level, health, drops, image) {
    super(name, level, health, drops);
    this.image = image;
  }

  attack() {
    console.log(`${this.getName()} attacking...`);
  }

  getImage() {
    return this.image;
  }
}

function fetchBossData() {
  return fetch('https://eldenring.fanapis.com/api/bosses')
    .then(response => response.json())
    .catch(error => {
      console.error('Error:', error);
    });
}

function generateRandomBoss(bossData) {
  const randomIndex = Math.floor(Math.random() * bossData.data.length);
  const boss = bossData.data[randomIndex];
  const bossName = boss.name;
  const bossLevel = boss.level;
  const bossHealth = boss.health;
  const bossDrops = boss.drops;
  const bossImage = boss.image;

  return new Boss(bossName, bossLevel, bossHealth, bossDrops, bossImage);
}

function displayBossImage(imageUrl, bossName) {
  const bossContainer = $('<div>').addClass('boss-container');
  const nameElement = $('<div>').addClass('boss-name').text(bossName);
  const imageElement = $('<img>').attr('src', imageUrl).addClass('boss-image');

  bossContainer.append(nameElement, imageElement);
  $('#bossImagesContainer').append(bossContainer);
}

function displayWinner(bossName) {
  const bossContainers = $('.boss-container');
  bossContainers.each(function() {
    const nameElement = $(this).find('.boss-name');
    if (nameElement.text() === bossName) {
      $('<div>').addClass('boss-winner').text('Winner').appendTo($(this));
      return false;
    }
  });
}

function initiateBattle(boss1, boss2) {
  console.log(`${boss1.getName()} (${boss1.getDrops()}) vs ${boss2.getName()} (${boss2.getDrops()})`);

  boss1.attack();
  boss2.attack();

  const boss1Drops = boss1.getDrops();
  const boss2Drops = boss2.getDrops();

  if (boss1Drops >= boss2Drops) {
    console.log(`${boss1.getName()} wins the battle!`);
    displayWinner(boss1.getName());
    sessionStorage.setItem('winnerImage', boss1.getImage());
  } else if (boss2Drops >= boss1Drops) {
    console.log(`${boss2.getName()} wins the battle!`);
    displayWinner(boss2.getName());
    sessionStorage.setItem('winnerImage', boss2.getImage());
  } else {
    console.log("It's a tie!");
  }
}

function startBattle() {
  const bossImagesContainer = $('#bossImagesContainer');
  bossImagesContainer.empty();

  fetchBossData()
    .then(bossData => {
      const boss1 = generateRandomBoss(bossData);
      const boss2 = generateRandomBoss(bossData);

      displayBossImage(boss1.getImage(), boss1.getName());
      displayBossImage(boss2.getImage(), boss2.getName());

      initiateBattle(boss1, boss2);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function finishBattle() {
  const winnerImage = sessionStorage.getItem('winnerImage');
  if (winnerImage) {
    const bossImagesContainer = $('#bossImagesContainer');
    bossImagesContainer.html('');

    const winnerImageElement = $('<img>').attr('src', winnerImage).addClass('boss-image');
    const winnerContainer = $('<div>').addClass('boss-container');
    const winnerNameElement = $('<div>').addClass('boss-name').text('Winner');

    winnerContainer.append(winnerNameElement, winnerImageElement);
    bossImagesContainer.append(winnerContainer);
  }
}
