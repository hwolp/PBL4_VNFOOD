import React, { useState, useEffect } from 'react';
import { Button, Spinner, ListGroup, Card, Badge } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { shoppingListApi } from '../../services/api';
import { toast } from 'react-toastify';
import ShoppingListDetail from './ShoppingListDetail';

const ShoppingListTab = () => {
  const { isLoggedIn } = useAuth();
  const { darkMode, t } = useTheme();
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      fetchLists();
    }
  }, [isLoggedIn]);

  const fetchLists = async () => {
    setLoading(true);
    try {
      const response = await shoppingListApi.getAll();
      setLists(response.data);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách mua sắm:', err);
      toast.error(t('unableToLoadShoppingLists') || 'Không thể tải danh sách mua sắm');
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteList = async (listId, listName) => {
    if (!window.confirm(t('confirmDeleteShoppingList') || `Bạn có chắc muốn xóa "${listName}"?`)) {
      return;
    }

    try {
      await shoppingListApi.deleteList(listId);
      toast.success(t('shoppingListDeleted') || 'Đã xóa danh sách mua sắm');
      fetchLists();
      if (selectedList?.id === listId) {
        setSelectedList(null);
        setShowDetail(false);
      }
    } catch (err) {
      console.error('Lỗi khi xóa danh sách:', err);
      toast.error(err.response?.data?.detail || t('unableToDeleteShoppingList') || 'Không thể xóa danh sách mua sắm');
    }
  };

  const handleViewList = async (list) => {
    try {
      const response = await shoppingListApi.getDetail(list.id);
      setSelectedList(response.data);
      setShowDetail(true);
    } catch (err) {
      console.error('Lỗi khi lấy chi tiết danh sách:', err);
      toast.error(t('unableToLoadShoppingList') || 'Không thể tải chi tiết danh sách');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="text-center py-5">
        <p>{t('pleaseLogin')}</p>
        <Button variant="primary">{t('login')}</Button>
      </div>
    );
  }

  if (showDetail && selectedList) {
    return (
      <ShoppingListDetail
        list={selectedList}
        onBack={() => {
          setShowDetail(false);
          setSelectedList(null);
        }}
        onRefresh={fetchLists}
      />
    );
  }

  return (
    <>
      <div className="mb-5">
        <h4 className={`display-6 fw-bold mb-3 ${darkMode ? 'text-white' : 'text-dark'}`}>
          {t('shoppingLists') || '🛒 Danh sách mua sắm'}
        </h4>
        <p className={`fs-5 ${darkMode ? 'text-secondary' : 'text-muted'}`}>
          {t('shoppingListDescription') || 'Danh sách mua sắm được tạo tự động khi bạn nhận diện món ăn và thêm vào danh sách mua sắm.'}
        </p>
      </div>

      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">{t('loading') || 'Đang tải...'}</p>
        </div>
      )}

      {!loading && lists.length === 0 && (
        <div className="text-center py-5">
          <p className={`fs-4 ${darkMode ? 'text-secondary' : 'text-muted'}`}>
            {t('noShoppingLists') || 'Chưa có danh sách mua sắm nào. Hãy nhận diện món ăn và thêm vào danh sách mua sắm!'}
          </p>
        </div>
      )}

      {!loading && lists.length > 0 && (
        <div className="d-flex flex-column gap-3">
          {lists.map((list) => (
            <Card
              key={list.id}
              className={`shadow-sm ${darkMode ? 'bg-dark text-light border-secondary' : 'bg-white border-0'}`}
              style={{ borderRadius: '1rem' }}
            >
              <Card.Body className="p-4">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="flex-grow-1">
                    <h5 className="fw-bold mb-3">{list.name}</h5>
                    <div className="d-flex gap-3 align-items-center flex-wrap">
                      <Badge bg={darkMode ? 'secondary' : 'light'} text={darkMode ? 'light' : 'dark'} className="rounded-pill px-3 py-2">
                        {list.item_count || 0} {t('ingredients') || 'nguyên liệu'}
                      </Badge>
                      {list.checked_count > 0 && (
                        <Badge bg="success" className="rounded-pill px-3 py-2">
                          {t('checked') || 'Đã mua'}: {list.checked_count}
                        </Badge>
                      )}
                      <small className={`opacity-75 ${darkMode ? 'text-secondary' : 'text-muted'}`}>
                        {new Date(list.updated_at).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleViewList(list)}
                      className="rounded-4 px-3 py-2"
                    >
                      {t('view') || 'Xem'}
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteList(list.id, list.name)}
                      className="rounded-4 px-3 py-2"
                    >
                      🗑️ {t('delete') || 'Xóa'}
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};

export default ShoppingListTab;

