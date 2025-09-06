import { Search } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import _ from 'lodash';
import './style.scss';

const MainLayoutSearchbox = ({
  value,
  onChange = () => { },
  placeholder
}) => {
  const [suggestions, setSuggestions] = useState(false);
  const [search, setSearch] = useState('');

  const handleMouseEnter = (event) => {
    setSuggestions([1]);
  }

  const handleMouseLeave = () => {
    setSuggestions(null);
  }

  const handleChangeText = (e) => {
    setSearch(e.target.value);
    onChange(e);
  }

  useEffect(() => {
    setSearch(value);
  }, [value])


  return (
    <div className="search-container">
      <div className={`search-box ${_.isEmpty(suggestions) ? '' : 'any-suggestions'}`} >
        <div className="search-icon">
          <Search />
        </div>
        <input
          type="text"
          value={search}
          onChange={handleChangeText}
          onFocus={handleMouseEnter}
          onBlur={handleMouseLeave}
          className={`pl-10 pr-4 py-2 search-input`}
          placeholder={placeholder}
        />
        {!_.isEmpty(search) &&
          <div className="suggestions">
            <div className='search-item'>
              <Search sx={{ width: '20px', heigth: '20px' }} />
              <span>Tìm kiếm: </span>
              {search}
            </div>
            <div className="suggestion-item">
              {`Thông tin cá nhân`}
            </div>
            <div className="suggestion-item">
              {`Thông tin cá nhân`}
            </div>
            <div className='divider' />
          </div>
        }
      </div>
    </div >
  )
}

export default MainLayoutSearchbox;