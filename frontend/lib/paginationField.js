import { PAGINATION_QUERY } from '../components/Pagination';

// paginationField нужен нам чтобы
//После удаления товаров в списке была перерисовка товаров 
export default function paginationField(){

    return {

        keyArgs: false,

        read(existing = [], { args, cache }){
            
            const {skip, first} = args;

            //Читаем колличество записей на странице из кэша Apollo
            const data = cache.readQuery({ query: PAGINATION_QUERY });
            const count = data?.wbProductsCount;
            const page = skip / first;
            const pages = Math.ceil(count / first);

            //Проверяем есть ли у нас существующие записи
            const items =  existing.slice(skip, skip + first).filter(x => x);

            //Если есть товары, но их не достаточно для выдачи
            //и в тоже время мы на последней странице пагинации
            if (items.length && items.length !== first && page === pages) {
                return items;
            }

            if (items.length !== first) {
                //У нас нету записей, идём в базу чтобы получить их
                return false;
            }

            //Если в кэше есть записи просто вернём их, не нужно снова лезть в базу
            if (items.length) {
                return items;
            }

            return false;

        },
        //Этот метод срабатывает когда Apollo возвращает данные взятые из Базы, а не из кэша
        merge(existing, incoming, { args }){

            const { skip, first } = args;
            const merged = existing ? existing.slice(0) : [];

            for(let i = skip; i < skip + incoming.length; ++i) {
                merged[i] = incoming[i - skip];
            }
            
            //Возвращаем смерженные товары из кэша
            return merged;
        }

    }

}