import { useEffect, useState } from 'react';

export default function useForm(initial = {}) {

    //Создаём состояние объекта для нашего инпута
    const [inputs, setInputs] = useState(initial);

    //useEffect нужен тут чтобы если для формы есть данные, они заплняли форму
    //Так как не всегда initial успевает получать данные из бд
    const initialValues = Object.values(initial).join('');

    useEffect(() => {
        //Эта функция запускается когда сущности меняются
        setInputs(initial);
    }, [initialValues]);

    //console.log('initialValues = ' + initialValues);
    //console.log('initial.values = ' + Object.values(initial));

    // {
    //     name: 'Wes',
    //     description: 'Nice shoes',
    //     price: 1000
    // }

    function handleChange(e) {

        let { value, name, type } = e.target;

        if (type === 'file') {
            [value] = e.target.files;
        }

        if (type === 'number') {
            value = (isNaN(value) || value <= 0) ? parseInt(1) : parseInt(value);
        }

        setInputs({
            //Копируем существующий state
            ...inputs,
            [name]: value
        });
    }

    function resetForm() {
        setInputs(initial);
    }

    function clearForm() {
        const blankState = Object.fromEntries(
            Object.entries(inputs).map(([key, value]) => [key, ''])
        );

        setInputs(blankState);

    }

    return {
        inputs,
        handleChange,
        resetForm,
        clearForm
    }

}