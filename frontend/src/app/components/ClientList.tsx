'use client';

import { useEffect, useState } from 'react';
import { Client, calendlyApi } from '../service/calendly';

const ClientList = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await calendlyApi.getClientListe();
        setClients(response.data || []);
      } catch (err: any) {
        console.error('Failed to fetch clients:', err);
        setError('Failed to load clients.');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl  h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
          Client List
        </h3>
      </div>

      {/* Content */}
      <div className="overflow-y-auto max-h-80  flex-1">
        {loading ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">Loading...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : clients.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">No clients found.</div>
        ) : (
          clients.map((client, index) => (
            <div
              key={index}
              className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors last:border-b-0"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                {client.name?.charAt(0).toUpperCase() || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {client.name || 'Unknown'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {client.email || 'No email'}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClientList;
