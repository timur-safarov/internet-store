import Form from './styles/Form';
import useForm from '../lib/useForm';
import { gql } from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { CURRENT_USER_QUERY } from './User';
import Error from './ErrorMessage';

const RESET_MUTATION = gql`

    mutation RESET_MUTATION($email: String!, $token: String!, $password: String!) {

        redeemwb_userPasswordResetToken(
            email: $email
            token: $token
            password: $password
        ) {
            code
            message
        }
        
    }

`;

export default function Reset({ token }){

    const { inputs, handleChange, resetForm } = useForm({
        email: '',
        password: '',
        token: token
    });

    const [reset, { data, loading, error }] = useMutation(RESET_MUTATION, {
        variables: inputs
    });

    const successfulError = data?.redeemwb_userPasswordResetToken?.code 
                    ? data?.redeemwb_userPasswordResetToken 
                    : undefined;

    async function handleSubmit(e) {

        //ОСТанавливаем Submit
        e.preventDefault();
        //console.log(inputs);
        const res = await reset().catch(console.error);

        //Выводим данные по пользователю, который авторизовывается
        //console.log(res);
        resetForm();

        //ОТПРАВЛЯЕМ email и password в GraphQl Api

    }

    return (
        <Form method="POST" onSubmit={handleSubmit}>

            <h2>Reset Your Password</h2>

            <Error error={error || successfulError} />

            <fieldset>

                {data?.redeemwb_userPasswordResetToken === null && (
                    <p>
                        Success! Sign In is waiting for you!
                    </p>
                )}

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

                <button type="submit">Request Reset</button>

            </fieldset>
        </Form>
    );

}