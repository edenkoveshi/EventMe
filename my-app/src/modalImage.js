import React from 'react'
import { Button, Header, Image, Modal, Icon, BackgroundImage} from 'semantic-ui-react'
import ImageExampleFluid from './ImageExampleFluid.js'
import LoginForm from './LoginApp.js';

const ModalModalExample = () => (
  <Modal trigger= {<Button primary size='huge' >
                Get Started
                <Icon name='right arrow' />
              </Button>}
    >
    <Modal.Content BackgroundImage>
      <ImageExampleFluid/>
      <LoginForm/>
    </Modal.Content>
  </Modal>
)
export default ModalModalExample