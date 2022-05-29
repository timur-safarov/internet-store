import { useMutation } from "@apollo/client";
import Form from './styles/Form';
import useForm from '../lib/useForm';
import DisplayError from './ErrorMessage';
import { ALL_WB_PRODUCTS_QUERY } from './Products';
import gql from "graphql-tag";
import Router from 'next/router';

const CREATE_PRODUCT_MUTATION = gql`
    mutation CREATE_PRODUCT_MUTATION(
        #Значения которые мы будем передавать и их типы
        $name: String!
        $description: String!
        $price: Int!
        $image: Upload #Upload UploadImage
    ){
        createwb_product(data:{
            name: $name,
            description: $description,
            price: $price,
            status: "AVAILABLE",
            id_product_image: {
                create: {
                    image: $image,
                    alt_text: $name
                }
            }
        }){
            id
            price
            description
            name
        }
    }
`;

export default function CreateProduct() {

    //Фигурные скобки потому как мы возвращаем объект а не масссив из useForm()
    const { inputs, handleChange, clearForm, resetForm } = useForm({
        image: '',
        name: 'Nice shoes',
        description: 'These the best shoes',
        price: 1000
    });

    const [createProduct, {loading, error, data}] = useMutation(CREATE_PRODUCT_MUTATION, {
        variables: inputs,
        //Сбрасываем кэш чтобы новая запись сразу была доступна
        refetchQueries: [{ query: ALL_WB_PRODUCTS_QUERY }]
    });

    function handleSubmit(e) {

    }

    return (
        <Form onSubmit={async (e) => {
            
            e.preventDefault();
            //console.log(inputs);

            //ОТПРАВЛЯЕМ ФОРМУ на backend
            const res = await createProduct({
                variables: inputs
            });

            //Можно посмотреть что вернул сервер
            //console.log(res);

            //Очищаем форму после отправки
            clearForm();

            Router.push({
                pathname: `product/${res.data.createwb_product.id}`
            });

        }}>
    
            <DisplayError error={error} />

            <fieldset disabled={loading} aria-busy={loading}>

                <label htmlFor="name">
                    Image
                    <input 
                        id="image"
                        required
                        type="file"
                        name="image"
                        onChange={handleChange}
                    />
                </label>
            
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

                <button type="submit">+ Add Product</button>

            </fieldset>

        </Form>
    )

}