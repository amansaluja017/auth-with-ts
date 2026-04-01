
declare global {
  namespace Express {
    interface Request {
      customer: {
        id: string;
        email: string;
        role: "customer"
      },
    }
  }
}

export { };