import React, { useState, useRef, useEffect } from 'react';
import Invoice from '../invoice/templateInvoice';
import InvoiceExport from '../invoice/templateExport';
import { useSearchParams } from 'react-router-dom';
import {
  FaSort,
  FaArrowUp,
  FaArrowDown,
  FaSearch,
  FaEye,
  FaEllipsisV,
} from 'react-icons/fa';
import { BsDownload, BsSend } from 'react-icons/bs';
import { useAllOrders } from '@/hooks/useOrder';
import SendInvoiceModal from '../invoice/SendInvoiceModal';
import AdminPagination from '../AdminPagination';
import OrderFilterPanel from './OrderFilterPanel';
import OrderDetail from './OrderDetail';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { AllOrder } from '@/types/Order.type';
import { ToastConfigAdmin } from '@/components/common/ToastConfig';
import {
  getStatusText,
  getStatusColor,
} from '@/components/pages/admin/order/OrderCommon';
import html2pdf from 'html2pdf.js';
import html2canvasPro from 'html2canvas-pro';

const forceBasicColors = (element: HTMLElement) => {
  try {
    const basicColorStyles = document.createElement('style');
    basicColorStyles.id = 'basic-colors-override';
    basicColorStyles.textContent = `
      * {
        color: auto;
        background: transparent !important;
      
      }

    `;

    element.appendChild(basicColorStyles);

    return basicColorStyles;
  } catch (error) {
    console.error('Error forcing basic colors:', error);
    return null;
  }
};

