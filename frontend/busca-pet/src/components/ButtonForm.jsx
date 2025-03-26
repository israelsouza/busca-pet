import React from 'react'
import styles from './styles/btn_form.module.css'

const ButtonForm = ({placeholder}) => {
  return (
    <input type="submit" value={placeholder} className={styles['btn-form']} />
  )
}

export default ButtonForm