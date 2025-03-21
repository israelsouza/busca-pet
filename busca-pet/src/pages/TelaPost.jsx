import React from 'react';
import styles from './styles.css';

const Home = () => {
  return (
    <div className={styles.container}>
      <h1>Você...</h1>
      <a href="/encontrou" className={`${styles.botao} ${styles.encontrou}`}>
        Encontrou um Pet
      </a>
      <a href="/perdeu" className={`${styles.botao} ${styles.perdeu}`}>
        Perdeu um Pet
      </a>
    </div>
  );
};

export default Home;