import { useQuery } from '@tanstack/react-query';

export async function getCustomers() {
  return useQuery({
    queryKey: ['customers'],
    queryFn() {
      return fetch(`${import.meta.env.VITE_URI}/customer`).then(res =>
        res.json()
      );
    },
  });
}
