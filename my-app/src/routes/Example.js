import React, { Component } from 'react'
import style from '../style.js';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  List,
  Menu,
  Segment,
  Visibility,
  Modal,
  Item,
  Dimmer,
  TextArea,
  Form
} from 'semantic-ui-react'

const FixedMenu = () => (
  <Menu fixed='top' size='large'>
    <Container style={style.container}>
    <Menu.Item as='a' active>When?</Menu.Item>
     <Menu.Item as='a'>Activity</Menu.Item>
     <Menu.Item as='a'>Who With?</Menu.Item>
      <Menu.Menu position='right'>
      </Menu.Menu>
    </Container>
  </Menu>
)

export default class Example extends Component {
    constructor (props) {
    super(props)
    this.state = {
      startDate: moment(),
      isOpen: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.toggleCalendar = this.toggleCalendar.bind(this);
  }

handleChange (date) {
  this.setState({startDate: date})
  this.toggleCalendar()
}

toggleCalendar (e) {
  e && e.preventDefault()
  this.setState({isOpen: !this.state.isOpen})
}

  hideFixedMenu = () => this.setState({ visible: false })
  showFixedMenu = () => this.setState({ visible: true })

  render() {
    const { visible } = this.state

    return (
      <div>
        { visible ? <FixedMenu /> : null }

        <Visibility
          onBottomPassed={this.showFixedMenu}
          onBottomVisible={this.hideFixedMenu}
          once={false}
        >
          <Segment
            inverted
            textAlign='center'
            style={{ minHeight: 700, padding: '1em 0em'}}
            vertical

          >
            <Container>
              <Menu fixed='top' size='large'>
                <Container>
                <Menu.Item as='a' active>When?</Menu.Item>
                <Menu.Item as='a'>Activity</Menu.Item>
                <Menu.Item as='a'>Who With?</Menu.Item>
                <Menu.Menu position='right'>
                </Menu.Menu>
                </Container>
              </Menu>
            </Container>
            <Container text>
              <Header
                as='h1'
                content='When?'
                inverted
                style={{ fontSize: '4em', fontWeight: 'normal', marginBottom: 0, marginTop: '3em' }} />
                    <button
        className="example-custom-input"
        onClick={this.toggleCalendar}>
        {this.state.startDate.format("DD-MM-YYYY HH:mm")}
    </button>
    {this.state.isOpen && ( <DatePicker
                selected={this.state.startDate}
                onChange={this.handleChange}
                withPortal
                inline
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="LLL" />)}
            </Container>
          </Segment>
        </Visibility>
      </div>
    )
  }
}

