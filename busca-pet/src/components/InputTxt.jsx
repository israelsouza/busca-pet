function InputTxt({name, place}) {
    return <div>
        <label>{name}</label>
        <div>
            <input type="text" placeholder={place} />
        </div>
    </div>
}

export default InputTxt