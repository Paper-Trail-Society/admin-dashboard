import { $http } from '@/lib/http';
import { useQuery } from '@tanstack/react-query';
import { Keyword } from '../types';


const useGetKeywords = ({ search }: { search?: string}) => {
    return useQuery({
        queryKey: ['keywords', search],
        queryFn: async () => {
          const res = await $http.get<Keyword[]>('/keywords', { params: { query: search } });
          return res.data
        }
      })
}

export default useGetKeywords;