import React, { useMemo } from 'react';
import { Nav } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const Sidebar = ({ activeTab, onTabChange }) => {
  const { isLoggedIn } = useAuth();
  const { darkMode, t } = useTheme();

  const menuItems = useMemo(() => {
    const items = [
      { key: 'upload', icon: '📤', label: t('uploadImage') },
      { key: 'webcam', icon: '📸', label: t('recognize') },
      { key: 'dishes', icon: '🍜', label: t('browseDishes') },
    ];

    if (isLoggedIn) {
      items.push(
        { key: 'history', icon: '📚', label: t('history') },
        { key: 'favorites', icon: '❤️', label: t('favorites') },
        { key: 'shopping', icon: '🛒', label: t('shoppingList') || 'Danh sách mua sắm' }
      );
    }
    
    return items;
  }, [isLoggedIn, t]);

  return (
    <div
      className={`sticky-top ${darkMode ? 'bg-dark border-end border-secondary' : 'bg-light border-end'}`}
      style={{
        width: '260px',
        minHeight: '100vh',
        padding: '1.5rem 0',
        height: 'fit-content'
      }}
    >
      <Nav className="flex-column px-3 gap-2">
        {menuItems.map((item) => {
          const isActive = activeTab === item.key;
          const handleClick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isActive) {
              onTabChange(item.key);
            }
          };
          
          return (
            <div
              key={item.key}
              onClick={handleClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleClick(e);
                }
              }}
              className={`d-flex align-items-center gap-3 py-3 px-4 rounded-4 transition-all ${
                isActive
                  ? 'bg-primary text-white fw-semibold'
                  : `${darkMode ? 'text-secondary' : 'text-dark'} fw-medium`
              }`}
              style={{
                cursor: 'pointer',
                userSelect: 'none'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = darkMode ? '#2a2a2a' : '#e9ecef';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{item.icon}</span>
              <span className="fs-6">{item.label}</span>
            </div>
          );
        })}
      </Nav>
    </div>
  );
};

export default Sidebar;