const OrderTable: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [search, setSearch] = useState(searchParams.get('keyword') || '');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [menuDirection, setMenuDirection] = useState<'down' | 'up'>('down');
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState<string | null>(null);
  const [invoiceDataExport, setInvoiceDataExport] = useState<string | null>(
    null,
  );
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [invoiceReadyForPDF, setInvoiceReadyForPDF] = useState(false);
  const [selectedOrderForEmail, setSelectedOrderForEmail] =
    useState<AllOrder | null>(null);

  const handleInvoiceReady = () => {
    setInvoiceReadyForPDF(true);
  };

  const {
    data: orders,
    isLoading,
    error,
  } = useAllOrders({
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 10,
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
    filters: Object.fromEntries(
      searchParams as any as Iterable<[string, string]>,
    ),
  });

  const exportPDF = async () => {
    if (!invoiceRef.current || !invoiceDataExport) {
      console.error('Invoice ref or data not found');
      return;
    }

    try {
      setIsGeneratingPDF(true);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const element = invoiceRef.current;

      if (!element.innerHTML.trim()) {
        console.error('Invoice content is empty');
        return;
      }
      const clonedElement = element.cloneNode(true) as HTMLElement;

      clonedElement.style.position = 'absolute';
      clonedElement.style.left = '10px';
      clonedElement.style.top = '0px';
      clonedElement.style.width = '210mm';
      clonedElement.style.minHeight = '297mm';
      clonedElement.style.backgroundColor = 'white';
      clonedElement.style.visibility = 'visible';
      clonedElement.style.zIndex = '-1000';

      document.body.appendChild(clonedElement);

      const styleSheet = forceBasicColors(clonedElement);

      await new Promise((resolve) => setTimeout(resolve, 500));

      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `invoice-${invoiceDataExport}.pdf`,
        image: {
          type: 'jpeg',
          quality: 0.95,
        },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          width: clonedElement.offsetWidth,
          height: clonedElement.offsetHeight,
          scrollX: 0,
          scrollY: 0,
          html2canvas: html2canvasPro || undefined,
        },
        jsPDF: {
          unit: 'in',
          format: 'a4',
          orientation: 'portrait',
          compress: true,
        },
        pagebreak: {
          mode: ['avoid-all', 'css', 'legacy'],
        },
      };

      await html2pdf().set(opt).from(clonedElement).save();
      if (styleSheet && styleSheet.parentNode) {
        styleSheet.parentNode.removeChild(styleSheet);
      }
      if (clonedElement.parentNode) {
        clonedElement.parentNode.removeChild(clonedElement);
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('oklch') || errorMessage.includes('color')) {
        console.log('Có lỗi với màu sắc khi xuất PDF');
      } else {
        alert(`Có lỗi xảy ra khi xuất PDF: ${errorMessage}`);
      }
    } finally {
      setIsGeneratingPDF(false);

      const remainingStyles = document.getElementById('basic-colors-override');
      if (remainingStyles) {
        remainingStyles.remove();
      }
    }
  };

  const handleExportPDF = async (orderId: string) => {
    try {
      setInvoiceDataExport(orderId); // Sử dụng state riêng cho export
      setInvoiceReadyForPDF(true);
      handleMenuClose();
    } catch (error) {
      console.error('Error preparing PDF export:', error);
    }
  };

  useEffect(() => {
    if (invoiceReadyForPDF && invoiceDataExport && invoiceRef.current) {
      exportPDF();
      setInvoiceReadyForPDF(false);
    }
  }, [invoiceReadyForPDF, invoiceDataExport]);

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (search) {
      newParams.set('keyword', search);
    } else {
      newParams.delete('keyword');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSort = (field: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    const currentSortBy = searchParams.get('sortBy');
    const currentSortOrder = searchParams.get('sortOrder');

    if (currentSortBy === field) {
      newParams.set('sortOrder', currentSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      newParams.set('sortBy', field);
      newParams.set('sortOrder', 'asc');
    }

    setSearchParams(newParams);
  };

  const getSortIcon = (field: string) => {
    if (searchParams.get('sortBy') !== field) return null;
    return searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc';
  };

  const renderSortIcon = (field: string) => {
    const iconType = getSortIcon(field);
    if (iconType === 'asc') return <FaArrowUp />;
    if (iconType === 'desc') return <FaArrowDown />;
    return <FaSort />;
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'CASH':
        return 'Tiền mặt';
      case 'CREDIT_CARD':
        return 'Thẻ tín dụng';
      case 'MOMO':
        return 'Ví MoMo';
      case 'VNPAY':
        return 'VNPay';
      default:
        return method;
    }
  };

  const getDeliveryTypeText = (type: string) => {
    switch (type) {
      case 'DELIVERY':
        return 'Giao hàng';
      case 'PICKUP':
        return 'Nhận tại cửa hàng';
      default:
        return type;
    }
  };

  const getCustomerName = (order: AllOrder) => {
    if (order.address_id?.full_name) {
      const name = order.address_id?.full_name;
      return name;
    }
    if (order.receiver) {
      return order.receiver;
    }
    return 'Chưa có tên khách hàng';
  };

  const getCustomerPhone = (order: AllOrder) => {
    if (order.address_id?.phone) {
      const phone = order.address_id?.phone;
      return phone;
    }
    if (order.receiver_phone) {
      return order.receiver_phone;
    }
    return 'Chưa có số điện thoại';
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'HH:mm - dd/MM/yyyy', {
        locale: vi,
      });
    } catch {
      return 'N/A';
    }
  };

  const handleViewOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
  };

  const handleCloseOrderDetail = () => {
    setSelectedOrderId(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        handleMenuClose();
      }
    };

    if (menuOpenId) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpenId]);

  const handleMenuToggle = (orderId: string) => {
    if (menuOpenId === orderId) {
      setMenuOpenId(null);
      setMenuPosition(null);
      return;
    }
    setTimeout(() => {
      const btn = buttonRefs.current[orderId];
      if (btn) {
        const rect = btn.getBoundingClientRect();
        const menuHeight = 160;
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        let top = 0;
        let direction: 'down' | 'up' = 'down';
        if (spaceBelow < menuHeight && spaceAbove > menuHeight) {
          top = rect.top - menuHeight;
          direction = 'up';
        } else {
          top = rect.bottom;
          direction = 'down';
        }
        setMenuDirection(direction);
        setMenuPosition({
          top,
          left: rect.right - 180,
        });
      }
    }, 0);
    setMenuOpenId(orderId);
  };

  const handleMenuClose = () => {
    setMenuOpenId(null);
    setMenuPosition(null);
  };

  const handleOpenSendInvoiceModal = (order: AllOrder) => {
    setSelectedOrderForEmail(order);
    handleMenuClose();
  };

  return (
    <main className="!p-0 bg-white rounded-lg ">
      <div className="flex flex-wrap gap-4 mb-4 items-center justify-between">
        <div className="flex gap-4">
          <div className="w-full relative">
            <input
              type="text"
              placeholder="Tìm đơn hàng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleEnter}
              className="px-4 py-2 border rounded-md w-full"
            />
            <button
              onClick={handleSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
              aria-label="Search"
            >
              <FaSearch size={18} />
            </button>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
          >
            {showFilterPanel ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
          </button>
        </div>
      </div>

      {showFilterPanel && (
        <OrderFilterPanel
          key={searchParams.toString()}
          initialFilters={Object.fromEntries(
            searchParams as any as Iterable<[string, string]>,
          )}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          onApply={(filters) => {
            const newParams = new URLSearchParams(searchParams.toString());
            Object.entries(filters).forEach(([key, value]) => {
              if (value !== '') {
                newParams.set(key, String(value));
              } else {
                newParams.delete(key);
              }
            });
            newParams.set('page', '1');
            setSearchParams(newParams);
            setShowFilterPanel(false);
          }}
        />
      )}

      <div className="text-sm text-gray-700 mb-4">
        Hiển thị <strong>{orders?.orders?.length || 0}</strong> trên tổng{' '}
        <strong>{orders?.orders?.length || 0}</strong>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Đang tải dữ liệu...</span>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">
          <p>Có lỗi xảy ra khi tải dữ liệu</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Thử lại
          </button>
        </div>
      ) : !orders?.orders || orders.orders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Không tìm thấy đơn hàng nào</p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="min-w-[1200px] w-full bg-white text-sm text-gray-700">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2">No.</th>
                <th className="px-4 py-2">Tên khách hàng</th>
                <th className="px-4 py-2">SĐT</th>
                <th
                  className="px-4 py-2 cursor-pointer"
                  onClick={() => handleSort('createdAt')}
                >
                  <span className="flex items-center gap-1">
                    Ngày đặt {renderSortIcon('createdAt')}
                  </span>
                </th>
                <th
                  className="px-4 py-2 cursor-pointer"
                  onClick={() => handleSort('delivery_status')}
                >
                  <span className="flex items-center gap-1">
                    Trạng thái {renderSortIcon('delivery_status')}
                  </span>
                </th>
                <th
                  className="px-4 py-2 cursor-pointer"
                  onClick={() => handleSort('total_price')}
                >
                  <span className="flex items-center gap-1">
                    Tổng tiền {renderSortIcon('total_price')}
                  </span>
                </th>
                <th
                  className="px-4 py-2 cursor-pointer"
                  onClick={() => handleSort('payment_method')}
                >
                  <span className="flex items-center gap-1">
                    Thanh toán {renderSortIcon('payment_method')}
                  </span>
                </th>
                <th
                  className="px-4 py-2 cursor-pointer"
                  onClick={() => handleSort('delivery_type')}
                >
                  <span className="flex items-center gap-1">
                    Loại giao hàng {renderSortIcon('delivery_type')}
                  </span>
                </th>
                <th className="px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {(orders?.orders as AllOrder[])?.map(
                (order: AllOrder, index: number) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 text-center">
                      {index + 1 + (orders.currentPage - 1)}
                    </td>
                    <td className="px-4 py-2">
                      <div className="font-medium">
                        {getCustomerName(order)}
                      </div>
                    </td>
                    <td className="px-4 py-2">{getCustomerPhone(order)}</td>
                    <td className="px-4 py-2">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          order.status,
                        )}`}
                      >
                        {getStatusText(
                          order.status,
                          order.delivery_type as 'DELIVERY' | 'PICKUP',
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-2 font-medium">
                      <div>{order.total_price?.toLocaleString('vi-VN')}₫</div>
                      <div className="text-xs text-gray-500">
                        SL: {order.total_quantity}
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-col">
                        <span>
                          {getPaymentMethodText(order.payment_method)}
                        </span>
                        <span
                          className={`text-xs ${order.payment_status === 'PAID' ? 'text-green-600' : 'text-red-600'}`}
                        >
                          {order.payment_status === 'PAID'
                            ? 'Đã thanh toán'
                            : 'Chưa thanh toán'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      {getDeliveryTypeText(order.delivery_type)}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleViewOrder(order._id)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                        title="Xem chi tiết"
                      >
                        <FaEye size={18} />
                      </button>
                      <div className="relative inline-block">
                        <button
                          ref={(el) => (buttonRefs.current[order._id] = el)}
                          onClick={() => handleMenuToggle(order._id)}
                          className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-100"
                          title="Tùy chọn"
                          type="button"
                        >
                          <FaEllipsisV size={16} />
                        </button>
                        {menuOpenId === order._id && menuPosition && (
                          <div
                            ref={menuRef}
                            style={{
                              position: 'fixed',
                              top: menuPosition.top,
                              left: menuPosition.left,
                              zIndex: 9999,
                              minWidth: 180,
                            }}
                            className="bg-white border border-gray-200 rounded shadow-lg overflow-hidden animate-fade-in"
                          >
                            <button
                              className="flex items-center gap-2 w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                              onClick={() => {
                                setInvoiceReadyForPDF(false);
                                setInvoiceData(order._id);
                                setShowInvoice(true);
                                handleMenuClose();
                              }}
                            >
                              <FaEye className="text-gray-500" /> Xem hóa đơn
                            </button>
                            <button
                              className="flex items-center gap-2 w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                              onClick={() => handleExportPDF(order._id)}
                              disabled={isGeneratingPDF}
                            >
                              <BsDownload className="text-gray-500" />
                              {isGeneratingPDF
                                ? 'Đang xuất PDF...'
                                : 'Xuất file PDF'}
                            </button>
                            <button
                              className="flex items-center gap-2 w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                              onClick={() => handleOpenSendInvoiceModal(order)}
                            >
                              <BsSend className="text-gray-500" />
                              Gửi hóa đơn 
                            </button>

                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      )}

      {orders && orders.totalPages > 1 && (
        <AdminPagination
          currentPage={orders.currentPage}
          totalPages={orders.totalPages}
          onPageChange={(page) => {
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.set('page', String(page));
            setSearchParams(newParams);
          }}
          limit={Number(searchParams.get('limit') || 12)}
          onLimitChange={(newLimit) => {
            setSearchParams((prev) => {
              const newParams = new URLSearchParams(prev);
              newParams.set('limit', newLimit.toString());
              newParams.delete('page');
              return newParams;
            });
          }}
        />
      )}

      {/* Popup hóa đơn */}
      {showInvoice && invoiceData && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-40">
          <div className="relative max-w-4xl w-full">
            <button
              className="absolute top-2 right-6 text-3xl text-gray-500 hover:text-red-600 z-10 "
              onClick={() => setShowInvoice(false)}
            >
              ×
            </button>

            <div className="bg-white rounded shadow-[0_0_10px_5px_rgba(0,0,0,0.2)] max-h-[90vh] overflow-y-auto">
              <Invoice orderId={invoiceData} />
            </div>
          </div>
        </div>
      )}

      {/* Ẩn Invoice để export PDF */}
      <div
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '-9999px',
          width: '210mm',
          backgroundColor: 'white',
          visibility: 'hidden',
        }}
      >
        {invoiceDataExport && (
          <div
            ref={invoiceRef}
            style={{ color: 'black', backgroundColor: 'white' }}
          >
            <InvoiceExport
              orderId={invoiceDataExport}
              onReady={handleInvoiceReady}
            />
          </div>
        )}
      </div>

      {selectedOrderId && (
        <OrderDetail
          orderId={selectedOrderId}
          open={true}
          onClose={handleCloseOrderDetail}
        />
      )}

      <SendInvoiceModal
        orderId={selectedOrderForEmail?._id || ''}
        isOpen={!!selectedOrderForEmail}
        onClose={() => setSelectedOrderForEmail(null)}
        defaultEmail={selectedOrderForEmail?.user_id?.email || ''}
      />

      <ToastConfigAdmin />
    </main>
  );
};

export default OrderTable;
