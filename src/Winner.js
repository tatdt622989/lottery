import { ReactComponent as Trophy } from "./images/trophy-fill.svg";

function Winner(props) {
  return(
    <div className="winnerArea">
      <div className="titleBox">
        <p className="title">WINNER</p>
        <Trophy />
      </div>
      <ul className="winnerList">
        {
          props.winnerList.map((el, i) => <li key={el} className="item"><p>{`${i + 1}.\u00A0\u00A0`}<span>{el}</span></p></li>)
        }
      </ul>
    </div>
  )
}

export default Winner;