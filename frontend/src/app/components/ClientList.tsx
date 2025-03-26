import Image from "next/image";

type Client = {
  id: number;
  name: string;
  image?: string;
  email: string;
};

const ClientList = () => {
  const clients: Client[] = [
    {
      id: 1,
      name: "Sarra boukadida ",
      image: "/clients/client1.jpg",
      email: "sara@etafakna.com",
    },
    {
      id: 2,
      name: "ibrahim ben salah",
      image: "/clients/client2.jpg",
      email: "ibrahim@etafakna .com",
    },
    {
        id: 3,
        name: "Ibrahim ben salah",
        image: "",
        email: "ibrahim@etafakna .com",
      },
      {
        id: 4,
        name: "ibrahim ben salah",
        image: "/clients/client2.jpg",
        email: "ibrahim@etafakna .com",
      },
    
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md w-full md:max-w-md lg:w-[300px] min-h-[176px]">
      {/* Card Header */}
      <div className="p-4 md:p-4  border-b dark:border-gray-700">
        <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white text-center">
          Client List
        </h3>
      </div>

      {/* Scrollable Client List */}
      <div className="overflow-y-auto max-h-[300px]  md:max-h-56">
        {clients.map((client) => (
          <div
            key={client.id}
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
                    {client.name[0]}
                  </span>
                </div>
              )}
            </div>

            {/* Client Info */}
            <div className="min-w-0 flex-1">
              <p className="text-sm md:text-base font-medium text-gray-900 dark:text-white truncate">
                {client.name}
              </p>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate">
                {client.email}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientList;