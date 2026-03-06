import { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`/api`)
      .then(res => res.json())
      .then(json => setData(json.message))
      .catch(err => console.error('Erro ao buscar API:', err));
  }, []);

  return (
    <div>
      <h1>Frontend React</h1>
      <p>Resposta do backend: {data}</p>
    </div>
  );
}

export default App;
