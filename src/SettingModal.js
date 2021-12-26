import React, { useState, useEffect, useRef } from "react";
import { Modal } from "react-bootstrap";

function SettingModal(props) {
  const [modalMin, setModalMin] = useState(1);
  const [modalMax, setModalMax] = useState(31);
  const [hint, setHint] = useState('');

  function hideModal() {
    setModalMin(props.min);
    setModalMax(props.max);
    props.setIsOpen(false);
  }

  useEffect(() => {
    try {
      const tempMin = localStorage.getItem('min');
      const tempMax = localStorage.getItem('max');
      if (tempMin && tempMax) {
        props.setMin(tempMin);
        props.setMax(tempMax);
        setModalMin(tempMin);
        setModalMax(tempMax);
      }
    } catch (error) {
      
    }
  }, []);

  function apply() {
    if (modalMin >= modalMax) {
      setHint('最小值不能大於等於最大值');
    } else {
      props.setMin(modalMin);
      props.setMax(modalMax);
      try {
        localStorage.setItem('min', modalMin);
        localStorage.setItem('max', modalMax);
      } catch (error) {
        
      }
      setHint('');
      props.setIsOpen(false);
    }
  }

  return (
    <Modal show={props.isOpen} onHide={hideModal}>
      <Modal.Header>
        <h5 className="modal-title" id="settingModalLabel">
          參與名單設定-編號範圍
        </h5>
        <button
          type="button"
          className="btn-close"
          onClick={() => props.setIsOpen(false)}
        ></button>
      </Modal.Header>
      <Modal.Body>
        {/* <div className="typeBox">
              <button></button>
              <button></button>
            </div> */}
        {/* <textarea placeholder="名字請用逗號隔開"></textarea> */}
        <div className="range">
          <input
            type="number"
            value={modalMin}
            onChange={(e) => setModalMin(e.target.value)}
          />
          <span>到</span>
          <input
            type="number"
            value={modalMax}
            onChange={(e) => setModalMax(e.target.value)}
          />
        </div>
        {hint ? <p>{hint}</p> : "" }
      </Modal.Body>
      <Modal.Footer className="modal-footer">
        <button type="button" className="btn btn-primary" onClick={apply}>
          套用
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default SettingModal;
