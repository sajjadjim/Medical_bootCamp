import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaMoneyBillWave, FaHashtag, FaCreditCard, FaBoxOpen, FaClock, FaDownload, FaSearch, FaCopy } from 'react-icons/fa';
import useAuth from '../../../../Hook/useAuth';
import useAxiosSecure from '../../../../Hook/useAxiosSecure';

const isBDGateway = (method = '') =>
  /bkash|nagad|rocket|dbbl|upay/i.test(method);

const fmtAmount = (amt, method) => {
  const n = Number(amt) || 0;
  try {
    return isBDGateway(method)
      ? new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 2 }).format(n)
      : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n);
  } catch {
    return (isBDGateway(method) ? '৳' : '$') + n.toFixed(2);
  }
};

const copy = async (text) => {
  try { await navigator.clipboard.writeText(text); } catch {}
};

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: paymentsAll = [], isLoading } = useQuery({
    queryKey: ['/payments', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user?.email}`);
      return res.data || [];
    },
    enabled: !!user?.email,
  });

  // ------- UI state: search / date / sort -------
  const [search, setSearch] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [sort, setSort] = useState('date_desc'); // date_desc | date_asc | amount_desc | amount_asc

  // ------- Derived data -------
  const filtered = useMemo(() => {
    let arr = [...paymentsAll];

    if (search.trim()) {
      const s = search.toLowerCase();
      arr = arr.filter(p =>
        (p.campName || '').toLowerCase().includes(s) ||
        (p.paymentMethod || '').toLowerCase().includes(s) ||
        (p.transactionId || '').toLowerCase().includes(s)
      );
    }

    if (from) {
      const f = new Date(from).getTime();
      arr = arr.filter(p => new Date(p.paid_at).getTime() >= f);
    }
    if (to) {
      const t = new Date(to).getTime();
      arr = arr.filter(p => new Date(p.paid_at).getTime() <= t + 24*60*60*1000 - 1);
    }

    switch (sort) {
      case 'date_asc': arr.sort((a,b)=> new Date(a.paid_at)-new Date(b.paid_at)); break;
      case 'amount_desc': arr.sort((a,b)=> (b.amount||0)-(a.amount||0)); break;
      case 'amount_asc': arr.sort((a,b)=> (a.amount||0)-(b.amount||0)); break;
      default: // date_desc
        arr.sort((a,b)=> new Date(b.paid_at)-new Date(a.paid_at));
    }
    return arr;
  }, [paymentsAll, search, from, to, sort]);

  const totalPaid = useMemo(() => filtered.reduce((s,p)=> s + (Number(p.amount)||0), 0), [filtered]);
  const avgPaid   = filtered.length ? totalPaid / filtered.length : 0;

  const exportCSV = () => {
    const rows = [
      ['Camp Name','Camp ID','Amount','Currency','Payment Method','TxID','Email','Paid At'],
      ...filtered.map(p => [
        p.campName || '',
        p.campId || '',
        Number(p.amount) || 0,
        isBDGateway(p.paymentMethod) ? 'BDT' : 'USD',
        p.paymentMethod || '',
        p.transactionId || '',
        p.email || '',
        new Date(p.paid_at).toISOString(),
      ])
    ];
    const csv = rows.map(r => r.map(x => `"${String(x).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `payment_history_${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) return (
    <div className="flex justify-center items-center mt-20">
      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="p-4 max-w-7xl mx-auto font-inter">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-4xl font-extrabold text-indigo-700 tracking-tight drop-shadow-sm">
          💳 Payment History
        </h2>
        <p className="text-gray-600 mt-1">Search, filter, and export your payments.</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl bg-white/80 backdrop-blur-md border border-indigo-100 shadow p-4">
          <div className="text-sm text-gray-500">Total Paid</div>
          <div className="text-2xl font-bold mt-1">
            {/* Show two currencies if mixed; else format by first visible row */}
            {filtered.length
              ? fmtAmount(totalPaid, filtered[0]?.paymentMethod)
              : '—'}
          </div>
        </div>
        <div className="rounded-xl bg-white/80 backdrop-blur-md border border-green-100 shadow p-4">
          <div className="text-sm text-gray-500">Payments Count</div>
          <div className="text-2xl font-bold mt-1 text-green-600">{filtered.length}</div>
        </div>
        <div className="rounded-xl bg-white/80 backdrop-blur-md border border-purple-100 shadow p-4">
          <div className="text-sm text-gray-500">Average Amount</div>
          <div className="text-2xl font-bold mt-1">
            {filtered.length ? fmtAmount(avgPaid, filtered[0]?.paymentMethod) : '—'}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl shadow border border-indigo-50 p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="relative md:col-span-2">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              placeholder="Search camp, method, or TxID…"
              className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <input
            type="date"
            value={from}
            onChange={(e)=>setFrom(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="date"
            value={to}
            onChange={(e)=>setTo(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <div className="flex gap-2">
            <select
              value={sort}
              onChange={(e)=>setSort(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="date_desc">Sort by Date (newest)</option>
              <option value="date_asc">Sort by Date (oldest)</option>
              <option value="amount_desc">Amount (high → low)</option>
              <option value="amount_asc">Amount (low → high)</option>
            </select>
            <button
              onClick={exportCSV}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow active:scale-[0.98] flex items-center gap-2"
            >
              <FaDownload /> CSV
            </button>
          </div>
        </div>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-md border border-indigo-50 shadow rounded-3xl p-10 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-3">🗂️</div>
          <p className="text-gray-600">No payment records found with current filters.</p>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((pay) => (
            <div
              key={pay._id}
              className="bg-white/80 backdrop-blur-md border border-indigo-100 shadow-xl rounded-3xl hover:shadow-indigo-300 transition-all duration-300 ease-in-out p-6 flex flex-col gap-4 relative overflow-hidden group"
            >
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-indigo-100 rounded-full opacity-30 group-hover:scale-110 transition duration-300"></div>

              {/* Amount & method */}
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <FaMoneyBillWave className="text-green-500" />
                  {fmtAmount(pay.amount, pay.paymentMethod)}
                </h3>
                <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full capitalize font-medium shadow-sm">
                  {pay.paymentMethod}
                </span>
              </div>

              {/* TxID row */}
              <div className="text-gray-600 text-sm flex items-center gap-2">
                <FaHashtag className="text-gray-400" />
                <span className="font-medium">TxID:</span>
                <span className="text-xs break-all">{pay.transactionId}</span>
                {pay.transactionId ? (
                  <button
                    onClick={()=>copy(pay.transactionId)}
                    title="Copy TxID"
                    className="ml-auto text-indigo-600 hover:text-indigo-800"
                  >
                    <FaCopy />
                  </button>
                ) : null}
              </div>

              {/* Camp info */}
              <div className="text-gray-600 text-sm flex items-center gap-2">
                <FaBoxOpen className="text-purple-500" />
                <span className="font-medium">Camp:</span>
                <span className="text-xs font-semibold text-gray-800">{pay.campName}</span>
              </div>
              <div className="text-gray-600 text-sm flex items-center gap-2">
                <FaBoxOpen className="text-teal-400" />
                <span className="font-medium">ID:</span>
                <span className="text-xs">{pay.campId}</span>
              </div>

              {/* Email */}
              <div className="text-gray-600 text-sm flex items-center gap-2">
                <FaCreditCard className="text-yellow-500" />
                <span className="font-medium">Email:</span>
                <span className="text-xs break-all">{pay.email}</span>
              </div>

              {/* Date */}
              <div className="text-gray-600 text-sm flex items-center gap-2">
                <FaClock className="text-pink-500" />
                <span className="font-medium">Date:</span>
                <span className="text-xs">
                  {pay.paid_at ? new Date(pay.paid_at).toLocaleString() : '—'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
