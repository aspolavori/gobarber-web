import React, { useRef, useCallback } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link, useHistory} from 'react-router-dom';


import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import getValidationErros from '../../utils/getValidationErros';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import {Container, Content, AnimationContainer, Background} from './styles';
//import GlobalStyle from '../../styles/global';

interface SignInFormData{
  email: string;
  password: string;
}

const SignIn: React.FC = () =>{
    const formRef = useRef<FormHandles>(null);

   const {signIn} = useAuth();
   const {addToast} = useToast();
   const history = useHistory();

  //console.log(user);
  const handleSubmit = useCallback( async ( data : SignInFormData) => {
    try{
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({        
        email: Yup.string().required('Nome obrigatório').email('Digite um e-mail válido'),
        password: Yup.string().required('Senha obrigatória'),
      });

      await schema.validate(data, {
        abortEarly: false
      });
      await signIn({
        email: data.email,
        password: data.password,
      });
      history.push('/dashboard');
    }
    catch(err){
      if(err instanceof Yup.ValidationError){
        const errors = getValidationErros(err);
        formRef.current?.setErrors(errors);
        return; 
      }      
      addToast({
        type: 'error',
        title: 'Erro na autenticacao',
        description: 'Ocoreu um erro ao fazer o login, cheque as credenciais.',
      });
    }
  }, [signIn, addToast, history],);
  return(
    <Container>
      <Content> 
        <AnimationContainer>
        <img src={ logoImg } alt="GoBarber"/>
        <Form ref={formRef} onSubmit={handleSubmit} >
          <h1>Faça o seu logon</h1>
          <Input name="email" icon={FiMail} placeholder="E-mail" />
          <Input name="password" icon={FiLock} placeholder="Senha" type="password" />
          <Button type="submit">Entrar</Button>
          <Link to="forgot">Esqueci minha senha</Link>
        </Form>
        <Link to="/signup">
            <FiLogIn />
            Criar conta
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
  
}

export default SignIn;