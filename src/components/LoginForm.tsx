
import React, { useState } from 'react';
import { User } from '../types';
import { mockUsers } from '../data/mockData';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface LoginFormProps {
  onLogin: (user: User) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  const handleLogin = () => {
    const user = mockUsers.find(u => u.id === selectedUserId);
    if (user) {
      onLogin(user);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Plateforme d'Extraction & Validation
          </h1>
          <p className="text-gray-600">Connexion à votre espace de travail</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sélectionnez votre profil
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choisir un utilisateur...</option>
              {mockUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} - {user.role}
                </option>
              ))}
            </select>
          </div>

          <Button 
            onClick={handleLogin} 
            disabled={!selectedUserId}
            className="w-full"
          >
            Se connecter
          </Button>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p className="font-semibold mb-2">Rôles disponibles :</p>
          <ul className="space-y-1">
            <li>• <span className="font-medium">Métadonneur</span> : Validation des métadonnées</li>
            <li>• <span className="font-medium">Annotateur</span> : Correction des annotations IA</li>
            <li>• <span className="font-medium">Expert métier</span> : Validation finale</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default LoginForm;
