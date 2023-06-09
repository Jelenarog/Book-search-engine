import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
// Import the `useMutation()` hook from Apollo Client
import { useMutation } from '@apollo/client';
// Import the GraphQL mutation
import { ADD_USER } from '../utils/mutations';
import { GET_ME } from '../utils/queries';
// import { createUser } from '../utils/API';
import Auth from '../utils/auth';

const SignupForm = () => {
  // set initial form state
  const [userFormData, setUserFormData] = useState({ username: '', email: '', password: '' });
  // set state for form validation
  const [validated] = useState(false);
  // set state for alert
  const [showAlert, setShowAlert] = useState(false);

    // Invoke `useMutation()` hook to return a Promise-based function and data about the ADD_USER mutation
    const [addUser, { error }] = useMutation(ADD_USER,{  
      // The update method allows us to access and update the local cache
      update(cache, { data: { addUser } }) {
        try {
          // First we retrieve existing user data that is stored in the cache under the `GET_ME` query
          // Could potentially not exist yet, so wrap in a try/catch
          const { user } = cache.readQuery({ query: GET_ME });
  
          // Then we update the cache by combining existing user data with the newly created data returned from the mutation
          cache.writeQuery({
            query: GET_ME,
            // If we want new data to show up before or after existing data, adjust the order of this array
            data: { user: [...user, addUser] },
          });
        } catch (e) {
          console.error(e);
        }
      },
    }

      );

  const handleInputChange = async (event) => {
    event.preventDefault();
    try {
      // Execute mutation and pass in defined parameter data as variables
      const { data } = await addUser({
        variables: {...userFormData},
      });

    } catch (err) {
      console.error(err);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // check if form has everything (as per react-bootstrap docs)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      const response = await createUser(userFormData);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const { token, user } = await response.json();
      console.log(user);
      Auth.login(token);
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    setUserFormData({
      username: '',
      email: '',
      password: '',
    });
  };

  return (
    <>
      {/* This is needed for the validation functionality above */}
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        {/* show alert if server response is bad */}
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your signup!
        </Alert>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='username'>Username</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your username'
            name='username'
            onChange={handleInputChange}
            value={userFormData.username}
            required
          />
          <Form.Control.Feedback type='invalid'>Username is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='email'
            placeholder='Your email address'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(userFormData.username && userFormData.email && userFormData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default SignupForm;
