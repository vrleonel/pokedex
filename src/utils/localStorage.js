// Função para salvar uma busca no localStorage
const saveSearchToLocalStorage = (input, output) => {
  const searches = JSON.parse(localStorage.getItem('pokemonSearches')) || [];
  const newSearch = { input, output };
  searches.push(newSearch);
  localStorage.setItem('pokemonSearches', JSON.stringify(searches));
};
  
// Função para verificar se uma busca já existe no localStorage
const getSearchFromLocalStorage = (input) => {
  const searches = JSON.parse(localStorage.getItem('pokemonSearches')) || [];
  return searches.find((search) => search.input === input);
};

// Função para limpar o armazenamento (opcional, para testes)
const clearLocalStorage = () => {
  localStorage.removeItem('pokemonSearches');
};

export { saveSearchToLocalStorage, getSearchFromLocalStorage, clearLocalStorage };