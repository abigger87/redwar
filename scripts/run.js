const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame');
  // ** Creates a local network and deploys the contract
  // ** This network will be destroyed when this script is done executing
  const gameContract = await gameContractFactory.deploy(
    // Names
    [
      "Matthias",
      "Vitch",
      "Cheesethief",
      "DarkClaw",
      "Methuselah",
      "Friar Hugo",
      "Abbott Mortimer",
      "Fangburn",
      "Deadnose"
    ],
    // Images
    [
      "https://i.ibb.co/yBXfFHv/Matthias.webp",
      "https://i.ibb.co/MSWtV8w/Vitch.webp",
      "https://i.ibb.co/vVPCVzW/Cheesethief.webp",
      "https://i.ibb.co/0hxQSyM/Darkclaw.webp",
      "https://i.ibb.co/MNT3g5H/Methuselah.webp",
      "https://i.ibb.co/k39HcNH/Friar-Hugo.webp",
      "https://i.ibb.co/N172k9T/Abbot-Mortimer.webp",
      "https://i.ibb.co/JHFyvyY/Fangburn.webp",
      "https://i.ibb.co/9HDFFWf/Deadnose.webp"
    ],
    // uploads
    // [
    //   "https://ibb.co/93N8HQK",
    //   "https://ibb.co/8sTf5zv",
    //   "https://ibb.co/XjsfjJP",
    //   "https://ibb.co/ChfWZK7",
    //   "https://ibb.co/cT57yX9",
    //   "https://ibb.co/YDyRjHR",
    //   "https://ibb.co/JxCjbv3",
    //   "https://ibb.co/894drdy",
    //   "https://ibb.co/XxQhhtd"
    // ],
    // HP values
    [
      800,
      300,
      200,
      400,
      600,
      300,
      400,
      700,
      500
    ],
    // Attack damage values
    [
      200,
      75,
      90,
      150,
      125,
      20,
      55,
      170,
      120,
    ],
    "Slager The Cruel", // Boss name
    "https://i.ibb.co/6BK1jHL/Slager-The-Cruel.jpg", // Boss image
    // Boss imgbb link: https://ibb.co/TLQb94d
    2000, // Boss hp
    75 // Boss attack damage
  );
  await gameContract.deployed();
  console.log("Contract deployed to:", gameContract.address);

  let txn;

  // We only have three characters.
  // an NFT w/ the character at index 2 of our array.
  txn = await gameContract.mintCharacterNFT(2);
  await txn.wait();

  // Get the value of the NFT's URI.
  let returnedTokenUri = await gameContract.tokenURI(1);
  console.log("Token URI:", returnedTokenUri);

  // let's test attacking the boss!
  txn = await gameContract.attackBoss();
  await txn.wait();
  txn = await gameContract.attackBoss();
  await txn.wait();
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();