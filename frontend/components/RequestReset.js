import Form from './styles/Form';
import useForm from '../lib/useForm';
import { gql } from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { CURRENT_USER_QUERY } from './User';
import Error from './ErrorMessage';

const REQUEST_RESET_MUTATION = gql`

    mutation REQUEST_RESET_MUTATION($email: String!) {

        sendwb_userPasswordResetLink(email: $email)
        
    }

`;

export default function RequestReset(){

    const { inputs, handleChange, resetForm } = useForm({
        email: ''
    });

    const [signup, { data, loading, error }] = useMutation(REQUEST_RESET_MUTATION, {
        variables: inputs,
        refetchQueries: [{ query: CURRENT_USER_QUERY }]
    });

    async function handleSubmit(e) {

        //ОСТанавливаем Submit
        e.preventDefault();
        //console.log(inputs);
        const res = await signup().catch(console.error);

        //Выводим данные по пользователю, который авторизовывается
        //console.log(res);
        resetForm();

        //ОТПРАВЛЯЕМ email и password в GraphQl Api

    }

    return (
        <Form method="POST" onSubmit={handleSubmit}>

            <h2>Request a password reset</h2>

            <Error error={error} />

            <fieldset>

                {data?.sendwb_userPasswordResetLink && (
                    <p>
                        Check your Email for a link!
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

                <button type="submit">Request Reset</button>

            </fieldset>
        </Form>
    );

}