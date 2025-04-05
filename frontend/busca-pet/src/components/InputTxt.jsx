import style from "./styles/inputtxt.module.css";

function InputTxt({ name, place, refProp, required, type }) {
  return (
    <div className={style.imput}>
      <label className={style.imput__name}>{name}</label>
      <div className={style.imput__box}>
        <input
          className={style.imput__element}
          placeholder={place}
          ref={refProp}
          required={required}
          type={type}
        />
      </div>
    </div>
  );
}

export default InputTxt;
