import Image from "next/image";
import { useEffect,useState } from "react";
import { Client ,clientApi } from "../service/api";




const ClientList=()=>{
  const [clients, setClients] = useState<Client[]>([]);
  const [loading,setLoading]= useState(true);
  const [mounted,setMounted]=useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchClients = async () => {
      try {
        const response = await clientApi.getClientList();
        console.log('response data', response.data);
        
        // Correct access to nested array
        const data = Array.isArray(response.data?.clients) 
          ? response.data.clients 
          : [];
        
        console.log('Processed clients:', data);
        setClients(data);
      } catch (error) {
        console.error("Error:", error);
        setClients([]);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);
const clientItems=Array.isArray(clients)? clients : [];
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl  w-full md:max-w-md lg:w-[300px] min-h-[176px]">
      {/* Card Header */}
      <div className="p-4 md:p-4  border-b dark:border-gray-700">
        <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white text-center">
          Client List
        </h3>
      </div>

      {/* Scrollable Client List */}
      <div className="overflow-y-auto max-h-[300px]  md:max-h-56">
      {loading ? (
          <p className="p-4 text-center text-gray-500 dark:text-gray-400">Loading...</p>
        ) : clients.length === 0 ? (
          <p className="p-4 text-center text-gray-500 dark:text-gray-400">No clients found.</p>
        ) : (
          clients.map((client, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 md:p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b dark:border-gray-700 last:border-b-0"
            >
            {/* Client Avatar */}
            <div className="flex-shrink-0">
              {client.image ? (
                <Image
                  src={client.image}
                  alt={client.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover w-10 h-10"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white font-medium">
                    {client.name[0].toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Client Info */}
            <div className="min-w-0 flex-1">
              <p className="text-sm md:text-base font-medium text-gray-900 dark:text-white truncate">
              {client.name || 'No name provided'}
              </p>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate">
              {client.email || 'No email provided'}
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