import React, {useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { languageOptions, languageOptionsUSA } from '../languages'
import { LanguageContext } from '../common/LanguageProvider'
import LanguageModal from './LanguageModal';

export default function LanguageSelector(props) {
  const { userLanguage, userLanguageChange } = useContext(LanguageContext)

  // set selected language by calling context method
  const handleLanguageChange = (e) => userLanguageChange(e.target.value)
 
  // check if modal should be displayed on first visit
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    const visitedBefore = localStorage.getItem('visitedBefore');
    if (!visitedBefore) {
      setShowModal(true);
      localStorage.setItem('visitedBefore', true);
    }
  }, []);

  const location = useLocation();
  const ShowLanguagesUSA = location.pathname.startsWith('/usa');

  //Responsive Design
  const [width, setWidth] = useState(window.innerWidth);
  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
        window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, []);

  let isMobile = (width <= 768);

  return (
    <>
      <select
        className={props.className}
        onChange={handleLanguageChange}
        value={userLanguage}
        style={{ marginLeft: 10, background:'#fafbfd', border:0, fontSize:'13px', marginTop:isMobile?'14px':'0' }}
      >
      {ShowLanguagesUSA ?
        <>
          {Object.entries(languageOptionsUSA).map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </>
        :<>
          {Object.entries(languageOptions).map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </>}
      </select>
      {showModal && <LanguageModal closeModal={() => setShowModal(false)} />}
    </>
  )
}
