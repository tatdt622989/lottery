import React, { useState, useEffect } from "react";
import "./App.scss";
import "swiper/css/bundle";
import SwiperCore, { Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import SettingModal from "./SettingModal";
import Winner from "./Winner";
import { ReactComponent as Gear } from "./images/gear.svg";
// import { ReactComponent as Reset } from "./images/arrow-clockwise.svg";

SwiperCore.use([Autoplay]);

function App() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(31);
  const [isOpen, setIsOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [numList, setNumList] = useState([]);
  const [winnerList, setWinnerList] = useState([]);
  const [isDirty, setIsDirty] = useState(false);

  function randomList(ary) {
    let n = ary.length;
    const newAry = [...ary];

    while (n) {
      n--;
      const i = Math.floor(Math.random() * n);
      const temp = newAry[n];
      newAry[n] = newAry[i];
      newAry[i] = temp;
    }

    return newAry;
  }

  /**
   * 產生亂數陣列
   */
  function getNumList() {
    setWinnerList([]);
    setIsDirty(false);
    const length = parseInt(max) - parseInt(min) + 1;
    let ary = [];
    for (let i = 0; i < length; i++) {
      const num = parseInt(min) + i;
      const str = num < 10 ? "0" + num : num;
      ary.push(str);
    }
    ary = randomList(ary);
    setNumList(ary);
  }

  function numListFilter(index) {
    let ary = numList.filter((el, i) => index !== i);
    ary = randomList(ary);
    setNumList(ary);
  }

  useEffect(() => {
    getNumList();
  }, [min, max]);

  useEffect(() => {
    
  }, []);

  return (
    <div className="App">
      <div className="content">
        <div className="toolBox">
          {/* <button>
            <Reset />
          </button> */}
          <button onClick={() => isRunning ? null : setIsOpen(true)}>
            <Gear />
          </button>
        </div>
        <div className="generator">
          <div className="main">
            <div className="wrap">
              <List
                isRunning={isRunning}
                setIsRunning={setIsRunning}
                min={min}
                max={max}
                numList={numList}
                getNumList={getNumList}
                numListFilter={numListFilter}
                setWinnerList={(index) => setWinnerList([...winnerList, numList[index]])}
                isDirty={isDirty}
                setIsDirty={setIsDirty}
              />
            </div>
          </div>
          <button onClick={() => setIsRunning(true)}>
            {isRunning ? "RUNNING..." : "START"}
          </button>
        </div>
      </div>
      <Winner winnerList={winnerList} />
      <SettingModal
        min={min}
        setMin={setMin}
        max={max}
        setMax={setMax}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        getNumList={getNumList}
      />
    </div>
  );
}

/**
 * 數字輪播元件
 * @param {} props 
 * @returns 
 */
function List(props) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [swiper, setSwiper] = useState(null);
  const itemList = props.numList.map((num, i) => (
    <SwiperSlide key={num} className={i === activeIndex ? 'active' : ''}><p>{num}</p></SwiperSlide>
  ));
  const [speedOffset, setSpeedOffset] = useState(0);

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  useEffect(() => {
    if (swiper) {
      if (props.isRunning) {
        if (activeIndex >= 0 && activeIndex !== null && props.isDirty) {
          props.numListFilter(activeIndex);
        } else {
          props.getNumList();
          props.setIsDirty(true);
        }
        setActiveIndex(null);
      }
    }
  }, [props.isRunning]);

  useEffect(() => {
    console.log('numList update');
    if (swiper) {
      if (props.isRunning) {
        swiper.autoplay.start();
        setTimeout(() => {
          setSpeedOffset(getRandomInt(100, 120));
        }, getRandomInt(1000, 2000));
      }
    }
  }, [props.numList]);

  useEffect(() => {
    if (swiper) {
      swiper.autoplay.stop();
    }
  }, [swiper]);

  useEffect(() => {
    if (activeIndex >= 0 && activeIndex !== null) {
      props.setWinnerList(activeIndex);
    }
  }, [activeIndex]);

  useEffect(() => {
    if (!props.isDirty) {
      setActiveIndex(null);
    }
  },[props.isDirty])

  return (
    <Swiper
      loop={true}
      slidesPerView={3}
      onSlideChange={() => {
        if (swiper && speedOffset) {
          if (swiper.params.speed <= 1000) {
            swiper.params.speed += speedOffset;
            if (swiper.params.speed > 800 && swiper.params.speed <= 950 && getRandomInt(0, 2)) {
              console.log('reverse');
              swiper.autoplay.stop();
            }
          } else {
            swiper.autoplay.stop();
            setSpeedOffset(0);
          }
        }
      }}
      onAutoplayStop={() => {
        setTimeout(() => {
          if (props.isRunning && swiper.params.speed <= 1000) {
            swiper.params.autoplay.reverseDirection = true;
            swiper.update();
            swiper.autoplay.start();
          } else {
            if (props.isDirty) {
              swiper.params.speed = 100;
              setActiveIndex(swiper.realIndex);
              props.setIsRunning(false);
              swiper.params.autoplay.reverseDirection = false;
              swiper.update();
            }
          }
        }, 1000)
      }}
      speed={100}
      allowTouchMove={false}
      centeredSlides={true}
      centeredSlidesBounds={true}
      autoplay={{
        delay: 1,
        disableOnInteraction: false,
      }}
      observer={true}
      onSwiper={(swiper) => setSwiper(swiper)}
    >
      {itemList}
    </Swiper>
  );
}

export default App;
