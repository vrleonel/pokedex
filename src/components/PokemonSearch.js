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

      const parseEvolutionChain = (chain) => {
        const evolutionData = {
          name: chain.species.name,
          evolvesTo: [],
        };

        // Se houver múltiplas evoluções, percorre cada uma delas
        if (chain.evolves_to && chain.evolves_to.length > 0) {
          chain.evolves_to.forEach((evolution) => {
            evolutionData.evolvesTo.push(parseEvolutionChain(evolution)); // Chama a função recursivamente
          });
        }

        return evolutionData;
      };

      return parseEvolutionChain(evolutionResponse.data.chain)
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

  const renderEvolutions = (evolutionData) => {
    console.log('evolutionData', evolutionData);
    return (
      <ul>
        <li>
        <a href={`/?id=${evolutionData.name}`}>{evolutionData.name}</a>
          {evolutionData.evolvesTo.length > 0 && (
            <ul>
              {evolutionData.evolvesTo.map((evolution, index) => (
                <li key={index}>{renderEvolutions(evolution)}</li>
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
        <h1>Pokedex</h1>
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
            <h2 className="pokemon-name">#{pokemon.id} {pokemon.name}</h2>
            <img
              width="300"
              className="pokemon-image"
              src={pokemon.sprites.other['official-artwork'].front_default} alt={pokemon.name} />
          </div>
          <side className="pokemon-stats">
            <p className="pokemon-type">Tipos: {renderTypes(pokemon.types)}</p>
            <p>Pronuncia: {pronunciations[pokemon.id -1 ]?.pronunciation} </p>
          </side>
          <div className="pokemon-evolutions">
            <h3>Evoluções:</h3>
            {evolutionData && renderEvolutions(evolutionData)}
          </div>
        </div>
      )}
    </main>
  );
};

export default PokemonSearch;
