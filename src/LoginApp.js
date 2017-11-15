import React from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment, Modal, Icon, style } from 'semantic-ui-react'
import ImageExampleFluid from './ImageExampleFluid.js'

const LoginForm = () => (
  <div className='login-form'>
    {/*
      Heads up! The styles below are necessary for the correct render of this example.
      You can do same with CSS, the main idea is that all the elements up to the `Grid`
      below must have a height of 100%.
    */}
    <Modal 
    trigger= {<Button primary size='huge' >
                Get Started
                <Icon name='right arrow' />
              </Button>}
    >

    <Modal.Content BackgroundImage='./newyork.jpg'>

    <Grid
      textAlign='center'
      BackgroundImage='./newyork.jpg'
      style={{ height: '100%'}}
      verticalAlign='middle'
    >
      <Grid.Column style={{ maxWidth: 450}} >
        <Header as='h2' color='teal' textAlign='center'>
          {' '}Log-in to your account
        </Header>
        <Form size='large'>
          <Segment stacked>
            <Form.Input
              fluid
              icon='user'
              iconPosition='left'
              placeholder='E-mail address'/>
            <Form.Input
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='Password'
              type='password'/>

            <Button color='teal' fluid size='large'>Login</Button>
          </Segment>
        </Form>
        <Message>
          New to us? <a href='#'>Sign Up</a>
        </Message>
      </Grid.Column>
    </Grid>
      </Modal.Content>
      </Modal>
  </div>
)

export default LoginForm
