
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, RefreshCw, HelpCircle, Atom, Type, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { ElementCard } from '@/components/ElementCard';
import { Confetti } from '@/components/Confetti';
import { getAllElements } from '@/data/elements';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const difficultySettings = {
  easy: { count: 10, label: "Fácil (10 elementos)" },
  medium: { count: 20, label: "Medio (20 elementos)" },
  hard: { count: 30, label: "Difícil (30 elementos)" },
};

const gameModes = {
  atomicNumber: {
    label: "Número Atómico",
    prompt: "Ingresa el número atómico:",
    property: "atomicNumber",
    inputType: "number",
    placeholder: "Ej: 6",
    icon: <Hash className="mr-2 h-4 w-4" />
  },
  symbol: {
    label: "Símbolo Químico",
    prompt: "Ingresa el símbolo químico:",
    property: "symbol",
    inputType: "text",
    placeholder: "Ej: C",
    icon: <Atom className="mr-2 h-4 w-4" />
  },
  name: {
    label: "Nombre del Elemento",
    prompt: "Ingresa el nombre del elemento:",
    property: "name",
    inputType: "text",
    placeholder: "Ej: Carbono",
    icon: <Type className="mr-2 h-4 w-4" />
  },
};

function App() {
  const [elements, setElements] = useState([]);
  const [currentElementIndex, setCurrentElementIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [difficulty, setDifficulty] = useState('medium');
  const [gameMode, setGameMode] = useState('atomicNumber');
  const { toast } = useToast();
  const [elementsData, setElementsData] = useState([]);

  useEffect(() => {
    setElementsData(getAllElements());
  }, []);

  const startGame = useCallback(() => {
    if (elementsData.length === 0) return;
    const numElements = difficultySettings[difficulty].count;
    const shuffled = [...elementsData].sort(() => 0.5 - Math.random());
    setElements(shuffled.slice(0, numElements));
    setCurrentElementIndex(0);
    setUserInput('');
    setScore(0);
    setAttempts(0);
    setGameCompleted(false);
  }, [difficulty, elementsData]);

  useEffect(() => {
    startGame();
  }, [startGame, gameMode]);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const checkAnswer = () => {
    if (gameCompleted || !elements[currentElementIndex]) return;
    const currentElement = elements[currentElementIndex];
    const correctAnswer = String(currentElement[gameModes[gameMode].property]);
    let userAnswer = userInput.trim();

    if (gameModes[gameMode].inputType === 'number') {
      userAnswer = parseInt(userAnswer);
      if (isNaN(userAnswer)) {
        toast({
          title: "Entrada inválida",
          description: "Por favor ingresa un número",
          variant: "destructive",
        });
        return;
      }
    } else {
       userAnswer = userAnswer.toLowerCase();
    }
    
    const normalizedCorrectAnswer = gameModes[gameMode].inputType === 'number' ? correctAnswer : String(correctAnswer).toLowerCase();


    setAttempts(attempts + 1);
    
    if (userAnswer === normalizedCorrectAnswer) {
      setScore(score + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
      
      toast({
        title: "¡Correcto!",
        description: `${currentElement.name}: ${gameModes[gameMode].label.split(' ')[0]} es ${correctAnswer}`,
        variant: "default",
      });
      
      if (currentElementIndex < elements.length - 1) {
        setCurrentElementIndex(currentElementIndex + 1);
        setUserInput('');
      } else {
        setGameCompleted(true);
        toast({
          title: "¡Juego completado!",
          description: `Tu puntuación final: ${score + 1} de ${elements.length}`,
          variant: "default",
        });
      }
    } else {
      let hint = '';
      if (gameMode === 'atomicNumber' && !isNaN(userAnswer)) {
        hint = `Pista: ${userAnswer > currentElement.atomicNumber ? 'Menor' : 'Mayor'} que ${userInput}`;
      }
      toast({
        title: "Incorrecto",
        description: `Inténtalo de nuevo. ${hint}`,
        variant: "destructive",
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  };

  const resetGame = () => {
    startGame();
  };

  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
  };

  const handleGameModeChange = (newMode) => {
    setGameMode(newMode);
  };

  if (elementsData.length === 0) {
     return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Cargando datos de elementos...</h1>
        </div>
      </div>
    );
  }


  if (elements.length === 0 && !gameCompleted) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Cargando elementos...</h1>
        </div>
      </div>
    );
  }

  const currentElement = elements[currentElementIndex];
  const accuracy = attempts > 0 ? Math.round((score / attempts) * 100) : 0;
  const currentModeSettings = gameModes[gameMode];

  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="periodic-bg" />
      
      <div className="atom-animation w-96 h-96 left-1/4 top-1/4" />
      <div className="atom-animation w-64 h-64 right-1/4 bottom-1/3" />
      
      {showConfetti && <Confetti />}
      
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <motion.h1 
            className="text-4xl font-extrabold tracking-tight sm:text-5xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Desafío de Elementos Químicos
          </motion.h1>
          <motion.p 
            className="mt-4 text-xl text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Pon a prueba tus conocimientos sobre la tabla periódica.
          </motion.p>
        </div>

        <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div className="w-full">
            <Select value={difficulty} onValueChange={handleDifficultyChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona la dificultad" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(difficultySettings).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full">
            <Select value={gameMode} onValueChange={handleGameModeChange}>
              <SelectTrigger className="w-full">
                <HelpCircle className="mr-2 h-4 w-4 opacity-50" />
                <SelectValue placeholder="Selecciona el modo de juego" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(gameModes).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center">
                      {value.icon}
                      {value.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={resetGame} variant="outline" className="w-full sm:w-auto">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reiniciar Juego
          </Button>
        </div>


        <div className="score-display">
          <p className="text-sm font-medium">
            Puntuación: {score}/{elements.length} | Precisión: {accuracy}%
          </p>
        </div>

        <AnimatePresence mode="wait">
          {currentElement && !gameCompleted ? (
            <motion.div
              key={`game-${currentElement.symbol}-${gameMode}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <ElementCard 
                element={currentElement} 
                hideProperty={currentModeSettings.property}
              />
              
              <div className="mt-8 w-full max-w-md">
                <label htmlFor="userInput" className="block text-sm font-medium text-gray-300 mb-2">
                  {currentModeSettings.prompt}
                </label>
                <div className="flex space-x-4">
                  <input
                    type={currentModeSettings.inputType}
                    id="userInput"
                    className="input-atomic-number"
                    placeholder={currentModeSettings.placeholder}
                    value={userInput}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    min={currentModeSettings.inputType === 'number' ? "1" : undefined}
                    max={currentModeSettings.inputType === 'number' ? "118" : undefined}
                    disabled={gameCompleted}
                    autoFocus
                  />
                  <Button onClick={checkAnswer} disabled={gameCompleted}>Verificar</Button>
                </div>
                <p className="mt-2 text-sm text-gray-400">
                  Elemento {currentElementIndex + 1} de {elements.length}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mt-12"
            >
              <div className="mb-8">
                <Award className="mx-auto h-16 w-16 text-yellow-500" />
                <h2 className="mt-4 text-3xl font-bold">¡Juego completado!</h2>
                <p className="mt-2 text-xl">
                  Tu puntuación final: {score} de {elements.length}
                </p>
                <p className="mt-1 text-gray-400">
                  Precisión: {accuracy}%
                </p>
              </div>
              
              <Button onClick={resetGame} className="mt-4">
                <RefreshCw className="mr-2 h-4 w-4" />
                Jugar de nuevo
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
