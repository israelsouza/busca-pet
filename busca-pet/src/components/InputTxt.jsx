function InputTxt({ name, place }) {
  return (
    <div className="imput">
      <label className="imput__name" >{name}</label>
      <div className="imput__box">
        <input className="imput__element" type="text" placeholder={place} />
      </div>
    </div>
  );
}

export default InputTxt;
