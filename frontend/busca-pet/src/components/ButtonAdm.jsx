import Style from '../components/styles/ButtonAdm.module.css';
import { Link } from "react-router-dom";
function ButtonAdm({funcao,image, alt,}){
    return(
            <div className={Style.ContainerBotao}>
                <div className={Style.funcao}>
                     <img src={image} alt={alt} className={Style.img}/>
                     <p>{funcao}</p>
                     <Link to={''} className={Style.link}/>
                </div> 
            </div>
    );

}

export default ButtonAdm;
