import React, { useState } from 'react';
import styles from './Input.module.css';

export default (props) => {
  const [state, setState] = useState({
    innerType: 'password',
  });

  const togglePasswordVisibility = () => {
    setState((prevState) => ({
      innerType: prevState.innerType === 'password' ? 'text' : 'password',
    }));
  };

  return (
    <>
      <div className={styles.div}>
        {props?.customType === 'password' ? (
          <img
            className={styles.eye}
            alt='show password'
            src={require('../../assets/images/eye.svg')}
            onClick={togglePasswordVisibility}
          />
        ) : null}
        <label
          className={
            props?.inputs[props.customType]?.message?.error
              ? props?.inputs[props.customType]?.animateUp
                ? styles.redUp
                : styles.redDown
              : props?.inputs[props.customType]?.animateUp
              ? styles.up
              : styles.down
          }>
          {props?.label || 'Label'}
        </label>
      </div>
      <input
        list={props?.list || ''}
        className={
          props?.inputs[props.customType]?.message?.error
            ? styles.redInput
            : props?.inputs[props.customType]?.animateUp
            ? styles.colorInput
            : styles.Input
        }
        value={props?.inputs[props.customType]?.value}
        type={
          props?.type === 'password' ? state.innerType : props?.type || 'text'
        }
        onBlur={props?.handleBlur.bind(props.customType)}
        onFocus={props?.handleFocus.bind(props.customType)}
        onChange={(e) => props.handleChange(e, props.customType)}
      />
      <p
        className={
          props?.inputs[props.customType]?.message?.error
            ? styles.redMessage
            : styles.message
        }>
        {props?.inputs[props.customType]?.message?.text}
      </p>
    </>
  );
};
