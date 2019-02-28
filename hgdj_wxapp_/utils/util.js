import {$digest, $init} from '../lib/page.data'
import {$request, Session} from '../lib/page.auth'

const {regeneratorRuntime} = global

let api = require('api.js');

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getFormIds = formId => {
    console.log(formId);
    if (formId && formId !== 'the formId is a mock one') 
    {
        $request({url: api.get_form_id, data: { formId: formId }, method: 'POST'})
    }
}

module.exports = {
  formatTime: formatTime,
  getFormIds: getFormIds
}
