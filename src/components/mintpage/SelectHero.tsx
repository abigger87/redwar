import React, { useEffect, useState } from 'react';
import {
  Heading,
  useDisclosure,
  Flex
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";

import { ConnectWallet, NoShadowButton } from "src/components";
import { useWeb3Context } from "src/contexts/Web3Context";

const SelectHero = ({ character, setCharacterNFT }) => {
  const { t } = useTranslation();
  const { isAuthed, balance, web3Context, address, chainId } = useWeb3Context();
  const [characters, setCharacters] = useState(null);
  const [waitingForMint, setWaitingForMint] = useState(false);
  const [mintingCharacter, setMintingCharacter] = useState(null);

  // ** Refactored function to check if the user has an nft **
  const fetchNFTMetadata = async () => {
    const tempCharacter = await web3Context.checkIfUserHasNFT(address);
    setCharacterNFT(tempCharacter)
  };

  // ** Refactored function to get the list of characters available to mint **
  const fetchCharacters = async () => {
    const characters = await web3Context.getAllDefaultCharacters(address);
    setCharacters(characters)
  }

  // ** Add a callback method that will fire when this event is received **
  // const onCharacterMint = async (sender, tokenId, characterIndex) => {
  //   console.log(
  //     `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId !== null || tokenId !== undefined ? parseInt(tokenId) : 'UNKNOWN'} characterIndex: ${characterIndex !== null || characterIndex !== undefined ? parseInt(characterIndex) : 'UNKNOWN'}`
  //   );

  //   // ** Once our character NFT is minted we can fetch the metadata from our contract **
  //   // ** and set it in state to move onto the Arena **
  //   await fetchNFTMetadata();

  //   if(waitingForMint) {
  //     setWaitingForMint(false);
  //     toast(`💰 Successfully minted ${mintingCharacter ? mintingCharacter.name : 'UNKNOWN'} 💰`, {
  //       position: "bottom-center",
  //       autoClose: 3000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //     });
  //   }
  // };

  // ** Callback for Transaction Submission **
  const onTxSubmitted = async (e) => {
    toast('🚀 Transaction Submitted 🚀 ', {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  // ** Callback for Transaction Confirmation **
  const onTxConfirmed = async (e) => {
    // ** Once our character NFT is minted we can fetch the metadata from our contract **
    // ** and set it in state to move onto the Arena **
    await fetchNFTMetadata();

    // ** Then, let's toast **
    toast.success(`💰 Successfully minted ${mintingCharacter ? mintingCharacter.name : 'UNKNOWN'} 💰`, {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
  };

  // ** Callback for Transaction Failed **
  const onTxFailed = async (e) => {
    toast.error('❌ Transaction Failed ❌', {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }

  // ** User Rejection Callback **
  const userRejectedCallback = async (e) => {
    toast.warn('❌ Transaction Rejected ❌', {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }

  // ** On address of chainId change, and authed, call hooks **
  useEffect(() => {
    if (isAuthed) {
      // ** Add a callback listener for minting events **
      // web3Context.addCharacterNFTMintedEventListener(onCharacterMint);
      
      // ** Fetch the NFT Metadata **
      fetchNFTMetadata();

      // ** Fetch the default Characters **
      fetchCharacters();
    }

    // ** Remove on component dismount **
    // return () => {
    //   web3Context.removeCharacterNFTMintedEventListener(onCharacterMint);
    // }
  }, [address, chainId]);

  const mintCharacterNFTAction = (characterId) => async () => {
    setMintingCharacter(characters[characterId]);
    const name_to_mint = characters[characterId].name;
    const mint_result = await web3Context.mintCharacterNFT(
      characterId,
      address,
      onTxSubmitted,
      onTxFailed,
      onTxConfirmed,
      userRejectedCallback
    );
  };

  return (
    <SelectHeroContainer>
      <Heading as="h2" pb="1em">Mint Your Hero. Choose wisely.</Heading>
      <Flex
        flexWrap="wrap"
        justifyContent="center"
      >
        {characters !== null ? characters.map((character, index) => (
          <CharacterItem key={character.name}>
            <CharacterStatsContainer>
              <CharacterStatsCode>
                <CharacterItemP>{character.name}</CharacterItemP>
              </CharacterStatsCode>
              <CharacterStatsCode>
                <CharacterItemP>Attack: {character.attackDamage}</CharacterItemP>
              </CharacterStatsCode>
              <CharacterStatsCode>
                <CharacterItemP>HP: {character.hp}</CharacterItemP>
              </CharacterStatsCode>
              <CharacterStatsCode>
                <CharacterItemP>Max HP: {character.maxHp}</CharacterItemP>
              </CharacterStatsCode>
            </CharacterStatsContainer>
            <CharacterItemImage src={character.imageURI} alt={character.name} />
            <CharacterMintButton
              type="button"
              onClick={mintCharacterNFTAction(index)}
            >{`Mint ${character.name}`}</CharacterMintButton>
          </CharacterItem>
        )) : ('')}
      </Flex>
    </SelectHeroContainer>
  );
};

const SelectHeroContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
`;

const CharacterItem = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  justify-self: center;
  align-self: center;
  margin: 1em;
`;

const CharacterMintButton = styled.button`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 40px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border: none;
  cursor: pointer;
  background-color: rgb(32, 129, 226);
  color: white;
  font-weight: bold;
  font-size: 16px;
`;

const CharacterStatsContainer = styled(Flex)`
  position: absolute;
  display: flex;
  flex-direction: column;
  width: auto;
`;

const CharacterStatsCode = styled.div`
  background-color: #838383;
  border-radius: 5px;
  margin: 10px;
  width: auto;
`;

const CharacterItemP = styled.p`
  margin: 0;
  padding: 5px 10px 5px 10px;
  font-weight: bold;
  width: auto;
`;

const CharacterItemImage = styled.img`
  height: 300px;
  width: 350px;
  border-radius: 10px;
  object-fit: cover;
`;

export default SelectHero;
