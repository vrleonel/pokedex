const saveSearchToLocalStorage = (input,
  output) => {
  const searches = JSON.parse(localStorage.getItem('pokemonSearches')) || [];
  const newSearch = { input, output };
  searches.push(newSearch);
  localStorage.setItem('pokemonSearches', JSON.stringify(searches));
};

const saveConfigToLocalStorage = (name, value) => {
  const searches = JSON.parse(localStorage.getItem('pokedexConfig')) || {};
  searches[name] =  value;
  localStorage.setItem('pokedexConfig', JSON.stringify(searches));
}

const getSearchFromLocalStorage = (input) => {
  const searches = JSON.parse(localStorage.getItem('pokemonSearches')) || [];
  return searches.find((search) => search.input === input);
};

const getConfigFromLocalStorage = (name) => {
  const configs = JSON.parse(localStorage.getItem('pokedexConfig')) || [];
  return configs[name];
};


const clearLocalStorage = () => {
  localStorage.removeItem('pokemonSearches');
  localStorage.removeItem('pokedexConfig');
};

export {
  saveSearchToLocalStorage,
  saveConfigToLocalStorage,
  getSearchFromLocalStorage,
  getConfigFromLocalStorage,
  clearLocalStorage
};
