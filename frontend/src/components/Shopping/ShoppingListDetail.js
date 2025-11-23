import React, { useState } from 'react';
import { Button, ListGroup, Form, Badge, Card } from 'react-bootstrap';
import { useTheme } from '../../contexts/ThemeContext';
import { shoppingListApi } from '../../services/api';
import { toast } from 'react-toastify';

const ShoppingListDetail = ({ list, onBack, onRefresh }) => {
  const { darkMode, t } = useTheme();
  const [items, setItems] = useState(list.items || []);

  const handleToggleCheck = async (item) => {
    try {
      const response = await shoppingListApi.updateItem(list.id, item.id, {
        is_checked: !item.is_checked,
        ingredient_name: item.ingredient_name,
        quantity: item.quantity
      });
      
      setItems(items.map(i => i.id === item.id ? response.data : i));
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Lỗi khi cập nhật item:', err);
      toast.error(t('unableToUpdateItem') || 'Không thể cập nhật item');
    }
  };

  const handleUpdateQuantity = async (item, newQuantity) => {
    try {
      const response = await shoppingListApi.updateItem(list.id, item.id, {
        ingredient_name: item.ingredient_name,
        quantity: newQuantity,
        is_checked: item.is_checked
      });
      
      setItems(items.map(i => i.id === item.id ? response.data : i));
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Lỗi khi cập nhật số lượng:', err);
      toast.error(t('unableToUpdateItem') || 'Không thể cập nhật item');
    }
  };


  const handleDeleteItem = async (itemId) => {
    try {
      await shoppingListApi.deleteItem(list.id, itemId);
      setItems(items.filter(i => i.id !== itemId));
      if (onRefresh) onRefresh();
      toast.success(t('itemDeleted') || 'Đã xóa item');
    } catch (err) {
      console.error('Lỗi khi xóa item:', err);
      toast.error(err.response?.data?.detail || t('unableToDeleteItem') || 'Không thể xóa item');
    }
  };

  const checkedCount = items.filter(i => i.is_checked).length;
  const totalCount = items.length;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div className="d-flex align-items-center gap-3">
          <Button
            variant="outline-secondary"
            onClick={onBack}
            className="rounded-4 px-3 py-2"
          >
            ← {t('back') || 'Quay lại'}
          </Button>
          <h4 className={`display-6 fw-bold ${darkMode ? 'text-white' : 'text-dark'}`}>
            {list.name}
          </h4>
        </div>
        <Badge bg="info" className="fs-6 px-4 py-2 rounded-pill">
          {checkedCount}/{totalCount} {t('completed') || 'đã mua'}
        </Badge>
      </div>


      {items.length === 0 ? (
        <div className="text-center py-5">
          <p className={`fs-4 ${darkMode ? 'text-secondary' : 'text-muted'}`}>
            {t('noItemsInList') || 'Danh sách trống. Hãy thêm nguyên liệu!'}
          </p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {items.map((item) => (
            <Card
              key={item.id}
              className={`shadow-sm ${darkMode ? 'bg-dark text-light border-secondary' : 'bg-white border-0'}`}
              style={{
                borderRadius: '1rem',
                textDecoration: item.is_checked ? 'line-through' : 'none',
                opacity: item.is_checked ? 0.6 : 1
              }}
            >
              <Card.Body className="p-4">
                <div className="d-flex align-items-center gap-3">
                  <Form.Check
                    type="checkbox"
                    checked={item.is_checked || false}
                    onChange={() => handleToggleCheck(item)}
                    className="fs-5"
                  />
                  <div className="flex-grow-1">
                    <strong className="fs-5 fw-semibold">{item.ingredient_display_name || item.ingredient_name}</strong>
                    {item.quantity && (
                      <span className={`ms-2 ${darkMode ? 'text-secondary' : 'text-muted'}`}>
                        ({item.quantity})
                      </span>
                    )}
                  </div>
                  <div className="d-flex gap-2 align-items-center">
                    <Form.Control
                      type="text"
                      size="sm"
                      value={item.quantity || ''}
                      onChange={(e) => handleUpdateQuantity(item, e.target.value)}
                      onBlur={(e) => {
                        if (e.target.value !== item.quantity) {
                          handleUpdateQuantity(item, e.target.value);
                        }
                      }}
                      placeholder={t('quantity') || 'Số lượng'}
                      className={`rounded-4 ${darkMode ? 'bg-dark text-light border-secondary' : 'bg-white border'}`}
                      style={{ width: '120px' }}
                    />
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteItem(item.id)}
                      className="rounded-4 px-3"
                    >
                      🗑️
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

export default ShoppingListDetail;

