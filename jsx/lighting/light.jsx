import React, {Component} from 'react'
import LightChannel from './channel'
import { FaAngleDown, FaAngleUp } from 'react-icons/fa'
import PropTypes from 'prop-types'
import {confirm} from 'utils/confirm'
import {showError} from 'utils/alert'

class Light extends Component {
  constructor (props) {
    super(props)

    this.state = {
      id: props.values.config.id,
      name: props.values.config.name,
      jack: props.values.config.jack,
      readOnly: true,
      expand: false
    }

    this.handleEdit = this.handleEdit.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.toggleExpand = this.toggleExpand.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
  }

  handleFormSubmit (event) {
    event.preventDefault()
    if (this.props.dirty === false || this.props.isValid) {
      this.props.submitForm()
      this.setState({readOnly: true, expand: false})
    } else {
      this.props.submitForm() // Calling submit form in order to show validation errors
      showError('The light settings cannot be saved due to validation errors.  Please correct the errors and try again.')
    }
  }

  handleEdit (e) {
    e.stopPropagation()
    this.setState({readOnly: false, expand: true})
  }

  handleDelete (e) {
    e.stopPropagation()
    const message = (
      <div>
        <p>This action will delete {this.props.config.name} and its configuration.</p>
      </div>
    )

    confirm('Delete ' + this.props.config.name, {description: message})
      .then(function () {
        this.props.remove(this.props.config.id)
      }.bind(this))
  }

  toggleExpand () {
    this.setState({expand: !this.state.expand})
  }

  render () {
    let channels = <div />
    let action = <div />
    let editButton = <span />

    if (this.state.expand) {
      channels = Object.keys(this.props.values.config.channels).map((item) => (
        <LightChannel
          {...this.props}
          key={item}
          name={'config.channels.' + item}
          readOnly={this.state.readOnly}
          onBlur={this.props.handleBlur}
          onChangeHandler={this.props.handleChange}
          channel={this.props.values.config.channels[item]}
          channelNum={item} />
      ))
    }

    if (this.state.readOnly) {
      editButton = (
        <button type='button'
          onClick={this.handleEdit}
          id={'edit-light-' + this.state.id}
          className='btn btn-sm btn-outline-primary float-right d-block d-sm-inline ml-2'>
          Edit
        </button>
      )
    } else {
      action = (
        <div className='clearfix'>
          <input
            type='submit'
            value='Save'
            className='btn btn-primary float-right'
            id={'save-light-' + this.state.id} />
        </div>
      )
    }

    return (
      <form onSubmit={this.handleFormSubmit}>
        <div>
          <div className='row mb-1 cursor-pointer text-center text-md-left'
            id={'expand-light-' + this.state.id}
            onClick={this.toggleExpand}>
            <div className='col-12 col-sm-6 col-md-4 col-lg-3 order-sm-2 order-md-last'>
              <button type='button'
                id={'delete-light-' + this.state.id}
                onClick={this.handleDelete}
                className='btn btn-sm btn-outline-danger float-right d-block d-sm-inline ml-2'>
                Delete
              </button>
              {editButton}
            </div>
            <div className='col-12 col-sm-6 col-md-8 col-lg-9 order-sm-first form-inline'>
              {this.state.expand ? FaAngleUp() : FaAngleDown()}
              <b className='ml-2 align-middle'>{this.state.name}</b>
            </div>
          </div>
          {channels}
        </div>
        {this.state.expand ? action : ''}
      </form>
    )
  }
}

Light.propTypes = {
  config: PropTypes.object.isRequired,
  save: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired
}

export default Light
