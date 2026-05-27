// const SERVICE_URLS = [
//     import.meta.env.VITE_AUTH_API_URL || 'http://localhost:3000',
//     import.meta.env.VITE_PRODUCT_API_URL || 'http://localhost:3001',
//     import.meta.env.VITE_CART_API_URL || 'http://localhost:3002',
//     import.meta.env.VITE_ORDER_API_URL || 'http://localhost:3003',
//     import.meta.env.VITE_PAYMENT_API_URL || 'http://localhost:3004',
//     import.meta.env.VITE_AI_BUDDY_API_URL || 'http://localhost:3005',
//     import.meta.env.VITE_NOTIFICATION_API_URL || 'http://localhost:3006',
//     import.meta.env.VITE_SELLER_DASHBOARD_API_URL || 'http://localhost:3007'
    
// ];

// const ServiceWaker = async () => {
//     console.log("🚀 Initializing Service Wake-up...");

//     SERVICE_URLS.forEach(url => {
//         try {
//             // 1. "URL" object full path mein se origin (domain) nikaal leta hai
//             // Example: "https://auth.onrender.com/api/auth" -> "https://auth.onrender.com"
//             const baseUrl = new URL(url).origin;

//             // 2. Sirf Base URL hit karo (Health Check route '/')
//             fetch(baseUrl, { mode: 'no-cors' })
//                 .then(() => console.log(`Pinged: ${baseUrl}`))
//                 .catch(() => console.log(`Waking up: ${baseUrl}`));
                
//         } catch (err) {
//             console.error("Invalid URL in ServiceWaker:", url);
//         }
//     });
// };

// export default ServiceWaker;


const SERVICE_URLS = [
    import.meta.env.VITE_AUTH_API_URL || 'http://localhost:3000',
    import.meta.env.VITE_PRODUCT_API_URL || 'http://localhost:3001',
    import.meta.env.VITE_CART_API_URL || 'http://localhost:3002',
    import.meta.env.VITE_ORDER_API_URL || 'http://localhost:3003',
    import.meta.env.VITE_PAYMENT_API_URL || 'http://localhost:3004',
    import.meta.env.VITE_AI_BUDDY_API_URL || 'http://localhost:3005',
    import.meta.env.VITE_NOTIFICATION_API_URL || 'http://localhost:3006',
    import.meta.env.VITE_SELLER_DASHBOARD_API_URL || 'http://localhost:3007'
];

const ServiceWaker = async () => {
    console.log("🚀 Initializing Service Wake-up...");

    const pingPromises = SERVICE_URLS.map(async (url) => {
        try {
            const baseUrl = new URL(url).origin;
            
            // Hamein response ka wait karna hai jab tak Render respond na kare (Free tier takes 30-50s)
            const response = await fetch(baseUrl);
            console.log(`✅ Server responded (${response.status}): ${baseUrl}`);
        } catch (err) {
            // Agar server 'wake up' state mein hai toh net::ERR_CONNECTION_REFUSED ya timeout aayega, usey catch mein handle hone do
            console.log(`📡 Waking up server domain: ${url}`);
        }
    });

    // Jab saari services response de dengi (ya fail ho chuki hongi), tabhi ye aage badhega
    await Promise.all(pingPromises);
};

export default ServiceWaker;