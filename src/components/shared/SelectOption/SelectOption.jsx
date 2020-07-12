import React from "react";
import './SelectOption.scss';


const SelectOption = props => {
  const { selectedOption, arrOption, setOption, onInputChange } = props;

  function onSubmitInput(e){
    e.preventDefault();
    console.log(e, e.target, onInputChange)
    if(onInputChange && e.target)  onInputChange(e.target.address.value)
    
  }

  return (
    <div className='btn-group select-option'>
      <div className="sort-options" >
        <button className="dropdown btn btn-toggle-custom selected-option" data-toggle='dropdown'>
          {selectedOption.text}
          <i className='ml-3 mt-1 fas fa-chevron-down rotate-focus' />
        </button>
        <div className='dropdown-menu' id='sort'>
        {arrOption.map((item, index) => {
          if(item.type !== 'input'){
            return (
              <button
                className='dropdown-item'
                key={index}
                type='button'
                onClick={e => {
                  setOption(index);
                  console.log(e);
                }}
              >
                {item.text}
              </button>
            );
          }else{
            return (
              <form key={index} onSubmit={onSubmitInput}>
                <input className="custom-input" name="address" type="text" placeholder="Khác"/>
              </form>
            );
          }
          
        })}
      </div>
      </div>
      
    </div>
  );
};

export default SelectOption;
