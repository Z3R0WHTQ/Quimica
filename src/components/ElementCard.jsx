
import React from 'react';
import { motion } from 'framer-motion';

const categoryColors = {
  'Metal alcalino': 'from-red-900 to-red-700',
  'Metal alcalinotérreo': 'from-orange-900 to-orange-700',
  'Metal de transición': 'from-yellow-900 to-yellow-700',
  'Metal del bloque p': 'from-green-900 to-green-700',
  'Metaloide': 'from-teal-900 to-teal-700',
  'No metal': 'from-blue-900 to-blue-700',
  'Halógeno': 'from-indigo-900 to-indigo-700',
  'Gas noble': 'from-purple-900 to-purple-700',
  'Lantánido': 'from-pink-900 to-pink-700',
  'Actínido': 'from-rose-900 to-rose-700',
  'Desconocido': 'from-gray-900 to-gray-700'
};

export function ElementCard({ element, hideProperty }) {
  const gradientClass = categoryColors[element.category] || 'from-gray-900 to-gray-700';
  
  const shouldShow = (prop) => hideProperty !== prop;

  return (
    <motion.div
      className={`element-card ${gradientClass} w-full max-w-lg`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <div className="flex justify-between items-start">
        <div>
          {shouldShow('symbol') && <div className="element-symbol">{element.symbol}</div>}
          {shouldShow('name') && <div className="element-name">{element.name}</div>}
        </div>
        {shouldShow('atomicNumber') && <div className="text-6xl font-bold text-foreground/50">{element.atomicNumber}</div>}
      </div>
      
      <div className="element-category mt-1">{element.category}</div>
      
      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div>
          <span className="text-gray-400">Masa Atómica:</span>
          <div className="font-medium">{element.atomicMass}</div>
        </div>
        <div>
          <span className="text-gray-400">Electrones:</span>
          <div className="font-medium">{element.electrons.join(', ')}</div>
        </div>
        <div>
          <span className="text-gray-400">Descubierto:</span>
          <div className="font-medium">{element.discoveryYear || 'Antiguo'}</div>
        </div>
        <div>
          <span className="text-gray-400">Estado (Fase):</span>
          <div className="font-medium">{element.phase}</div>
        </div>
      </div>
      
      <div className="mt-4">
        <p className="text-sm text-gray-400 h-16 overflow-y-auto">{element.description}</p>
      </div>
    </motion.div>
  );
}
