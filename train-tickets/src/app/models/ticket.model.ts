export interface Ticket {
    id: number;
    from: string;
    to: string;
    price: number;
    luxury: boolean;
    lastTicket?: boolean;
  }
  