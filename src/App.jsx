import { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [userChoice, setUserChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [tempChoice, setTempChoice] = useState(null); // Valor temporário

  const getRandomChoice = () => {
    const choices = ['Pedra', 'Papel', 'Tesoura'];
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
  };

  const PlayAgain = () => {
    const conteudo = document.getElementById('conteudo');
    conteudo.style.display = 'flex';
    const result = document.getElementById('result');
    result.style.display = 'none';
    setUserChoice(null); // Resetar escolha do usuário
    setComputerChoice(null); // Resetar escolha do computador
    setTempChoice(null); // Resetar valor temporário
  }

  useEffect(() => {
    if (userChoice !== null) {
      setTimeout(() => {
        const choice = getRandomChoice();
        setComputerChoice(choice);
      }, 100); // Pausa de 0.1 segundos
    }
  }, [userChoice]);

  const handleChoice = (choice) => {
    setUserChoice(choice);
    setTempChoice(choice); // Forçar atualização do valor temporário
    const conteudo = document.getElementById('conteudo');
    conteudo.style.display = 'none';
    const result = document.getElementById('result');
    result.style.display = 'flex';
  };

  return (
    <>
      <div className='container' id='conteudo'>
        <h1 className='title'>Escolha Um</h1>
        <div className='opt'>
          <div id='Tesoura' className='card animated' onClick={() => handleChoice('Tesoura')}>
            <img src="../tesouras.png" alt="Tesoura" />
            <h1>Tesoura</h1>
          </div>
          <div id='Pedra' className='card animated' onClick={() => handleChoice('Pedra')}>
            <img src="../pedras.png" alt="Pedra" />
            <h1>Pedra</h1>
          </div>
          <div id='Papel' className='card animated' onClick={() => handleChoice('Papel')}>
            <img src="../papel.png" alt="Papel" />
            <h1>Papel</h1>
          </div>
        </div>
      </div>
      
      <div className='result' id='result'>
        {userChoice && (
          <>
            <h2>Você escolheu: {userChoice}</h2>
            <h2>Computador escolheu: {computerChoice}</h2>
            <h2>
              {userChoice === computerChoice
                ? 'Empate!'
                : (userChoice === 'Pedra' && computerChoice === 'Tesoura') ||
                  (userChoice === 'Papel' && computerChoice === 'Pedra') ||
                  (userChoice === 'Tesoura' && computerChoice === 'Papel')
                ? 'Você ganhou!'
                : 'Você perdeu!'}
            </h2>
            <button onClick={PlayAgain} className="button-17" role="button">Jogar Denovo</button>
          </>
        )}
      </div>
    </>
  );
}

export default App;
