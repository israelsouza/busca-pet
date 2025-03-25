import style from "./styles/inputtxt.module.css";

function InputTxt({ name, place }) {
  return (
    <div className={style.imput}>
      <label className={style.imput__name}>{name}</label>
      <div className={style.imput__box}>
        <input
          className={style.imput__element}
          type="text"
          placeholder={place}
        />
      </div>
    </div>
  );
}

export default InputTxt;
