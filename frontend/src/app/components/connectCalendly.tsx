export default function ConnectCalendly() {
    const connect = () => {
      const params = new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_CALENDLY_CLIENT_ID!,
        redirect_uri: process.env.NEXT_PUBLIC_CALENDLY_REDIRECT_URI!,
        response_type: 'code',
        scope: 'read_write',
      });
      
      window.location.href = `https://auth.calendly.com/oauth/authorize?${params}`;
    };
   
    return (
      <button 
        onClick={connect}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Connect Calendly Account
      </button>
    );
  }