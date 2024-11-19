export const getHost = () => {
    const NODE_ENV = import.meta.env.VITE_NODE_ENV;
    const DOMAIN = import.meta.env.VITE_DOMAIN;
    if (NODE_ENV === 'development') {
        return `${DOMAIN}:5173`;
    }else{
        return `${DOMAIN}:4173`;
    }
}