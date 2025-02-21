// src/components/PokemonSearch.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { deepSeek } from '../services/deepseek'; // Exemplo de importação da biblioteca DeepSeek

const PokemonSearch = () => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [pokemon, setPokemon] = useState(null);
  const [error, setError] = useState('');
  const [evolutions, setEvolutions] = useState([]);

  // Inicialize o DeepSeek (substitua pela sua chave de API)
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pokedexId = params.get('id');

    console.log('pokedexId', pokedexId);
    
    if (pokedexId) {
      fetchPokemonData(pokedexId);
    }
  }, []);

  const identifyPokemon = async (description) => {
    try {
      // const deepSeek = await searchDeepSeek('Rato elétrico');
      // Use o DeepSeek para identificar o Pokémon com base na descrição
      setLoading(true);
      const response = await deepSeek(description);
      setLoading(false);
      const responseJson = JSON.parse(response);
      console.log('response', responseJson);
      // setPokemon(responseJson);

      // const pokemonName = response.entities.find((entity) => entity.type === 'POKEMON')?.name;
      const pokemonName = responseJson.pokedex;
      console.log('pokemonName', pokemonName);
      return pokemonName;
    } catch (err) {
      console.error('Erro ao identificar o Pokémon:', err);
      return null;
    }
  };

  const fetchPokemonData = async (pokemonId) => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
      console.log('response', response.data);
      setPokemon(response.data);
      setError('');
      fetchEvolutions(response.data.id);
    } catch (err) {
      setError('Pokémon não encontrado.');
      setPokemon(null);
      setEvolutions([]);
    }
  };

  const fetchEvolutions = async (pokemonId) => {
    try {
      const speciesResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
      const evolutionChainUrl = speciesResponse.data.evolution_chain.url;
      const evolutionResponse = await axios.get(evolutionChainUrl);
      const evolutions = [];
      let chain = evolutionResponse.data.chain;
      while (chain) {
        console.log('chain', chain);
        evolutions.push(chain.species.name);
        chain = chain.evolves_to[0];
      }
      setEvolutions(evolutions);
    } catch (err) {
      console.error('Erro ao buscar evoluções:', err);
      setEvolutions([]);
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

  return (
    <div>
      <h1>Pokedex</h1>
      <button className="speak" onClick={handleVoiceSearch}>Falar 🗣️</button>
      {error && <p>{error}</p>}
      {description && <p>Descrição: {description}</p>}
      {loading === true && <p>Carregando...</p>}
      {(pokemon && loading === false )&& <p>Resposta: {pokemon.answer}</p>}
      {pokemon && (
        <div>
          <h2>{pokemon.name}</h2>
          <img
            width="300"
            src={pokemon.sprites.other['official-artwork'].front_default} alt={pokemon.name} />
          <p className="pokedex-number">Número da Pokédex: {pokemon.id}</p>
          <h3>Evoluções:</h3>
          <ul>
            {evolutions.map((evo, index) => (
              <li key={index}><a href={`/?id=${evo}`}>{evo}</a></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PokemonSearch;