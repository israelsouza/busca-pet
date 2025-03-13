import listagem from "./../imgs/listagem.png"
import lupa_pesquisa from "./../imgs/lupa_pesquisa.png"

function PageResearch(){
    return <body>
            <button><img src={listagem} alt="Ícone de listagem" />Pesquise por Bairro, Espécie, Data, Usar localização atual...<img src={lupa_pesquisa} alt="Ícone de lupa de pesquisa" /></button>
        </body>
    
}