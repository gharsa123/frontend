import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import QRCode from 'react-qr-code';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const InvoicePage = () => {
    const { invoiceId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const isValidating = new URLSearchParams(location.search).get("validate");

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await axios.get(`${apiBaseUrl}/order/invoice/${invoiceId}`);
                setOrder(res.data);
            } catch (err) {
                console.error('Gagal mengambil data invoice:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [invoiceId]);

    useEffect(() => {
        if (isValidating === "true") {
            alert("✅ Invoice valid!");
            navigate(`/invoice/${invoiceId}`, { replace: true });
        }
    }, [isValidating, navigate, invoiceId]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <div className="p-4">Loading...</div>;
    if (!order) return <div className="p-4 text-red-500">Invoice tidak ditemukan.</div>;

    return (
        <div className="min-h-screen bg-white p-4 max-w-md mx-auto text-sm text-gray-900 print:text-black print:p-0">
            <div className="text-center border p-4 rounded shadow print:shadow-none print:border-none">

                <img src="/LogoAbiBulat.png" alt="Logo" className="w-24 mx-auto mb-4 print:grayscale" />

                <div className="text-xs mb-2">
                    <p className='font-semibold text-sm'>Pondok Pinukuik Abi</p>
                    <p>Jl. By Pass No.Km 17, 25586</p>
                    <p>Kota Padang, Sumatera Barat</p>
                </div>

                <hr className="my-3 border-t border-dashed border-gray-400" />

                <p className="text-xs text-gray-500 mb-4">Scan untuk validasi</p>
                <div className="flex justify-center my-3">
                    <QRCode
                        value={`https://frontend-lyart-ten-26.vercel.app/invoice/${order.invoice_id}?validate=true`}
                        size={96}
                    />
                </div>

                <div className="mb-2">
                    <p className='font-bold text-xl mb-1'><strong>#</strong>{order.queue_number || '-'}</p>
                </div>

                <hr className="my-3 border-t border-dashed border-gray-400" />

                <div className="mb-1 flex justify-between text-xs text-gray-500">
                    <p><strong>Order Name:</strong> {order.name}</p>
                    <p>{order.invoice_id}</p>
                </div>

                <div className="text-left text-xs text-gray-500 mb-4">
                    {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between mb-1">
                            <span>{item.product.product_name} x{item.quantity}</span>
                            <span>Rp{(item.product.price * item.quantity).toLocaleString()}</span>
                        </div>
                    ))}
                </div>

                <div className="flex justify-between text-left text-xs text-gray-500 mb-4">
                    <span>Total</span>
                    <span>Rp{order.total.toLocaleString()}</span>
                </div>

                <hr className="my-3 border-t border-dashed border-gray-400" />

                <div className="flex justify-between text-left text-xs text-gray-500 mb-4">
                    <span>Closed</span>
                    <span>{new Date(order.createdAt).toLocaleString('id-ID', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                    })}</span>
                </div>

                <p className="text-xs text-gray-500 italic mt-3">Terima kasih atas pesanan Anda!</p>
                <p className="text-xs text-gray-500 italic">Salam Hangat "Pinukuik Abi Team"</p>

                <button
                    onClick={handlePrint}
                    className="bg-yellow-400 text-gray-700 mt-8 px-4 py-2 rounded-xl hover:bg-yellow-200 print:hidden"
                >
                    Cetak Invoice
                </button>
            </div>
        </div>
    );
};

export default InvoicePage;
