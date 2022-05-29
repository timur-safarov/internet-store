import { resetIdCounter, useCombobox } from 'downshift';
import gql from 'graphql-tag';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';
import { useLazyQuery, useMutation } from '@apollo/client';
import debounce from 'lodash.debounce';
import { useRouter } from 'next/dist/client/router';


const SEARCH_PRODUCTS_QUERY = gql`

    query SEARCH_PRODUCTS_QUERY($searchTerm: String!) {

        searchTerms: wbProducts(where: {
            OR: [
                {name: {contains: $searchTerm}},
                {description: {contains: $searchTerm}}
            ]
        }) {
            id,
            name,
            id_product_image {
                id
                image {
                    publicUrlTransformed
                }
            }
        }

    }

`;

export default function Search(){

    const router = useRouter();

    const [findItems, {loading, data, error}] = useLazyQuery(SEARCH_PRODUCTS_QUERY, {
        fetchPolicy: 'no-cache'
    });

    /* 
        Тут можно увидеть что возвращает запрос
        console.log(data);
    */

    const items = data?.searchTerms || [];

    const findItemsButChill = debounce(findItems, 350);
    resetIdCounter();

    const {
        isOpen,
        inputValue,
        getMenuProps, 
        getInputProps,
        getComboboxProps,
        getItemProps,
        highlightedIndex
    } = useCombobox({
        items,
        onInputValueChange(){
            console.log('Input changed');
            findItemsButChill({
                variables: {
                    searchTerm: inputValue     
                }
            });
        },
        onSelectedItemChange({ selectedItem }){

            // console.log(selectedItem);
            // console.log('Selected Item changed');

            router.push({
                pathname: `/product/${selectedItem.id}`
            })

        },
        itemToString: (item) => item?.name || ''
    });

    return (
        <SearchStyles>
            <div {...getComboboxProps()}>
                <input {...getInputProps({
                    type: 'search',
                    placeholder: 'Search for an Item',
                    id: 'search',
                    className: loading ? 'loading' : null
                })} />
            </div>
            <DropDown {...getMenuProps()}>
                {isOpen && items.map((item, index) => (
                    <DropDownItem 
                        key={item.id}
                        {...getItemProps({ item, index })}
                        highlighted={index === highlightedIndex}
                    >
                        <img src={item?.id_product_image?.image?.publicUrlTransformed} alt={item.name} width="50" />
                        {item.name}
                    </DropDownItem>
                ))}

                {isOpen && !items.length && !loading && (
                   <DropDownItem>
                       Sorry, no items found for {inputValue}
                    </DropDownItem> 
                )}

            </DropDown>
        </SearchStyles>
    );
}