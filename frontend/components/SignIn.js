import Form from './styles/Form';
import useForm from '../lib/useForm';
import { gql } from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { CURRENT_USER_QUERY } from './User';
import Error from './ErrorMessage';

const SIGNIN_MUTATION = gql`

    mutation SIGNIN_MUTATION($email: String!, $password: String!) {

        authenticatewb_userWithPassword(email: $email, password: $password) {

            ... on wb_userAuthenticationWithPasswordSuccess{
                item {
                    id
                    email
                    username
                }
            }

            ... on wb_userAuthenticationWithPasswordFailure {
                message
            }

        }
        
    }

`;

export default function SignIn(){

    const { inputs, handleChange, resetForm } = useForm({
        email: '',
        password: ''
    });

    const [signin, { data, loading }] = useMutation(SIGNIN_MUTATION, {
        variables: inputs,
        refetchQueries: [{ query: CURRENT_USER_QUERY }]
    });

    async function handleSubmit(e) {

        //ОСТанавливаем Submit
        e.preventDefault();
        //console.log(inputs);
        const res = await signin();

        //Выводим данные по пользователю, который авторизовывается
        console.log(res);
        resetForm();

        //ОТПРАВЛЯЕМ email и password в GraphQl Api

    }

    const error = data?.authenticatewb_userWithPassword.__typename === 
       'wb_userAuthenticationWithPasswordFailure'
            ? data?.authenticatewb_userWithPassword
                : undefined;

    return (
        <Form method="POST" onSubmit={handleSubmit}>

            <h2>Sign Into your Account</h2>

            <Error error={error} />

            <fieldset>
                
                <label htmlFor="email">
                    Email
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Email Address" 
                        autoComplete="Email" 
                        value={inputs.email}
                        onChange={handleChange}
                    />
                </label>

                <label htmlFor="password">
                    Password
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Password Address" 
                        autoComplete="Password" 
                        value={inputs.password}
                        onChange={handleChange}
                    />
                </label>

                <button type="submit">Submit</button>

            </fieldset>
        </Form>
    );

}