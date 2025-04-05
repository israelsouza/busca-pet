import React from 'react'
import styles from './styles/btn_form.module.css'

const ButtonForm = ({placeholder, algumaFuncao}) => {
  return (
    <input type="submit" value={placeholder} className={styles['btn-form']} onClick={algumaFuncao} />
  )
}

export default ButtonForm