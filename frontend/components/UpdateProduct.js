import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Form from './styles/Form';
import useForm from '../lib/useForm';
import DisplayError from './ErrorMessage';
import Router from 'next/router';

const SINGL_PRODUCT_QUERY = gql`
    query SINGL_PRODUCT_QUERY($id: ID!){
        wb_product(where: {
            id: $id
        }){
            id
            name
            description
            price
        }
    }
`;

const UPDATE_PRODUCT_MUTATION = gql`

    mutation UPDATE_PRODUCT_MUTATION(
        $id: ID!
        $name: String
        $description: String
        $price: Int
    ) {
        updatewb_product(
            where: {
                id: $id
            },
            data: {
                name: $name,
                description: $description,
                price: $price
            }
        ) {
            id
            name
            description
            price
        }
    }

`;

export default function UpdateProduct({ id }) {

    const {data, error, loading} = useQuery(SINGL_PRODUCT_QUERY, {
        variables: {id: id}
    });

    //Переименовываем data, error, loading чтобы они не были продекларованы дважды!
    const [updatewb_product, {data: updateData, error: updateError, loading: updateLoading}] = useMutation(UPDATE_PRODUCT_MUTATION);

    //Фигурные скобки потому как мы возвращаем объект а не масссив из useForm()
    //Указываем пустые значения полей, чтобы initial в useForm работал без ошибок
    const { inputs, handleChange, clearForm, resetForm } = useForm(
        (data) ? data.wb_product : {
            "id": "",
            "name": "",
            "description": "",
            "price": ""
        }
    );

    //console.log(handleChange);

    if (loading) return <p>Loading...</p>;

    return (
        <Form onSubmit={async (e) => {
            
            e.preventDefault();
            //console.log(inputs);

            const res = await updatewb_product({
                variables: {
                    id: id,
                    name: inputs.name,
                    description: inputs.description,
                    price: inputs.price
                }
            }).catch(
                //console.error
            );

            //ОТПРАВЛЯЕМ ФОРМУ на backend
            // const res = await createProduct({
            //     variables: inputs
            // });

            //Можно посмотреть что вернул сервер
            //console.log(res);

            //Очищаем форму после отправки
            // clearForm();

            // Router.push({
            //     pathname: `product/${res.data.createwb_product.id}`
            // });

        }}>
    
            <DisplayError error={error || updateError} />

            <fieldset disabled={updateLoading} aria-busy={updateLoading}>

                <label htmlFor="name">
                    Name
                    <input 
                        id="name"
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={inputs.name}
                        onChange={handleChange}
                    />
                </label>

                <label htmlFor="price">
                    Price
                    <input 
                        id="price"
                        type="number"
                        name="price"
                        placeholder="price"
                        value={inputs.price}
                        onChange={handleChange}
                    />
                </label>

                <label htmlFor="price">
                    Description
                    <textarea 
                        id="description"
                        name="description"
                        placeholder="Description"
                        value={inputs.description}
                        onChange={handleChange}
                    />
                </label>

                <button type="submit">Update Product</button>

            </fieldset>

        </Form>
    )
}