import { useAuth } from '../context/AuthContext';

export function useSupport() {
  const {
    supportTickets,
    supportLoaded,
    ensureSupportLoaded,
    createTicket,
    replyToTicket,
    closeTicket,
    deleteTicket,
  } = useAuth();
  return {
    supportTickets,
    supportLoaded,
    ensureSupportLoaded,
    createTicket,
    replyToTicket,
    closeTicket,
    deleteTicket,
  };
}
