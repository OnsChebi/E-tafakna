"use client";
import { useEffect, useState } from "react";
import { Client, clientApi } from "../service/api";

const ClientList = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await clientApi.getClientListe();
        console.log(response.data.clients)
        setClients(response.data.clients);
      } catch (err) {
        console.error("Failed to fetch clients:", err);
        setError("Failed to load clients.");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl w-full md:max-w-md lg:w-[300px] min-h-[176px]">
      <div className="p-4 border-b dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white text-center">
          Client List
        </h3>
      </div>

      <div className="overflow-y-auto max-h-[300px] md:max-h-56">
        {loading ? (
          <p className="p-4 text-center text-gray-500 dark:text-gray-400">
            Loading...
          </p>
        ) : error ? (
          <p className="p-4 text-center text-red-500">{error}</p>
        ) : clients.length === 0 ? (
          <p className="p-4 text-center text-gray-500 dark:text-gray-400">
            No clients found.
          </p>
        ) : (
          clients.map((client, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b dark:border-gray-700 last:border-b-0"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white font-medium text-lg">
                  {client.name?.charAt(0).toUpperCase() || "?"}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {client.name || "No name"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {client.email || "No email"}
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
