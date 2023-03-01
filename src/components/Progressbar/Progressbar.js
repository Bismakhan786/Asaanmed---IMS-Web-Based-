import React from "react";
import './Progressbar.css'

const ProgressBar = (props) => {
  const { bgcolor, completed, progressText } = props;

  const containerStyles = {
    height: 15,
    // width: '100%',
    backgroundColor: "#e0e0de",
    borderRadius: 50,
    margin: 50
  }

  const fillerStyles = {
    height: '100%',
    width: `${completed}%`,
    backgroundColor: bgcolor,
    borderRadius: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  }

  const labelStyles = {
    padding: 5,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 10
  }
  const bottomTextStyle = {
    fontSize: 11,
    marginTop: '5px',
    textAlign: 'center'
  }

  

  return (
    <div style={containerStyles}>
    <div style={fillerStyles}>
      <span style={labelStyles}>{`${completed}%`}</span>
    </div>
    <p style={bottomTextStyle}>{progressText}</p>
    
  </div>
  );
};

export default ProgressBar;