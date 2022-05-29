import Form from './styles/Form';
import useForm from '../lib/useForm';
import { gql } from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { CURRENT_USER_QUERY } from './User';
import Error from './ErrorMessage';

const SIGNUP_MUTATION = gql`

    mutation SIGNUP_MUTATION($username: String!, $email: String!, $password: String!) {

        createwb_user(data: {username: $username, email: $email, password: $password}) {
            id
            username
            email
        }
        
    }

`;

export default function SignUp(){

    const { inputs, handleChange, resetForm } = useForm({
        username: '',
        email: '',
        password: ''
    });

    const [signup, { data, loading, error }] = useMutation(SIGNUP_MUTATION, {
        variables: inputs,
        refetchQueries: [{ query: CURRENT_USER_QUERY }]
    });

    async function handleSubmit(e) {

        //ОСТанавливаем Submit
        e.preventDefault();
        //console.log(inputs);
        const res = await signup().catch(console.error);

        //Выводим данные по пользователю, который авторизовывается
        console.log(res);
        resetForm();

        //ОТПРАВЛЯЕМ email и password в GraphQl Api

    }

    return (
        <Form method="POST" onSubmit={handleSubmit}>

            <h2>Sign Up for your Account</h2>

            <Error error={error} />

            <fieldset>

                {data?.createUser && (
                    <p>
                        Signed up with {data.createUser.email} - Please Go Head and Sign in!
                    </p>
                )}

                <label htmlFor="email">
                    Username
                    <input 
                        type="text" 
                        name="username" 
                        placeholder="Username" 
                        autoComplete="Username" 
                        value={inputs.username}
                        onChange={handleChange}
                    />
                </label>
                
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