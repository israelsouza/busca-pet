  import getConnection from "./connectionOracle.js";

  async function getPhotoAndName(email) {
    let connection;

    try {
      connection = await getConnection();

<<<<<<< HEAD
    const query = `
            SELECT USUARIO.USU_FOTO, PESSOA.PES_NOME
            FROM USUARIO, PESSOA
            WHERE
              PESSOA.PES_ID = USUARIO.PES_ID AND
              USUARIO.USU_EMAIL = :email
        `;

    const binds = {
      email: email,
    };
=======
      const query = `
              SELECT USUARIO.USU_FOTO, PESSOA.PES_NOME
              FROM USUARIO, PESSOA
              WHERE
                PESSOA.PES_ID = USUARIO.PES_ID AND
                USUARIO.USU_EMAIL = :email
          `;

      const binds = {
        email: email,
      };
>>>>>>> b8062f307c0da13e8b4ed66970f0ae308870d8a6

      const result = await connection.execute(query, binds);

      if (result.rows.length > 0) {
        const imagem = result.rows[0][0];
        const name = result.rows[0][1];
        return { imagem: imagem, nome: name, connection };
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
    } 
  }

  export default getPhotoAndName;
