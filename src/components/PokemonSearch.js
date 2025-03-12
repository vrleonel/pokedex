// src/components/PokemonSearch.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { deepSeek } from '../services/deepseek';
import { pronunciations } from '../data/pronunciations';

import { saveConfigToLocalStorage, getConfigFromLocalStorage } from '../utils/localStorage';
import { speakText } from '../utils/speech';

import './style.scss';

const PokemonSearch = () => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [pokemon, setPokemon] = useState(null);
  const [error, setError] = useState('');
  const [evolutionData, setEvolutionData] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pokedexId = params.get('id')?.toLowerCase();
    const speakConfig = params.get('speak');
    const debugParam = params.get('debug');

    if(speakConfig) saveConfigToLocalStorage('speak', speakConfig);

    if(debugParam) saveConfigToLocalStorage('debug', (debugParam === 'true' || debugParam === '1') ? 1 : 0);

    if (pokedexId) {
      saveConfigToLocalStorage('pokedexId', pokedexId);
      fetchPokemonData(pokedexId);
    }
  }, []);

  useEffect(() => {
    const configSpeak = getConfigFromLocalStorage('speak');

    if(pokemon && pokemon.id && configSpeak !== 'false') {
      const phoneticName = pronunciations[pokemon.id -1 ]?.pronunciation;
      if (phoneticName) {
        speakText(phoneticName);
      }
    }
  }, [pokemon]);


  const getStringId = (id) => {
    return `#${id?.toString().padStart(4, '0')}`;
  }
  const identifyPokemon = async (description) => {
    try {
      setLoading(true);
      const response = await deepSeek(description);

      setLoading(false);
      const responseJson = JSON.parse(response);
      const pokemonName = responseJson.pokedex;

      return pokemonName;
    } catch (err) {
      console.error('Erro ao identificar o Pokémon:', err);
      return null;
    }
  };

  const fetchPokemonData = async (pokemonId) => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
      setPokemon(response.data);
      setError('');
      const evolutions = await fetchEvolutions(response.data.id);
      setEvolutionData(evolutions);
    } catch (err) {
      setError('Pokémon não encontrado.', err)
      setPokemon(null);
      setEvolutionData(null);
    }
  };

  const fetchEvolutions = async (pokemonId) => {
    try {
      const speciesResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
      const evolutionChainUrl = speciesResponse.data.evolution_chain.url;
      const speciesDataVarieties = speciesResponse.data.varieties;

      console.log('speciesDataVarieties', speciesDataVarieties);
      const evolutionResponse = await axios.get(evolutionChainUrl);

      const parseEvolutionChain = async (chain) => {
        const pokemonName = chain.species.name;
        const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        const imageUrl = pokemonResponse.data.sprites.other['official-artwork'].front_default;
        const id = pokemonResponse.data.id;

        const evolutionData = {
          id,
          name: pokemonName,
          image: imageUrl, // Adicionando a URL da imagem
          evolvesTo: []
        };

        // Se houver múltiplas evoluções, percorre cada uma delas
        if (chain.evolves_to && chain.evolves_to.length > 0) {
          evolutionData.evolvesTo = await Promise.all(
            chain.evolves_to.map((evolution) => parseEvolutionChain(evolution))
          );
        }

        return evolutionData;
      };

      return await parseEvolutionChain(evolutionResponse.data.chain);
    } catch (err) {
      console.error('Erro ao buscar evoluções:', err);
      return null;
  }
  };

  const handleVoiceSearch = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'pt-BR';
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setDescription(transcript);
      handleSearch(transcript);
    };
    recognition.start();
  };

  const handleSearch = async (description) => {
    const pokemonName = await identifyPokemon(description);
    if (pokemonName) {
      fetchPokemonData(pokemonName);
    } else {
      setError('Não foi possível identificar o Pokémon.');
    }
  };

  const hendleFormSubmit = (event) => {
    event.preventDefault();
    window.location.href = `/?id=${search}`;
  };

  const renderEvolutions = (evolutionData, key = 0) => {
    return (
      <ul className="evolution-chain">
        <li key={`${key++}-1`} data-key={`${key++}-1`}>
          <a href={`/?id=${evolutionData.name}`}>
            <img src={evolutionData.image} width="100" alt={evolutionData.name} />
            <h4>{getStringId(evolutionData.id)} {evolutionData.name}</h4>
          </a>

          {evolutionData.evolvesTo.length > 0 && (
            <ul>
              {evolutionData.evolvesTo.map((evolution, index) => (
                <li key={`${key}-${index+1}`}  data-key={`${key}-${index+1}`}>
                  {renderEvolutions(evolution, index+1)}
                </li>
              ))}
            </ul>
          )}
        </li>
      </ul>
    );
  };

  const renderTypes = (types) => (
      types.map((type, index) => (
        <span key={index} className={`type ${type.type.name}`}>{type.type.name}</span>
      ))
  );

  return (
    <main>
      <div className="search-bar">
        <h1><a href="/">Pokedex</a></h1>
        <button className="search-bar-spean-button speak" onClick={handleVoiceSearch}>Falar 🗣️</button>
        <form name="searchForm" className="search-bar-form" onSubmit={(event) => {
          event.preventDefault();
          hendleFormSubmit(event);
        }}>
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Número ou Nome"
          />
          <button type="submit">Buscar</button>
        </form>

      </div>
      {error && <p>{error}</p>}
      {description && <p>Descrição: {description}</p>}
      {loading === true && <p>Carregando...</p>}
      {pokemon && (
        <div className="pokemon-card">
          <div className="pokemon-info">
            <h2 className="pokemon-name"><em>{getStringId(pokemon.id)}</em> {pokemon.name}</h2>
            <p className="pokemon-type">{renderTypes(pokemon.types)}</p>
            <img
              width="300"
              className="pokemon-image"
              src={pokemon.sprites.other['official-artwork'].front_default} alt={pokemon.name} />
          </div>
          <aside className="pokemon-stats">
            {/* <p className="pokemon-type">Tipos: {renderTypes(pokemon.types)}</p> */}
            <p>Pronuncia: {pronunciations[pokemon.id -1 ]?.pronunciation} </p>
          </aside>
          <div className="pokemon-evolutions">
            <h3>Evoluções:</h3>
            {evolutionData ? renderEvolutions(evolutionData) : <p>Não há evoluções</p>}
          </div>
        </div>
      )}
    </main>
  );
};

export default PokemonSearch;
